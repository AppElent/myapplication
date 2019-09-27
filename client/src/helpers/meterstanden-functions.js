import moment from 'moment';
import 'moment-timezone';

import fetchBackend from 'helpers/fetchBackend';
import { Exception } from 'handlebars';

export const isDayQuery = (localtimeframe) => (['minute', 'quarter', 'hour'].includes(localtimeframe))

export const addSolarEdgeData = async (data, values, user) => {
  let dayQuery = isDayQuery(values.timeframe);
  let timeframeSolarEdge = values.timeframe;
  timeframeSolarEdge = (dayQuery ? 'quarter_of_an_hour' : timeframeSolarEdge);
        
  let solarEdgeUrl = (dayQuery ? '/api/solaredge/data/quarter_of_an_hour/' + values.datefrom + '/' + moment(values.dateto).clone().add(1, 'days').format('YYYY-MM-DD') : '/api/solaredge/data/' + timeframeSolarEdge + '/' + values.datefrom + '/' + values.dateto);

  //const solarEdgeUrl = await (timeframe === 'day' ? '/api/solaredge/data/day/' + values.datefrom + '/' + moment(dateto).clone().add(1, 'days').format('YYYY-MM-DD') : '/api/solaredge/data/quarter_of_an_hour/' + values.datefrom + '/' + moment(dateto).clone().add(1, 'days').format('YYYY-MM-DD'));
  try{
    let solaredgedata = await fetchBackend(solarEdgeUrl, {user});
    solaredgedata = solaredgedata.energy.values;
    //hiero
    for(let item of data){
      //let item = data[i];
      let i = data.findIndex((e) => e.datetime === item.datetime);
      data[i]['opwekking'] = null;
      //let correctdate = timeframe === 'day' ? moment(item.datetime).subtract(1, 'days') : moment(item.datetime);
      let solaredgeitem = solaredgedata.find(entry => moment(entry.date).isSame(moment(item.datetime)));
      if(solaredgeitem !== undefined && solaredgeitem.value !== null){
        data[i]['opwekking'] = (Math.round(parseFloat(solaredgeitem.value)));
      }
    }
  }catch(err){
    return data;
  }

  return data;
}
    
export const addBrutoNetto = async (data) => {
  data.forEach((item, i) => {
    data[i]['bruto'] = item['180_diff'];
    if(item.opwekking !== undefined){
      data[i]['bruto'] = item['180_diff'] + item.opwekking - item['280_diff'];
    }
    data[i]['netto'] = item['180_diff'] - item['280_diff'];
  });
  return data;
}
    

