const fetch = require('node-fetch')

export default class Enelogic {

  constructor(api_key) {
    this.api_key = api_key;
    this.host = 'https://enelogic.com';
  }
  
  async fetchEnelogic = (url, options) => {
      const response = await fetch(url, options);
      if(response.status !== 200) {
          console.log(response);
          throw ("Error fetching enelogic data from URL " + url + ": " + response.status + " - " + response.statusText);
      }
      const measuringpoints = await response.json();
      return measuringpoints;
  }

  getMeasuringPoints = async () => {
      const response = await this.fetchEnelogic(this.host + '/api/measuringpoints?access_token=' + this.api_key).catch(err => {success: false, message: err});
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


  getData = async (options) => {
      options.period = options.period.toUpperCase();
      if (!['DAY', 'QUARTER_OF_AN_HOUR'].includes(options.period)) throw "You have to specify period (string) as DAY or QUARTER_OF_AN_HOUR"
      const datefrom = moment(options.from);
      const dateto = moment(options.to);
      const date_accessor = (options.period === 'DAY' ? 'date' : 'datetime');

      const periodUrl = (options.period === 'DAY' ? 'datapoints' : 'datapoint/days')
      const datapointUrl = this.host +'/measuringpoints/' + options.mpointelectra + '/' + periodUrl + '/'+datefrom.format('YYYY-MM-DD')+'/'+dateto.format('YYYY-MM-DD')+'?access_token='+this.api_key;
      const data = this.fetchEnelogic(datapointUrl);
      return data;
  }
  
  getFormattedData = async (options) =? {
      const data = await this.getData(options);
      return data;
  }

  
}

//const enelogic = new Enelogic(123);



