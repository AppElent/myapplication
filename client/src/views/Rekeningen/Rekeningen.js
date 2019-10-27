// ./src/car/car.component.jsx
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { useFirestoreCollectionData, useSession, useFetch } from 'hooks';
import { Table } from 'components';
import {addData, updateData, deleteData} from 'modules/MaterialTable';

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
  const {user, userInfo, ref} = useSession();
  const {data, loading, error, ref: collectionRef} = useFirestoreCollectionData(ref.collection('rekeningen'));
  const {data: accountdata, loading: accountsloading, error: accountserror, request} = useFetch('/api/bunq/accounts', {user});

  useEffect(() => {
    if(userInfo.bunq.success) request.get();
  }, [])
  console.log(accountdata);

  var columns = [{
    title: 'Naam',
    field: 'naam',
    editable: 'onAdd',
    required: true
  },{
    title: 'Dag vd maand',
    field: 'dag',
    type: 'numeric',
    initialEditValue: 1
  }, {
    title: 'Type',
    field: 'type',
    initialEditValue: 'Rekening',
    lookup: {
      'Rekening': 'Rekening',
      'Sparen': 'Sparen',
      'Apart zetten': 'Apart zetten',
      'Onregelmatige uitgaven': 'Onregelmatige uitgaven'
    }
  }]
  if(userInfo.bunq.success) {
    const accountObject = {}
    accountdata.filter(account => account.status === 'ACTIVE').forEach(account => {
      accountObject[account.description] = account.description
    })
    console.log(accountObject);
    columns.push({
      title: 'Rekening',
      field: 'rekening',
      lookup: accountObject
    })
  }
  const months = [ 'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December' ];
  for(var i = 1; i < 13; i++){
    columns.push({
      title: months[i-1],
      field: 'month_'+i,
      type: 'numeric',
      initialEditValue: 1,
      required: true
    });
  }

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Table 
          columns={columns}
          data={data}
          editable={{
            onRowAdd: addData(ref.collection('rekeningen'), 'naam', columns),
            onRowUpdate: updateData(ref.collection('rekeningen'), 'naam', columns),
            onRowDelete: deleteData(ref.collection('rekeningen'), 'naam', columns)
          }}
          options={{
            exportAllData: true,
            exportButton: true,
            exportFilename: 'Rekeningen.csv'
          }}
          title="Rekeningen"
        />
      </div>
    </div>
  );
};


export default Rekeningen
