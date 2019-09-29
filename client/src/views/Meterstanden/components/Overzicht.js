
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


const Overzicht = ({user, config, userDataRef}) => {
  const classes = useStyles();

  const haalDataOp = async () => {
    console.log(config);
    const refreshedtoken = await refresh(user, '/api/oauth/refresh/enelogic', config.token)
    console.log(refreshedtoken);
    if(refreshedtoken !== null) updateEnelogicSettings(userDataRef, config)
    let data = await getData(user, state.datefrom.value, state.dateto.value, config);
    console.log(data);
    setData(data);
  }

  const datefrom = (moment().date() < 3 ? moment().startOf('month').add(-1, 'month') : moment().startOf('month')).toDate()//
  const dateto = moment().add(-1, 'days').toDate();

  const {state, handleOnValueChange, handleOnSubmit, submitting} = useForm({datefrom, dateto}, {}, haalDataOp);
  const [data, setData] = useState([]);


  var columns = [{
    title: 'Datum',
    field: 'datetime'
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
    title: 'KwH opwekking laag',
    field: '281',
    render: rowData => (rowData['281'] + ' (' + rowData['281_diff'] + ')')
  }, {
    title: 'KwH opwekking hoog',
    field: '282',
    render: rowData => (rowData['282'] + ' (' + rowData['282_diff'] + ')')
  }, {
    title: 'Opwekking totaal',
    field: '280',
    render: rowData => (rowData['280'] + ' (' + rowData['280_diff'] + ')')
  }]

  return <div>
    <div className={classes.root}>
      <div className={classes.row}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            format="yyyy-MM-dd"
            id="date-picker-inline"
            KeyboardButtonProps={{
              'aria-label': 'change date from',
            }}
            label="Datum vanaf"
            margin="normal"
            minDate={new Date(config.measuringpoints.electra.dayMin)}
            onChange={handleOnValueChange('datefrom')}
            value={state.datefrom.value}
            variant="inline"
          />
          <KeyboardDatePicker
            disableToolbar
            format="yyyy-MM-dd"
            id="date-picker-inline"
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
