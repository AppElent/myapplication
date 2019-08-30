import React from 'react';

import useFetch from 'hooks/useFetch'
//import fetchBackend from 'helpers/fetchBackend';
import MaterialTable from 'material-table';
import {
  Card
} from '@material-ui/core';

const RekeningTable = () => {
    
  const [data /*, setData, loading, error*/] = useFetch('/api/rekeningen', {onMount: true})

  var columns = [{
    title: 'Naam',
    field: 'naam'
  },{
    title: 'Dag vd maand',
    field: 'dag',
    type: 'numeric'
  }, {
    title: 'Type',
    field: 'type'
  }, {
    title: 'Rekening',
    field: 'rekening'
  }]
  const months = [ 'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December' ];
  for(var i = 1; i < 13; i++){
    columns.push({
      title: months[i-1],
      field: 'month_'+i,
      type: 'numeric'
    });
  }

  return (
    <Card>

      <MaterialTable 
        columns={columns}
        data={data}
        editable={{
          //isEditable: rowData => rowData.name === "a", // only name(a) rows would be editable
          //isDeletable: rowData => rowData.name === "b", // only name(a) rows would be deletable
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  console.log(newData);
                }
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  console.log(newData, oldData);
                }
                resolve();
              }, 1000);
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  console.log(oldData);
                }
                resolve();
              }, 1000);
            })
        }}
        options={{
          pageSize: 10,
          padding: 'dense'
        }}
        title="Rekeningen"
      />

    </Card>

  )
}

export default RekeningTable