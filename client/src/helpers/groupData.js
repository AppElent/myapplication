import _ from 'lodash';

const groupData = (key) => (xs) => {
  const object = xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
  //let result = []
  const result = Object.entries(object).map((item) => {
    //const sum = this.sum(item[1], 'month_1')
    let array = {rekening: item[0], entries: item[1]}
    for(var i = 1; i<13; i++){
      const sumvalue = _.sumBy(item[1], 'month_' + i);
      array['month_' + i] = sumvalue
    }
    return array;
  });
  return result
}

export default groupData;