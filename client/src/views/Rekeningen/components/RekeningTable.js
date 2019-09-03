import React from 'react';
import PropTypes from 'prop-types';

import MaterialTable from 'material-table';
import {
  Card
} from '@material-ui/core';
import FetchBackend from 'helpers/FetchBackend';
import useSession from 'hooks/useSession';


const RekeningTable = ({data}) => {
  const {user} = useSession();
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
          onRowAdd: async newData => {
            console.log(newData);
            FetchBackend('/api/rekeningen', {method: 'POST', body: newData, user});
          },
          onRowUpdate: async (newData, oldData) => {
            console.log(newData, oldData, 999);
            FetchBackend('/api/rekeningen/' + oldData.id, {method: 'PUT', body: newData, user});
          },
          onRowDelete: async oldData => {
            FetchBackend('/api/rekeningen/' + oldData.id, {method: 'DELETE', user});
          }
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

RekeningTable.propTypes = {
  data: PropTypes.any
}

export default RekeningTable