
const getDataObject = (data, columns) => {
  if(columns !== undefined){
    const keys = Object.keys(data);
    for(var objectkey of keys){
      const foundColumn = columns.find(column => column.field === objectkey);
      if(foundColumn !== undefined){
        if(foundColumn.type && foundColumn.type === 'numeric'){
          data[objectkey] = parseInt(data[objectkey]);
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

