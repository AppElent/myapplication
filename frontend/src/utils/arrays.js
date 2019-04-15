

export const getObject = object => {
    const objectKeys = Object.keys(object);
    const objectKey = objectKeys[0];

    return object[objectKey];
};

export const groupBy = async (xs, key) => {
  const object = xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
  //let result = []
  return object

};

export const createArrayFromObject = async (object, key) => {
  const result = Object.entries(object).map((item) => {
      //const sum = this.sum(item[1], 'month_1')
      let array = {[key]: item[0], entries: item[1]}
      return array;
  });
  //const result = Object.values(object);
  console.log(result);
  return result
}

