import React from 'react';
import { MTableEditField } from 'material-table';

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

const checkDataObject = (data, columns) => {
  if(columns !== undefined){
    columns.forEach(column => {
      if(column.required && column.required === true && !data[column.field] && data[column.field] !== 0){
        console.log('Column ' + column.field + ' is mandatory', data[column.field], data)
        alert('Column "' + column.title + '" is verplicht')
        throw ('Column ' + column.field + ' is mandatory');
      }
    })
  }
}

export const addData = (ref, prop, columns) => async (data) => {
  data = getDataObject(data, columns);
  checkDataObject(data, columns);
  console.log(data);
  await ref.doc(data[prop]).set(data);
}

export const updateData = (ref, prop, columns) => async (data) => {
  data = getDataObject(data, columns);
  checkDataObject(data, columns);
  console.log(data);
  await ref.doc(data[prop]).set(data);
}

export const deleteData = (ref, prop, columns) => async (data) => {
  data = getDataObject(data, columns);
  console.log(data);
  await ref.doc(data[prop]).delete();
}

export const RequiredField = (props) => {
  if (props.columnDef.required && (props.value === undefined)) {
    return (<MTableEditField {...props} />);
  }
  if (props.columnDef.required && props.value.length === 0) {
    return (<MTableEditField {...props} error label="Required" />);
  }
  return (<MTableEditField {...props} />);
}

