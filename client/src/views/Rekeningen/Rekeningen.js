// ./src/car/car.component.jsx
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import MaterialTable from 'material-table';

import {useFirestoreCollectionData} from 'hooks/useFirestore';
import useSession from 'hooks/useSession';
import {addData, updateData, deleteData} from 'helpers/material-table-editable-functions';

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
  const {ref} = useSession();
  //const [data, setData, loading, error] = useFetch('/api/rekeningen', {onMount: true})
  const {value, loading, error, ref: collectionRef} = useFirestoreCollectionData(ref.collection('rekeningen'));
  
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

  function pushToArray(arr, obj) {
    const index = arr.findIndex((e) => e.id === obj.id);

    if (index === -1) {
      arr.push(obj);
    } else {
      arr[index] = obj;
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <MaterialTable 
          columns={columns}
          data={value}
          editable={{
            //isEditable: rowData => rowData.name === "a", // only name(a) rows would be editable
            //isDeletable: rowData => rowData.name === "b", // only name(a) rows would be deletable
            onRowAdd: addData(ref.collection('rekeningen'), 'naam'),
            onRowUpdate: updateData(ref.collection('rekeningen'), 'naam'),
            onRowDelete: deleteData(ref.collection('rekeningen'), 'naam')
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
