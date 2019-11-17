import fetchBackend from 'helpers/fetchBackend';
import moment from 'moment';

export const getEnelogicData = async (user, url, config) => {
  url +='?access_token=' + config.token.access_token;
  if(!config.measuringpoints) throw Error('Geen measuringpoints');
  if(config.measuringpoints.electra){
    url += '&mpointelectra=' + config.measuringpoints.electra.id;
  }
  if(config.measuringpoints.gas){
    url += '&mpointgas=' + config.measuringpoints.gas.id;
  }
  const data = await fetchBackend(url, {user});
  console.log(url, data);
  return data;
}

const getDifferenceArray = async (array, id, columnArray) => {
  var savedItems = {}
  //savedItems['first'] = array[0];
  savedItems['previous'] = array[0];
  for(var item of array){
    let index = array.findIndex((e) => e[id] === item[id]);
    for(var column of columnArray){
      if(column in savedItems){
              
      }
      let difference = item[column]-savedItems['previous'][column];
          
      array[index][column + '_diff'] = difference;
          
    }
    savedItems['previous'] = item;
  }
  return array;
}

const setVerbruikDates = async (data, timeframe) => {
  timeframe = timeframe.toLowerCase();
  let newData = await data.map(item => {
    if(timeframe === 'day'){
      item.datetime_verbruik = moment(item.datetime).add(-1, 'days').format('YYYY-MM-DD')
    }else if(timeframe === 'month'){
      item.datetime_verbruik = moment(item.datetime).add(-1, 'month').format('YYYY-MM')
    }else if(timeframe === 'year'){
      item.datetime_verbruik = moment(item.datetime).add(-1, 'year').format('YYYY')
    }else if(timeframe === 'quarter_of_an_hour'){
      item.datetime_verbruik = moment(item.datetime).add(-15, 'minutes').format('YYYY-MM-DD HH:mm')
    }
    return item;
  });
  newData = newData.filter((item, index) => index > 0)
  console.log(newData);
  return newData;
}

const addSolarEdgeData = async (data, start, end, timeframe, solarEdgeConfig, user) => {
  let solarEdgeUrl = '/api/solaredge/' + solarEdgeConfig.site.id + '/data/' + timeframe + '/' + start + '/' + end + '?access_token=' + solarEdgeConfig.access_token;
  try{
    let solaredgedata = await fetchBackend(solarEdgeUrl, {user});
    solaredgedata = solaredgedata.data.energy.values;
    for(let item of data){
      item['opwekking'] = null;
      let solaredgeitem = solaredgedata.find(entry => moment(entry.date).isSame(moment(item.datetime_verbruik)));
      if(solaredgeitem !== undefined && solaredgeitem.value !== null){
        item['opwekking'] = (Math.round(parseFloat(solaredgeitem.value)));
      }
    }
  }catch(err){
    return data;
  }

  return data;
}

const addNetto = async (data) => {
  data.forEach((item, i) => {
    data[i]['netto'] = item['180_diff'] - item['280_diff'];
    data[i]['netto_laag'] = item['181_diff'] - item['281_diff'];
    data[i]['netto_hoog'] = item['182_diff'] - item['282_diff'];
  });
  return data;
}

const addBruto = async (data) => {
  data.forEach((item, i) => {
    data[i]['bruto'] = item['180_diff'];
    if(item.opwekking !== undefined){
      data[i]['bruto'] = item['180_diff'] + item.opwekking - item['280_diff'];
    }
  });
  return data;
}

export const getData = async (user, datefrom, dateto, config) => {
  const momentdatefrom = moment(datefrom);
  let momentdateto = moment(dateto);
  if(momentdateto.isBefore(momentdatefrom)) throw 'Date to is before date from.';
  const isDayQuery = (momentdatefrom.isSame(momentdateto, 'day') ? true : false);
  const daysBetween = (momentdateto.diff(momentdatefrom, 'days'));
  const timeframe = isDayQuery ? 'QUARTER_OF_AN_HOUR' : (daysBetween > 60 ? (daysBetween > 364 ? 'YEAR' : 'MONTH') : 'DAY');



  console.log(isDayQuery, timeframe, daysBetween);
  //if(timeframe === 'QUARTER_OF_AN_HOUR') momentdateto = momentdatefrom.clone().add(1, 'days');
  let dataUrl = '/api/enelogic/data/' + timeframe + '/';
  if(isDayQuery){
    dataUrl += momentdatefrom.format('YYYY-MM-DD') + '/' + momentdatefrom.clone().add(1, 'days').format('YYYY-MM-DD')
  }else if(timeframe === 'DAY'){
    dataUrl += momentdatefrom.format('YYYY-MM-DD') + '/' + momentdateto.clone().add(1, 'days').format('YYYY-MM-DD')
  }else if(timeframe === 'MONTH'){
    dataUrl += momentdatefrom.clone().subtract(1, 'month').format('YYYY-MM-DD') + '/' + momentdateto.clone().add(1, 'days').format('YYYY-MM-DD')
  }else if(timeframe === 'YEAR'){
    dataUrl = '/api/enelogic/data/year/' + momentdatefrom.clone().subtract(1, 'year').format('YYYY-MM-DD') + '/' + momentdateto.clone().add(1, 'days').format('YYYY-MM-DD')
  }
  console.log(dataUrl);
  let data = await getEnelogicData(user, dataUrl, config.enelogic);
  data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
  data = await setVerbruikDates(data, timeframe);
  data = await addNetto(data);
  if(config.solaredge.success){
    data = await addSolarEdgeData(data, momentdatefrom.format('YYYY-MM-DD'), momentdateto.format('YYYY-MM-DD'), timeframe, config.solaredge, user);
    data = await addBruto(data);
  }

  return data;
}

export const saveEnelogicSettings = (user, ref, enelogicConfig) => async (accesstoken) => {
  if(enelogicConfig === undefined) enelogicConfig = {}
  if(!accesstoken.success){
    enelogicConfig.success = false
    await ref.update({enelogic: enelogicConfig});
    return;
  }
  enelogicConfig['token'] = accesstoken.data;
  try{
    const measuringpoints = await fetchBackend('/api/enelogic/measuringpoints?access_token=' + accesstoken.data.access_token, {user});
    enelogicConfig.measuringpoints = {}
    const mpointelectra = measuringpoints.data.find(item => (item.active === true && item.unitType === 0))
    if(mpointelectra !== undefined) enelogicConfig.measuringpoints.electra = mpointelectra;
    const mpointgas = measuringpoints.data.find(item => (item.active === true && item.unitType === 1))
    if(mpointgas !== undefined) enelogicConfig.measuringpoints.gas = mpointgas;
    enelogicConfig.success = true;
  }catch(err){
    enelogicConfig.success = false;
  }
  await ref.update({enelogic: enelogicConfig});
}

export const updateEnelogicSettings = (ref, enelogicConfig) => async (accesstoken) => {
  if(enelogicConfig === undefined) enelogicConfig = {}
  if(!accesstoken.success){
    enelogicConfig.success = false
    await ref.update({enelogic: enelogicConfig});
    return;
  }
  enelogicConfig['token'] = accesstoken.data;
  enelogicConfig['success'] = true;
  await ref.update({enelogic: enelogicConfig});
}

export const deleteEnelogicSettings = async (ref) => {
  await ref.update({enelogic: {success: false}})
}

export const getMeasuringPoints = async () => {

}
