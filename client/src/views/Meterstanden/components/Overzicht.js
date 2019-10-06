
import React, { useState } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { makeStyles } from '@material-ui/styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { LoadingButton } from 'components';
import MaterialTable from 'material-table';
import {refresh} from 'helpers/Oauth';
import {updateEnelogicSettings, getData} from 'helpers/Enelogic';
import useForm from 'hooks/useForm';
import useSession from 'hooks/useSession';



const useStyles = makeStyles(theme => ({
  root: {
    //padding: theme.spacing(3)
  }, 
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  spacer: {
    flexGrow: 1
  },
  content: {
    padding: theme.spacing(2)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  button: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1)
  }
}));


const Overzicht = () => {
  const classes = useStyles();
  const {user, userData, userDataRef} = useSession();

  const haalDataOp = async () => {
    console.log(userData.enelogic);
    const refreshedtoken = await refresh(user, '/api/oauth/refresh/enelogic', userData.enelogic.token)
    console.log(refreshedtoken);
    if(refreshedtoken !== null) updateEnelogicSettings(userDataRef, userData.enelogic)
    let data = await getData(user, state.datefrom.value, state.dateto.value, userData.enelogic, userData.solaredge);
    console.log(data);
    setData(data);
  }

  const datefrom = (moment().date() < 3 ? moment().startOf('month').add(-1, 'month') : moment().startOf('month')).toDate()//
  const dateto = moment().add(-1, 'days').toDate();

  const {state, handleOnValueChange, handleOnSubmit, submitting} = useForm({datefrom, dateto}, {}, haalDataOp);
  const [data, setData] = useState([]);

  if(!userData.enelogic.success) return <div></div>


  var columns = [{
    title: 'Datum',
    field: 'datetime_verbruik'
  },{
    title: 'KwH verbruik laag',
    field: '181',
    render: rowData => (rowData['181'] + ' (' + rowData['181_diff'] + ')')
  }, {
    title: 'KwH verbruik hoog',
    field: '182',
    render: rowData => (rowData['182'] + ' (' + rowData['182_diff'] + ')')
  }, {
    title: 'Verbruik totaal',
    field: '180',
    render: rowData => (rowData['180'] + ' (' + rowData['180_diff'] + ')')
  }, {
    title: 'KwH teruglevering laag',
    field: '281',
    render: rowData => (rowData['281'] + ' (' + rowData['281_diff'] + ')')
  }, {
    title: 'KwH teruglevering hoog',
    field: '282',
    render: rowData => (rowData['282'] + ' (' + rowData['282_diff'] + ')')
  }, {
    title: 'Teruglevering totaal',
    field: '280',
    render: rowData => (rowData['280'] + ' (' + rowData['280_diff'] + ')')
  }]
  if(userData.solaredge.success) columns.push({
    title: 'Opwekking',
    field: 'opwekking'
  }, {
    title: 'Netto',
    field: 'netto'
  }, {
    title: 'Bruto',
    field: 'bruto'
  });

  return <div>
    <div className={classes.root}>
      <div className={classes.row}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            format="yyyy-MM-dd"
            id="date-picker-datefrom"
            KeyboardButtonProps={{
              'aria-label': 'change date from',
            }}
            label="Datum vanaf"
            margin="normal"
            minDate={new Date(userData.enelogic.measuringpoints.electra.dayMin)}
            onChange={handleOnValueChange('datefrom')}
            value={state.datefrom.value}
            variant="inline"
          />
          <KeyboardDatePicker
            disableToolbar
            format="yyyy-MM-dd"
            id="date-picker-dateto"
            KeyboardButtonProps={{
              'aria-label': 'change date to',
            }}
            label="Datum tot"
            margin="normal"
            onChange={handleOnValueChange('dateto')}
            value={state.dateto.value}
            variant="inline"
          />
        </MuiPickersUtilsProvider>
        <LoadingButton variant="contained" color="primary" className={classes.button} onClick={handleOnSubmit} loading={submitting}>
            Haal op
        </LoadingButton>
      </div>
      <div className={classes.content}>
        <MaterialTable 
          columns={columns}
          data={data}
          title="Meterstanden"
        />
      </div>

    </div>
  </div>

}

export default Overzicht
