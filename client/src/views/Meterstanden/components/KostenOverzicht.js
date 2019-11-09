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
  },
  textfields: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const KostenOverzicht = ({}) => {
  const classes = useStyles();
  const {user, userInfo, ref} = useSession();
  const {data, loading, error, ref: collectionRef} = useFirestoreCollectionData(ref.collection('energiekosten'));

  const {hasError, isDirty, state, handleOnChange, handleOnSubmit, submitting, setInitial} = useForm({dal: 1000, normaal: 1000, gas: 0, netbeheer: 0, verlaging_energiebelasting: 0}, {}, () => {}, {localStorage: 'energiekosten'});

  const columns = [{
    title: 'Leverancier',
    field: 'leverancier',
    required: true,
    editable: 'onAdd'
  },{
    title: 'Aanbieder',
    field: 'aanbieder'
  },{
    title: 'Looptijd',
    field: 'looptijd'
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
    title: 'Prijs per M3 gas',
    field: 'gas_prijs'
  },{
    title: 'Korting per jaar',
    field: 'korting',
    required: true,
    initialEditValue: 0
  },{
    title: 'Totaal',
    render: rowData => rowData ? '€' + (Math.round(
      (
        (rowData.vaste_kosten_jaar || 0) + 
        (Number(rowData.gas_prijs) * state.gas.value || 0) + 
        (Number(rowData.kwh_prijs_dal) * state.dal.value || 0) + 
        (Number(rowData.kwh_prijs_normaal) * state.normaal.value || 0) - 
        (rowData.korting || 0) - 
        (state.verlaging_energiebelasting.value || 0) + 
        (state.netbeheer.value || 0)
      ) * 100) / 100): '€0' ,
    editable: 'never'
  },{
    title: 'Per maand',
    render: rowData => rowData ? '€' + (Math.round(
      (
        (rowData.vaste_kosten_jaar || 0) + 
        (Number(rowData.gas_prijs) * state.gas.value || 0) + 
        (Number(rowData.kwh_prijs_dal) * state.dal.value || 0) + 
        (Number(rowData.kwh_prijs_normaal) * state.normaal.value || 0) - 
        (rowData.korting || 0) - 
        (state.verlaging_energiebelasting.value || 0) + 
        (state.netbeheer.value || 0)
      ) * 100) / 100 / 12): '€0' ,
    editable: 'never'
  }]

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <TextField
          className={classes.textfields}
          label="Verbruik KwH dal"
          name="dal"
          onChange={handleOnChange}
          type="number"
          value={state.dal.value || 0}
        />
        <TextField
          className={classes.textfields}
          label="Verbruik KwH normaal"
          name="normaal"
          onChange={handleOnChange}
          type="number"
          value={state.normaal.value || 0}
        />
        <TextField
          className={classes.textfields}
          label="Verbruik gas"
          name="gas"
          onChange={handleOnChange}
          type="number"
          value={state.gas.value || 0}
        />
        <TextField
          className={classes.textfields}
          label="Netbeheer kosten"
          name="netbeheer"
          onChange={handleOnChange}
          type="number"
          value={state.netbeheer.value || 0}
        />
        <TextField
          className={classes.textfields}
          label="Verlaging energiebelasting"
          name="verlaging_energiebelasting"
          onChange={handleOnChange}
          type="number"
          value={state.verlaging_energiebelasting.value || 0}
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