export const getTableData = async (values, localdata, user) => {
        
  //---setLoading(true);
  console.log('Getting electricity data');
  const localdatacopy = JSON.parse(JSON.stringify(localdata))
  const firstdate = localdatacopy.length > 0 ? localdatacopy[0].datetime : moment().add(2, 'days').format('YYYY-MM-DD')
        
  const dayQuery = isDayQuery(values.timeframe);
        
  const momentdatefrom = moment(values.datefrom);
  const momentdateto = moment(values.dateto);
        
  let localquery = (momentdatefrom.isAfter(moment(firstdate)) ? true: false);
  let fillWithLocalData = (momentdatefrom.isBefore(moment(firstdate)) && moment().isSame(momentdateto, 'd') && localdatacopy.length > 0 ? true: false);
  let returndata = '';
        
        
  if(localquery){
    if(dayQuery){
      returndata = localdatacopy.filter((item: any) =>
        moment(item.datetime) >= (momentdatefrom) && moment(item.datetime) <= (momentdateto.clone().add(1, 'days'))
      );
      if(values.timeframe === 'quarter'){
        returndata = returndata.filter((item: any) =>
          ['15', '30', '45', '00'].includes(moment(item.datetime).format("mm"))
        );
      }else if(values.timeframe === 'hour'){
        returndata = returndata.filter((item: any) =>
          moment(item.datetime).format("mm") === '00'
        );
      }
    }else if(values.timeframe === 'day'){
      returndata = localdatacopy.filter((item: any) =>
        moment(item.datetime) >= (momentdatefrom) && moment(item.datetime) <= (momentdateto.clone().add(1, 'days')) && moment(item.datetime).format("HH:mm:ss") === "00:00:00"
      );
    }
  }else{
    let dataUrl = '';
    if(dayQuery){
      dataUrl = '/api/enelogic/data/kwartier/' + momentdatefrom.format('YYYY-MM-DD') + '/' + momentdatefrom.clone().add(1, 'days').format('YYYY-MM-DD')
    }else if(values.timeframe === 'day'){
      dataUrl = '/api/enelogic/data/dag/' + values.datefrom + '/' + momentdateto.clone().add(1, 'days').format('YYYY-MM-DD')
    }else{
      dataUrl = '/api/enelogic/data/dag/' + momentdatefrom.clone().subtract(1, 'month').format('YYYY-MM-DD') + '/' + momentdateto.clone().add(1, 'days').format('YYYY-MM-DD')
    }
            

    returndata = await fetchBackend(dataUrl, {user}).catch(err => {console.log(err); return []});
    if(values.timeframe === 'month'){
      returndata = returndata.filter((item, index) =>
        moment(item.datetime).format("DD") === '01' || index === 0 || index === (returndata.length - 1)
      );
    }

            
            
  }
        
        
  if(fillWithLocalData){
    if(values.timeframe === 'day'){
      const yesterday = moment();
      let yesterdaydata = localdatacopy.find((item: any) =>
        moment(item.datetime).format("YYYY-MM-DD HH:mm:ss") === (yesterday.format('YYYY-MM-DD') + " 00:00:00" )
      );
      let index = returndata.findIndex(entry => moment(entry.datetime).isSame(moment(yesterdaydata.datetime)));
      if(index === -1){
        returndata.push(yesterdaydata);
      }
    }
  }
        
  ////returndata = await getDifferenceArray(returndata, 'datetime', ['180', '181', '182', '280', '281', '282']);
        
  if(values.timeframe === 'day'){
    returndata.forEach( item => item.datetime = moment(item.datetime).subtract(1, 'days'));
  }else if(values.timeframe === 'month'){
    returndata.forEach( item => item.datetime = moment(item.datetime).subtract(1, 'months'));
  }
        
  //Zet datum formaat
  const format = dayQuery ? "YYYY-MM-DD HH:mm" : (values.timeframe === 'day' ? "YYYY-MM-DD" : "YYYY-MM");
  returndata.forEach( item => item.datetime = moment(item.datetime).format(format) );
        
  returndata = await addSolarEdgeData(returndata);
  returndata = await addBrutoNetto(returndata);
        
  //Eerste entry eruit omdat deze van een dag of maand eerder is
  if(dayQuery === false && returndata.length > 1){
    if(values.timeframe === 'month') {
      returndata = returndata.filter((item, index) => index > 1)
    }else{
      returndata = returndata.filter((item, index) => index > 0)
    }
            
  }
        
  return (returndata);
  //---setLoading(false )
  //console.log(data);
}

const getEnelogicData = async (url, config) => {
  url +='?access_token=' + config.token.access_token;
  if(!config.measuringpoints) throw Error('Geen measuringpoints');
  if(config.measuringpoints.electra){
    url += '&mpointelectra=' + config.measuringpoints.electra.id;
  }
  if(config.measuringpoints.gas){
    url += '&mpointgas=' + config.measuringpoints.gas.id;
  }
  const response = await fetch(url);
  const data = await response.json();
  console.log(url);
  return data;
}

export const getDifferenceArray = async (array, id, columnArray) => {
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

export const getData = async (user, datefrom, dateto, enelogicConfig) => {
  const momentdatefrom = moment(datefrom);
  let momentdateto = moment(dateto);
  if(momentdateto.isBefore(momentdatefrom)) throw Exception('Date to is before date from.')
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
    dataUrl = '/api/enelogic/data/month/' + momentdatefrom.clone().subtract(1, 'year').format('YYYY-MM-DD') + '/' + momentdateto.clone().add(1, 'days').format('YYYY-MM-DD')
  }
  console.log(dataUrl);
  let data = await getEnelogicData(dataUrl, enelogicConfig);
  data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
  return data;
}
    
   
export const processLocalData = async (data) => {
  //Sort on date, just to be sure
  data = data.sort((a, b) => (a.datetime > b.datetime) ? 1 : -1);
  return data;
}