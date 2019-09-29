const fetch = require('node-fetch')
import moment from 'moment';

export default class Enelogic {

  constructor(api_key) {
    this.api_key = api_key;
    this.host = 'https://enelogic.com/api';
  }
  
  fetchEnelogic = async (url, options) => {
      const response = await fetch(url, options);
      if(response.status !== 200) {
          console.log(response);
          throw ("Error fetching enelogic data from URL " + url + ": " + response.status + " - " + response.statusText);
      }
      const data = await response.json();
      return data;
  }

  getMeasuringPoints = async () => {
      const response = await this.fetchEnelogic(this.host + '/measuringpoints?access_token=' + this.api_key).catch(err => {return {success: false, message: err}});
      return response;
  }
  
  getMeasuringPointsGas = async () => {
      const data = await this.getMeasuringPoints();
      return (data.filter(line => line.unitType === 1));
  }
  
  getMeasuringPointsElectricity = async () => {
      const data = await this.getMeasuringPoints();
      return (data.filter(line => line.unitType === 0));
  }

  formatData = (results, data, accessor = 'date') => {
    for(var line of data){
        const index = results.findIndex((e) => e.datetime === line[accessor]);
        let obj = {datetime: (line[accessor]), [line.rate]: Math.round(parseFloat(line.quantity)*1000)}
        if(index === -1){
            results.push(obj);
        }else{
            results[index][line.rate] = parseFloat(line.quantity)*1000
        }
    }
    return results;
  }

  addHoogLaagInfo = (results, period, options = {}) => {
    let previous = results[0];
    for(var entry of results){
      let index = results.findIndex((e) => e.datetime === entry.datetime);
      
      if(period.toUpperCase() !== 'QUARTER_OF_AN_HOUR'){
        results[index][180] = entry[181] + entry[182];
        results[index][280] = entry[281] + entry[282];
      }else{
        let difference1 = entry[180]-previous[180];
        if(entry[280] === undefined) {entry[280] = 0;previous[280] = 0;}
        let difference2 = entry[280]-previous[280];
        //console.log(index, difference1, difference2);
        let date = new Date(entry.datetime);
        if(!options.startLaag) options.startLaag = 23;
        if(!options.startHoog) options.startHoog = 7;
        if(!options.weekendLaag) options.weekendLaag = true;
        let starthoog = moment(date).hours(options.startHoog).minutes(0).seconds(0);
        let startlaag = moment(date).hours(options.startLaag).minutes(0).seconds(0);
        //console.log(date.getDay(), starthoog.toDate().getTime(), startlaag.toDate().getTime(), date.getTime());
        entry[181] = previous[181];
        entry[182] = previous[182];
        entry[281] = previous[281];
        entry[282] = previous[282];
        if((options.weekendLaag && (date.getDay() === 0 || date.getDay() === 6)) || date.getTime() <= starthoog.toDate().getTime() || date.getTime() > startlaag.toDate().getTime()){
          entry[181] += difference1;
          entry[281] += difference2;
        }else{
          entry[182] += difference1;
          entry[282] += difference2;
        }
        if (entry[281] === undefined) entry[281] = 0;
        if (entry[282] === undefined) entry[282] = 0;
        results[index] = entry;
        
        //previous1 = entry[180];
        //previous2 = entry[280];
        previous = entry;
      }
    }
    return results;
  }


  getData = async (datefrom, dateto, period, options) => {
      period = period.toUpperCase();
      if (!['DAY', 'QUARTER_OF_AN_HOUR', 'MONTH'].includes(period)) throw "You have to specify period (string) as DAY or QUARTER_OF_AN_HOUR or MONTH. Given: " + period;
      const momentdatefrom = moment(datefrom);
      const momentdateto = moment(dateto);

      let periodUrl;
      switch(period){
        case 'QUARTER_OF_AN_HOUR':
          periodUrl = 'datapoints'
          break;
        case 'DAY':
          periodUrl = 'datapoint/days';
          break;
        case 'MONTH':
          periodUrl = 'datapoint/months';
      }
      const datapointUrl = this.host +'/measuringpoints/' + options.mpointelectra + '/' + periodUrl + '/'+momentdatefrom.format('YYYY-MM-DD')+'/'+momentdateto.format('YYYY-MM-DD')+'?access_token='+this.api_key;
      const data = await this.fetchEnelogic(datapointUrl);
      return data;
  }

  
  getFormattedData = async (datefrom, dateto, period, options) => {
    let results = []  
    const momentdateto = (period === 'QUARTER_OF_AN_HOUR' ? moment(datefrom).add(1, 'days') : moment(dateto))
    const data = await this.getData(datefrom, momentdateto.format('YYYY-MM-DD'), period, options);
    if(period === 'QUARTER_OF_AN_HOUR'){
        const daydata = await this.getData(datefrom, momentdateto.format('YYYY-MM-DD'), 'DAY', options);
        results = this.formatData(results, daydata, 'date');
    }
    results = this.formatData(results, data, (period === 'QUARTER_OF_AN_HOUR' ? 'datetime' : 'date'));
    results.sort((a,b) => (a.datetime > b.datetime) ? 1 : -1); 
    results = this.addHoogLaagInfo(results, period);
    return results;
  }

  
}

//const enelogic = new Enelogic(123);



