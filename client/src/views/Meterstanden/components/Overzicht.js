
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { makeStyles } from '@material-ui/styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import {isDayQuery, addSolarEdgeData, addBrutoNetto, getData, processLocalData} from 'helpers/meterstanden-functions';
import { LoadingButton } from 'components';
import useForm from 'hooks/useForm';
import MaterialTable from 'material-table';
import {refresh} from 'helpers/Oauth';


//import { Table } from 'react-bootstrap';
//import ReactTable from "react-table";
//import fetchBackend from 'helpers/fetchBackend';
////import {getDifferenceArray} from '../utils/arrays';
//import { Button, Form, Col } from 'react-bootstrap';
//import useFetch from 'hooks/useFetch';


//import useStateExtended from 'hooks/useStateExtended';

//import { VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel, VictoryStack } from 'victory';

//import DatePicker from 'react-datepicker';

//import 'react-datepicker/dist/react-datepicker.css';

////import MeterstandenTabel from '../components/MeterstandenTabel';
////import DialogMessage from '../components/DialogMessage'


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


const Overzicht = ({user, config}) => {
  const classes = useStyles();

  const [datefrom, setDateFrom] = useState(moment().startOf('month').add(-1, 'month').toDate());
  const [dateto, setDateTo] = useState(new Date());
  //const {hasError, isDirty, state, handleOnChange, handleOnSubmit, submitting, setInitial} = useForm(initialTimeframe, {})
  const [data, setData] = useState([]);

  const handleDateChange = (fromto) => date => {
    if(fromto === 'dateto'){
      setDateTo(date);
    }else{
      setDateFrom(date);
    }
  };

  const haalDataOp = async () => {
    console.log(config);
    //refresh('/api/oauth/refresh/enelogic', config.token)
    let data = await getData(user, datefrom, dateto, config);
    console.log(data);
    setData(data);
  }

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
            onChange={handleDateChange('datefrom')}
            value={datefrom}
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
            onChange={handleDateChange('dateto')}
            value={dateto}
            variant="inline"
          />
        </MuiPickersUtilsProvider>
        <LoadingButton variant="contained" color="primary" className={classes.button} onClick={haalDataOp} >
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
