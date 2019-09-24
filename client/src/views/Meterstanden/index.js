
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import queryString from 'query-string';
import { makeStyles } from '@material-ui/styles';

import {isDayQuery, addSolarEdgeData, addBrutoNetto, getTableData, processLocalData} from 'helpers/meterstanden-functions';
import {useFirestoreDocumentData} from 'hooks/useFirestore';
import {OauthAuthorize, OauthReceiver} from 'components';
import useSession from 'hooks/useSession';
import useForm from 'hooks/useForm';

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
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));


const Meterstanden = () => {
  const classes = useStyles();
  const {user, ref} = useSession();

  const initialDates = {
    datefrom: {
      value: moment().toDate(),
      error: ''
    },dateto: {
      value: moment().toDate(),
      error: ''
    },timeframe: {
      value: 'quarter',
      error: ''
    }
  }
  
  const {hasError, isDirty, state, handleOnChange, handleOnSubmit, submitting, setInitial} = useForm(initialDates, {})
  const {data: enelogicConfig, loading: enelogicConfigLoading, ref: enelogicRef} = useFirestoreDocumentData(ref.collection('config').doc('enelogic'));
  const [loadEnelogic, setLoadEnelogic] = useState(false);

  useEffect(() => {
    if(enelogicConfigLoading === false){
      if(enelogicConfig !== undefined && enelogicConfig.success){
        setLoadEnelogic(true);
      }else{
        setLoadEnelogic(false);
      }
    }
  }, [enelogicConfigLoading])

  useEffect(() => {
    if(loadEnelogic){
      //do something
    }
  }, [loadEnelogic])


  const saveEnelogicSettings = (ref, enelogicConfig) => async (accesstoken) => {
    if(enelogicConfig === undefined) enelogicConfig = {}
    enelogicConfig['success'] = accesstoken.success;
    enelogicConfig['token'] = accesstoken.data;
    await ref.set(enelogicConfig);
    if(enelogicConfig.success) setLoadEnelogic(true);
  }

  //if there is a query-param named code, the OauthReceiver is returned
  const code = queryString.parse(window.location.search).code;
  if(code !== undefined) return <OauthReceiver code={code} exchangeUrl="/api/oauth/exchange/enelogic" saveFunction={saveEnelogicSettings(enelogicRef, enelogicConfig)} />

  if(!enelogicConfigLoading && loadEnelogic === false && (enelogicConfig !== undefined && !enelogicConfig.success)){
    return     <div>
      <div className={classes.root}>
        <div className={classes.row}>
          <OauthAuthorize
            formatUrl="/api/oauth/formaturl/enelogic"
            title="Connect Enelogic"
          />
        </div>
      </div>
    </div>
  }

  //Refresh token if necessary
  ///////////////////////////

  return <div>
    <div className={classes.root}>
      <div className={classes.row}>
        
      </div>
    </div>
  </div>










  //const [data, setData, loading, setLoading] = useStateExtended([], true)
  //const {data: localdata, error: localdataerror, request: requestlocaldata} = useFetch('/api/meterstanden', {user, postProcess: processLocalData})
  //const [loading, setLoading] = useState(true);

    
    
  const updateDatePicker = (item, data) => {
    /*     let conditions = {...values, [item]: moment(data).format('YYYY-MM-DD')}
    if(values[item] !== moment(data).format('YYYY-MM-DD') && isDayQuery(values.timeframe)){
      conditions = {...values, [item]: moment(data).format('YYYY-MM-DD'), timeframe: 'day'}
    }
    setValues(conditions) */
  }
   
  return <div>
    {/*
    <Form>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Vanaf datum</Form.Label>
          <DatePicker
            id="datepicker_start"
            selected={moment(values.datefrom).toDate()}
            selectsStart
            startDate={moment(values.datefrom).toDate()}
            endDate={moment(values.dateto).toDate()}
            onChange={(data) => updateDatePicker('datefrom', data)}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            minDate={moment().subtract(24, 'months').toDate()}
            maxDate={moment().toDate()}
            showMonthYearDropdown withPortal showWeekNumbers fixedHeight
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Tm datum</Form.Label>
          <DatePicker
            selected={moment(values.dateto).toDate()}
            selectsEnd
            startDate={moment(values.datefrom).toDate()}
            endDate={moment(values.dateto).toDate()}
            onChange={(data) => updateDatePicker('dateto', data)}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            minDate={moment().subtract(24, 'months').toDate()}
            maxDate={moment().toDate()}
            showMonthYearDropdown withPortal showWeekNumbers fixedHeight
          />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Timeframe</Form.Label>
          <Form.Control as="select" className="form-control" name="timeframe" onChange={handleChange} value={values.timeframe}>
            {(values.datefrom === values.dateto) && <option type="radio" value="minute" name="timeframe" > Minuten</option> }
            {(values.datefrom === values.dateto) && <option type="radio" value="quarter" name="timeframe"  > Kwartier  </option>}
            {(values.datefrom === values.dateto) && <option type="radio" value="hour" name="timeframe" > Uur  </option>}
            <option type="radio" value="day" name="timeframe" > Dag  </option>
            <option type="radio" value="month" name="timeframe" > Maand  </option>
          </Form.Control>
                
        </Form.Group>
        <Form.Group as={Col}>
          <Button style={{marginTop: '32px'}} className="form-control" variant="outline-primary" type="button" onClick={setTableData} disabled={loading}>Haal op</Button>
        </Form.Group>
                
      </Form.Row>
    </Form>
      */}
    {/*data.length === 0 && !loading && (localdata.length > 0 && moment(localdata[0].datetime).isAfter(moment(values.datefrom))) && <DialogMessage title="Geen enelogic connectie" message="Heb je wel connectie?" />
    <MeterstandenTabel data={data} loading={loading} />*/}
  </div>
}

export default Meterstanden
