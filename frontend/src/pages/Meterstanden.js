// ./src/car/car.component.jsx
import React, { Component, useState, useEffect } from 'react';
//import { Table } from 'react-bootstrap';
//import ReactTable from "react-table";
import 'react-table/react-table.css'
import { withAuth } from '@okta/okta-react';
import {fetchBackend} from '../utils/fetching';
import {getDifferenceArray} from '../utils/arrays';
import { Button, Form, Col } from 'react-bootstrap';
import useFetch from '../hooks/useFetch';
import useForm from '../hooks/useForm';
import moment from 'moment';
//import Moment from 'react-moment';
import 'moment-timezone';
//import { VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel, VictoryStack } from 'victory';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import MeterstandenTabel from '../components/MeterstandenTabel';
import DialogMessage from '../components/DialogMessage'
//import {StringInputField} from '../components/InputFields';

//class MeterstandElektra extends Component {
const MeterstandElektra = ({auth}) => {
    
    const haalOp = () => {}
    
    const {values, handleChange, handleSubmit, submitting, setValues} = useForm(haalOp, {datefrom: moment().format('YYYY-MM-DD'), dateto: moment().format('YYYY-MM-DD'), timeframe: 'quarter'})
    const [defdata, setData] = useState([])
    const {data: localdata, error: localdataerror, request: requestlocaldata} = useFetch('/api/meterstanden', {onMount: true, auth, postProcess: processLocalData})
    const [loading, setLoading] = useState(true);

    const isDayQuery = (localtimeframe) => (['minute', 'quarter', 'hour'].includes(localtimeframe))
    
    const addSolarEdgeData = async (data) => {
        let dayQuery = isDayQuery(values.timeframe);
        let timeframeSolarEdge = values.timeframe;
        timeframeSolarEdge = (dayQuery ? 'quarter_of_an_hour' : timeframeSolarEdge);
        
        let solarEdgeUrl = (dayQuery ? '/api/solaredge/data/quarter_of_an_hour/' + values.datefrom + '/' + moment(values.dateto).clone().add(1, 'days').format('YYYY-MM-DD') : '/api/solaredge/data/' + timeframeSolarEdge + '/' + values.datefrom + '/' + values.dateto);

        //const solarEdgeUrl = await (timeframe === 'day' ? '/api/solaredge/data/day/' + values.datefrom + '/' + moment(dateto).clone().add(1, 'days').format('YYYY-MM-DD') : '/api/solaredge/data/quarter_of_an_hour/' + values.datefrom + '/' + moment(dateto).clone().add(1, 'days').format('YYYY-MM-DD'));
        console.log(solarEdgeUrl);
        try{
            let solaredgedata = await fetchBackend(solarEdgeUrl, {auth});
            solaredgedata = solaredgedata.energy.values;
            console.log(solaredgedata)
            //hiero
            for(let item of data){
                //let item = data[i];
                let i = data.findIndex((e) => e.datetime === item.datetime);
                data[i]['opwekking'] = null;
                console.log(item.datetime);
                //let correctdate = timeframe === 'day' ? moment(item.datetime).subtract(1, 'days') : moment(item.datetime);
                let solaredgeitem = solaredgedata.find(entry => moment(entry.date).isSame(moment(item.datetime)));
                if(solaredgeitem !== undefined && solaredgeitem.value !== null){
                    data[i]['opwekking'] = (Math.round(parseFloat(solaredgeitem.value)));
                    console.log(data[i]);
                }
            };
        }catch(err){
            return data;
        }
        console.log(data);

        return data;
    }
    
    const addBrutoNetto = async (data) => {
        data.forEach((item, i) => {
            data[i]['bruto'] = item['180_diff'];
            if(item.opwekking !== undefined){
                data[i]['bruto'] = item['180_diff'] + item.opwekking - item['280_diff'];
            }
            data[i]['netto'] = item['180_diff'] - item['280_diff'];
        });
        return data;
    }
    
    /*
    const setElektraData = async (from, to, localtimeframe, passedlocaldata = null) => {
        
        
        passedlocaldata = (passedlocaldata === null ? localdata : passedlocaldata)
        const firstdate = passedlocaldata.length > 0 ? passedlocaldata[0].datetime : moment().add(2, 'days').format('YYYY-MM-DD')
        
        const dayQuery = isDayQuery(localtimeframe);
        
        const values.datefrom = moment(from);
        const dateto = moment(to);
        //console.log(from, to, firstdate, passedlocaldata, passedlocaldata.length);
        
        let localquery = (values.datefrom.isAfter(moment(firstdate)) ? true: false);
        //console.log(localquery, values.datefrom, dateto, firstdate);
        let fillWithLocalData = (values.datefrom.isBefore(moment(firstdate)) && dateto.isAfter(moment(firstdate)) ? true: false);
        let data = '';
        
        
        if(localquery){
            if(dayQuery){
                data = passedlocaldata.filter((item: any) =>
                    moment(item.datetime) >= (moment(from)) && moment(item.datetime) <= (dateto.clone().add(1, 'days'))
                );
                if(localtimeframe === 'quarter'){
                    data = data.filter((item: any) =>
                        ['15', '30', '45', '00'].includes(moment(item.datetime).format("mm"))
                    );
                    //--data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
                }else if(localtimeframe === 'hour'){
                    data = data.filter((item: any) =>
                        moment(item.datetime).format("mm") === '00'
                    );
                    //--data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
                }
                //console.log(data);
            }else if(localtimeframe === 'day'){
                data = passedlocaldata.filter((item: any) =>
                    moment(item.datetime) >= (moment(from)) && moment(item.datetime) <= (dateto.clone().add(1, 'days')) && moment(item.datetime).format("HH:mm:ss") === "00:00:00"
                );
                //await data.forEach( item => item.datetime = moment(item.datetime).subtract(1, 'days') );
                //--data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
            }

        }else{
            //let fromdate = (timeframe === 'day' ? values.datefrom.clone())
            let dataUrl = '';
            if(dayQuery){
                dataUrl = '/api/enelogic/data/kwartier/' + values.datefrom.format('YYYY-MM-DD') + '/' + values.datefrom.clone().add(1, 'days').format('YYYY-MM-DD')
            }else if(localtimeframe === 'day'){
                dataUrl = '/api/enelogic/data/dag/' + from + '/' + dateto.clone().add(1, 'days').format('YYYY-MM-DD')
            }else{
                dataUrl = '/api/enelogic/data/dag/' + values.datefrom.clone().subtract(1, 'month').format('YYYY-MM-DD') + '/' + dateto.clone().add(1, 'days').format('YYYY-MM-DD')
            }
            

            console.log(dataUrl);
            data = await fetchBackend(dataUrl, {auth}).catch(err => {console.log(err); return []});
            if(localtimeframe === 'month'){
                data = data.filter((item: any) =>
                    moment(item.datetime).format("DD") === '01'
                );
                //--data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
            }
            if(dayQuery === false){
                data = data.filter((item, index) => index > 0)
            }
            
            
        }
        
        
        
        if(fillWithLocalData){
            if(localtimeframe === 'day'){
                const yesterday = moment();
                let yesterdaydata = passedlocaldata.find((item: any) =>
                    moment(item.datetime).format("YYYY-MM-DD HH:mm:ss") === (yesterday.format('YYYY-MM-DD') + " 00:00:00" )
                );
                console.log(data, yesterdaydata);
                let index = data.findIndex(entry => moment(entry.datetime).isSame(moment(yesterdaydata.datetime)));
                if(index === -1){
                    data.push(yesterdaydata);
                    //--data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
                }

            }
        }
        
        data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
        
        if(localtimeframe === 'day'){
            data.forEach( item => item.datetime = moment(item.datetime).subtract(1, 'days') );
        }else if(localtimeframe === 'month'){
            data.forEach( item => item.datetime = moment(item.datetime).subtract(1, 'months') );
        }
        
        //Zet datum formaat
        const format = dayQuery ? "YYYY-MM-DD HH:mm" : (localtimeframe === 'day' ? "YYYY-MM-DD" : "YYYY-MM");
        data.forEach( item => item.datetime = moment(item.datetime).format(format) );
        
        data = await addSolarEdgeData(data);
        data = await addBrutoNetto(data);
        setData(data);
        //console.log(data);
    }
    * */
    
    const setTableData = async () => {
        
        const localdatacopy = JSON.parse(JSON.stringify(localdata))
        
        const firstdate = localdatacopy.length > 0 ? localdatacopy[0].datetime : moment().add(2, 'days').format('YYYY-MM-DD')
        
        const dayQuery = isDayQuery(values.timeframe);
        
        const momentdatefrom = moment(values.datefrom);
        const momentdateto = moment(values.dateto);
        
        let localquery = (momentdatefrom.isAfter(moment(firstdate)) ? true: false);
        let fillWithLocalData = (momentdatefrom.isBefore(moment(firstdate)) && moment().isSame(momentdateto, 'd') ? true: false);
        let returndata = '';
        
        
        if(localquery){
            if(dayQuery){
                returndata = localdatacopy.filter((item: any) =>
                    moment(item.datetime) >= (momentdatefrom) && moment(item.datetime) <= (momentdateto.clone().add(1, 'days'))
                );
                if(values.timeframe === 'quarter'){
                    returndata = returndata.filter((item: any) =>
                        ['15', '30', '45', '00'].includes(moment(item.datetime).format("mm"))
                    );
                    //--data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
                }else if(values.timeframe === 'hour'){
                    returndata = returndata.filter((item: any) =>
                        moment(item.datetime).format("mm") === '00'
                    );
                    //--data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
                }
                //console.log(data);
            }else if(values.timeframe === 'day'){
                returndata = localdatacopy.filter((item: any) =>
                    moment(item.datetime) >= (momentdatefrom) && moment(item.datetime) <= (momentdateto.clone().add(1, 'days')) && moment(item.datetime).format("HH:mm:ss") === "00:00:00"
                );
                console.log(returndata)
                //await data.forEach( item => item.datetime = moment(item.datetime).subtract(1, 'days') );
                //--data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
            }

        }else{
            //let fromdate = (values.timeframe === 'day' ? datefrom.clone())
            let dataUrl = '';
            if(dayQuery){
                dataUrl = '/api/enelogic/data/kwartier/' + momentdatefrom.format('YYYY-MM-DD') + '/' + momentdatefrom.clone().add(1, 'days').format('YYYY-MM-DD')
            }else if(values.timeframe === 'day'){
                dataUrl = '/api/enelogic/data/dag/' + values.datefrom + '/' + momentdateto.clone().add(1, 'days').format('YYYY-MM-DD')
            }else{
                dataUrl = '/api/enelogic/data/dag/' + momentdatefrom.clone().subtract(1, 'month').format('YYYY-MM-DD') + '/' + momentdateto.clone().add(1, 'days').format('YYYY-MM-DD')
            }
            

            console.log(dataUrl);
            returndata = await fetchBackend(dataUrl, {auth}).catch(err => {console.log(err); return []});
            if(values.timeframe === 'month'){
                returndata = returndata.filter((item, index) =>
                    moment(item.datetime).format("DD") === '01' || index === 0 || index === (returndata.length - 1)
                );
            }

            
            
        }
        
        
        if(fillWithLocalData){
            if(values.timeframe === 'day'){
                const yesterday = moment();
                let yesterdaydata = localdatacopy.find((item: any) =>
                    moment(item.datetime).format("YYYY-MM-DD HH:mm:ss") === (yesterday.format('YYYY-MM-DD') + " 00:00:00" )
                );
                console.log(returndata, yesterdaydata, localdatacopy);
                let index = returndata.findIndex(entry => moment(entry.datetime).isSame(moment(yesterdaydata.datetime)));
                if(index === -1){
                    returndata.push(yesterdaydata);
                    //--data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
                }

            }
        }
        
        returndata = await getDifferenceArray(returndata, 'datetime', ['180', '181', '182', '280', '281', '282']);
        
        if(values.timeframe === 'day'){
            returndata.forEach( item => item.datetime = moment(item.datetime).subtract(1, 'days'));
        }else if(values.timeframe === 'month'){
            returndata.forEach( item => item.datetime = moment(item.datetime).subtract(1, 'months'));
        }
        
        //Zet datum formaat
        const format = dayQuery ? "YYYY-MM-DD HH:mm" : (values.timeframe === 'day' ? "YYYY-MM-DD" : "YYYY-MM");
        console.log(returndata);
        returndata.forEach( item => item.datetime = moment(item.datetime).format(format) );
        
        returndata = await addSolarEdgeData(returndata);
        returndata = await addBrutoNetto(returndata);
        
        //Eerste entry eruit omdat deze van een dag of maand eerder is
        if(dayQuery === false && returndata.length > 1){
            if(values.timeframe === 'month') {
                returndata = returndata.filter((item, index) => index > 1)
            }else{
                returndata = returndata.filter((item, index) => index > 0)
            }
            
        }
        
        setData(returndata);
        setLoading(false )
        //console.log(data);
    }
    
    /*
    const loadPage = async () => {
        let ddata = []
        if((await auth.getUser()).sub === '00uaz3xmdoobfWWnY356'){
            ddata = await fetchBackend('/api/meterstanden', {auth});
            ddata = ddata.sort((a, b) => (a.datetime > b.datetime) ? 1 : -1);
            //ddata = await getDifferenceArray(ddata, 'datetime', ['180', '181', '182', '280', '281', '282']) --
            //setLocaldatastart(ddata[0].datetime);
            //console.log(ddata);
            await setLocaldata(ddata);
            await setElektraData(datefrom, dateto, values.timeframe, ddata); 
        }  
        //await setElektraData(datefrom, dateto, values.timeframe, ddata); 
        setLoading(false);
    }
    * */
    
    const processLocalData = async (data) => {
        //Sort on date, just to be sure
        data = data.sort((a, b) => (a.datetime > b.datetime) ? 1 : -1);
        
        return data;
    }
    
    
    
    useEffect(() => {
        if(localdata.length > 0) setTableData();
        
    }, [localdata])
    
    //const handleChange = event => setTimeframe(event.target.value)
    
    
    const haalMeterstandenOp = async () => {
        setLoading(true);
        await setTableData();
        setLoading(false);
    }
    
    const updateDatePicker = (item, data) => {
        let conditions = {...values, [item]: moment(data).format('YYYY-MM-DD')}
        if(values[item] !== moment(data).format('YYYY-MM-DD') && isDayQuery(values.timeframe)){
            console.log(123456);
            conditions = {...values, [item]: moment(data).format('YYYY-MM-DD'), timeframe: 'day'}
        }
        setValues(conditions)
    }
    
    
   
    return <div>
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
                    <Button style={{marginTop: '32px'}} className="form-control" variant="outline-primary" type="button" onClick={haalMeterstandenOp} disabled={loading}>Haal op</Button>
                </Form.Group>
                
            </Form.Row>
        </Form>
        {defdata.length === 0 && !loading && <DialogMessage title="Geen enelogic connectie" message="Heb je wel connectie?" />}
        <MeterstandenTabel 
            data={defdata} loading={loading}
        />
    </div>
}

export default withAuth(MeterstandElektra)
