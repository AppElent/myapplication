import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  TextField, 
  Typography
} from '@material-ui/core';

import { useForm, useSession, useFirestoreCollectionData } from 'hooks';
import { Table } from 'components';
import {addData, updateData, deleteData} from 'modules/MaterialTable';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}));

const KostenOverzicht = ({}) => {
  const classes = useStyles();
  const {user, userInfo, ref} = useSession();
  const {data, loading, error, ref: collectionRef} = useFirestoreCollectionData(ref.collection('energiekosten'));

  const {hasError, isDirty, state, handleOnChange, handleOnSubmit, submitting, setInitial} = useForm({dal: 1000, normaal: 1000}, {}, () => {});

  const columns = [{
    title: 'Leverancier',
    field: 'leverancier',
    required: true,
    editable: 'onAdd'
  },{
    title: 'Vaste kosten per jaar',
    field: 'vaste_kosten_jaar',
    type: 'numeric',
    required: true,
    initialEditValue: 0
  },{
    title: 'Prijs per KwH daltarief',
    field: 'kwh_prijs_dal'
  },{
    title: 'Prijs per KwH normaaltarief',
    field: 'kwh_prijs_normaal'
  },{
    title: 'Korting per jaar',
    field: 'korting',
    required: true,
    initialEditValue: 0
  },{
    title: 'Totaal',
    render: rowData => rowData ? '€' + (Math.round((rowData.vaste_kosten_jaar + (Number(rowData.kwh_prijs_dal) * state.dal.value) + (Number(rowData.kwh_prijs_normaal) * state.normaal.value) - rowData.korting) * 100) / 100): '€0' ,
    editable: 'never'
  }]

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <TextField
          label="Verbruik dal"
          name="dal"
          onChange={handleOnChange}
          type="number"
          value={state.dal.value}
          variant="outlined"
        />
        <TextField
          label="Verbruik normaal"
          name="normaal"
          onChange={handleOnChange}
          type="number"
          value={state.normaal.value}
          variant="outlined"
        />
      </div>
      <Table 
        columns={columns}
        data={data}
        editable={{
          onRowAdd: addData(ref.collection('energiekosten'), 'leverancier', columns),
          onRowUpdate: updateData(ref.collection('energiekosten'), 'leverancier', columns),
          onRowDelete: deleteData(ref.collection('energiekosten'), 'leverancier', columns)
        }}
        title="Aanbiedingen"
      />
    </div>
  );
};


export default KostenOverzicht;
