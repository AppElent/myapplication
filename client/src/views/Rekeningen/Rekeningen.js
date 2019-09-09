// ./src/car/car.component.jsx
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import MaterialTable from 'material-table';

import useFetch from '../../hooks/useFetch';
import fetchBackend from 'helpers/fetchBackend';
import useSession from 'hooks/useSession';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const Rekeningen = () => {
  const classes = useStyles();
  const [data /*, setData, loading, error*/] = useFetch('/api/rekeningen', {onMount: true})
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
    <div className={classes.root}>
      <div className={classes.content}>
        <MaterialTable 
          columns={columns}
          data={data}
          editable={{
            //isEditable: rowData => rowData.name === "a", // only name(a) rows would be editable
            //isDeletable: rowData => rowData.name === "b", // only name(a) rows would be deletable
            onRowAdd: async newData => {
              console.log(newData);
              fetchBackend('/api/rekeningen', {method: 'POST', body: newData, user});
            },
            onRowUpdate: async (newData, oldData) => {
              console.log(newData, oldData, 999);
              fetchBackend('/api/rekeningen/' + oldData.id, {method: 'PUT', body: newData, user});
            },
            onRowDelete: async oldData => {
              fetchBackend('/api/rekeningen/' + oldData.id, {method: 'DELETE', user});
            }
          }}
          options={{
            pageSize: 10,
            padding: 'dense'
          }}
          title="Rekeningen"
        />
      </div>
    </div>
  );
};


export default Rekeningen
