
const getDataObject = (data, columns) => {
  if(columns !== undefined){
    const keys = Object.keys(data);
    for(var key of keys){
      const foundColumn = columns.find(column => column.field === key);
      console.log(foundColumn, key);
      if(foundColumn !== undefined){
        if(foundColumn.type && foundColumn.type === 'numeric'){
          data[key] = parseInt(data[key]);
        }
      }
    }
  }
  return data;
}

export const addData = (ref, prop, columns) => async (data) => {
  data = getDataObject(data, columns);
  console.log(data);
  await ref.doc(data[prop]).set(data);
}

export const updateData = (ref, prop, columns) => async (data) => {
  data = getDataObject(data, columns);
  console.log(data);
  await ref.doc(data[prop]).set(data);
}

export const deleteData = (ref, prop, columns) => async (data) => {
  data = getDataObject(data, columns);
  console.log(data);
  await ref.doc(data[prop]).delete();
}

