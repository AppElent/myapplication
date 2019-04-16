// ./src/car/car.component.jsx
import React, { Component, useState, useEffect } from 'react';
//import { Table } from 'react-bootstrap';
//import ReactTable from "react-table";
import 'react-table/react-table.css'
import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
//import {mergeArrayById} from '../utils/arrays';
import { Button, Form, Col } from 'react-bootstrap';
import moment from 'moment';
//import Moment from 'react-moment';
import 'moment-timezone';
//import { VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel, VictoryStack } from 'victory';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import MeterstandenTabel from '../components/MeterstandenTabel';
//import {StringInputField} from '../components/InputFields';

//class MeterstandElektra extends Component {
const MeterstandElektra = ({auth}) => {
    
    const [datefrom, setDatefrom] = useState(moment().format('YYYY-MM-DD'));
    const [dateto, setDateto] = useState(moment().format('YYYY-MM-DD'));
    const [data, setData] = useState([]);
    const [graphdata, setGraphdata] = useState([]);
    const [solaredgedata, setSolaredgedata] = useState([]);
    const [localdata, setLocaldata] = useState([]);
    const [timeframe, setTimeframe] = useState('quarter');
    const [loading, setLoading] = useState(true);

    

    
    /*
    
    zetDatums = () => {
        let datums = datums;
        
        datums.dagstanden_from = moment(((data.find(obj => obj.kwh_181 !== null).datetime))).format("YYYY-MM-DD");
        datums.dagstanden_to = moment(((data.find(obj => obj.kwh_181 !== null).datetime))).format("YYYY-MM-DD");
        datums.kwartierstanden_from = moment(((data.find(obj => obj.kwh_180 !== null).datetime))).format("YYYY-MM-DD");
        datums.kwartierstanden_to = moment(((data.find(obj => obj.kwh_180 !== null).datetime))).format("YYYY-MM-DD");
        this.setState({datums: datums});
        //console.log(datums);
    }
    
    
    
    haalMeterstandenOp = async () => {
        this.setState({ophalen: true})
        let datums = datums;
        let body = {
            dagstanden_from: (datums.dagstanden_from === "" ? null : datums.dagstanden_from),
            dagstanden_to: (datums.dagstanden_to === "" ? null : datums.dagstanden_to),
            kwartierstanden_from: (datums.kwartierstanden_from === "" ? null : datums.kwartierstanden_from),
            kwartierstanden_to: (datums.kwartierstanden_to === "" ? null : datums.kwartierstanden_to),
        }
        await makeAPICall('/api/meterstanden/elektra/update', 'POST', body, await this.props.auth.getAccessToken())
        makeAPICall('/api/meterstanden/elektra', 'GET', null, await this.props.auth.getAccessToken())
        .then((data) => {this.setState({data: data, ophalen: false})})
    }
    
    handleChange = event => {
        let datums = datums;
        let item = datums[event.target.name];
        let newValue = event.target.value
        datums[event.target.name] = newValue;
        
        this.setState(datums);
    };
    * */
    /*
    extractColumn = (array, column) => {
        return array.map(x => x[column]);
    }
    
    getDataBetweenDates = (array, from, to) => {
        return array.filter((item: any) =>
            new Date(item.datetime) >= (new Date(from)) && new Date(item.datetime) <= (new Date(to))
        );
    }
    
    getDifferenceArray = (array, column) => {
        let newArray = []
        let oudElement = null;
        for(var element of array){
            //console.log(element + "-" + oudElement);
            newArray.push(oudElement === null ? 0 : (oudElement[column] === null ? 0 : (parseFloat(element[column]) - parseFloat(oudElement[column]))))
            oudElement = (element[column] === null ? oudElement : element);
        }
        return newArray;
    }
    
    
    getTotal = (array, column) => {
        let total = 0
        //console.log(rekeningen);
        //console.log(column);
        if(array.length > 0){
            for (let line of array) {
              total += line[column]
              //console.log(rekening[column]);
            }
            return (<div>{total}</div>);
        }
    }
    * */
    
    const isDayQuery = (localtimeframe) => {
        return (['minute', 'quarter', 'hour'].includes(localtimeframe) ? true : false);
    }
    
    const getDifferenceArray = async (array, id, columnArray) => {
        var savedItems = {}
        //savedItems['first'] = array[0];
        savedItems['previous'] = array[0];
        for(var item of array){
            let index = array.findIndex((e) => e[id] === item[id]);
            for(var column of columnArray){
                if(column in savedItems){
                    
                }
                let difference = item[column]-savedItems['previous'][column];
                
                array[index][column + '_diff'] = difference;
                
            }
            savedItems['previous'] = item;
        }
        return array;
    }
    
    
    const addSolarEdgeData = async (data) => {
        let dayQuery = isDayQuery(timeframe);
        let timeframeSolarEdge = timeframe;
        timeframeSolarEdge = (dayQuery ? 'quarter_of_an_hour' : timeframeSolarEdge);
        
        let solarEdgeUrl = (dayQuery ? '/api/solaredge/data/quarter_of_an_hour/' + datefrom + '/' + moment(dateto).clone().add(1, 'days').format('YYYY-MM-DD') : '/api/solaredge/data/' + timeframeSolarEdge + '/' + datefrom + '/' + dateto);

        //const solarEdgeUrl = await (timeframe === 'day' ? '/api/solaredge/data/day/' + datefrom + '/' + moment(dateto).clone().add(1, 'days').format('YYYY-MM-DD') : '/api/solaredge/data/quarter_of_an_hour/' + datefrom + '/' + moment(dateto).clone().add(1, 'days').format('YYYY-MM-DD'));
        console.log(solarEdgeUrl);
        let solaredgedata = await makeAPICall(solarEdgeUrl, 'GET', null, await auth.getAccessToken());
        solaredgedata = solaredgedata.energy.values;
        for(let item of data){
            //let item = data[i];
            let i = data.findIndex((e) => e.datetime === item.datetime);
            data[i]['opwekking'] = null;
            //console.log(item.datetime);
            //let correctdate = timeframe === 'day' ? moment(item.datetime).subtract(1, 'days') : moment(item.datetime);
            let solaredgeitem = solaredgedata.find(entry => moment(entry.date).isSame(moment(item.datetime)));
            if(solaredgeitem !== undefined && solaredgeitem.value !== null){
                data[i]['opwekking'] = (Math.round(parseFloat(solaredgeitem.value)));
                //console.log(data[i]);
            }
        };

        //setSolaredgedata(solaredgedata);
        return data;
    }
    
    const addBrutoNetto = async (data) => {
        data.forEach((item, i) => {
            //let item = data[i];
            //let i = data.findIndex((e) => e.datetime === item.datetime);
            data[i]['bruto'] = item['180_diff'];
            if(item.opwekking !== null){
                data[i]['bruto'] = item['180_diff'] + item.opwekking - item['280_diff'];
            }
            data[i]['netto'] = item['180_diff'] - item['280_diff'];
        });
        return data;
    }
    
    const setElektraData = async (from, to, localtimeframe, passedlocaldata = null) => {
        
        
        passedlocaldata = (passedlocaldata === null ? localdata : passedlocaldata)
        const firstdate = passedlocaldata[0].datetime
        
        const dayQuery = isDayQuery(localtimeframe);
        
        const datefrom = moment(from);
        const dateto = moment(to);
        console.log(from, to, firstdate);
        
        let localquery = (datefrom.isAfter(moment(firstdate)) ? true: false);
        console.log(localquery, datefrom, dateto, firstdate);
        let fillWithLocalData = (datefrom.isBefore(moment(firstdate)) && dateto.isAfter(moment(firstdate)) ? true: false);
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
                    data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
                }else if(localtimeframe === 'hour'){
                    data = data.filter((item: any) =>
                        moment(item.datetime).format("mm") === '00'
                    );
                    data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
                }
                console.log(data);
            }else if(localtimeframe === 'day'){
                data = passedlocaldata.filter((item: any) =>
                    moment(item.datetime) >= (moment(from)) && moment(item.datetime) <= (dateto.clone().add(1, 'days')) && moment(item.datetime).format("HH:mm:ss") === "00:00:00"
                );
                //await data.forEach( item => item.datetime = moment(item.datetime).subtract(1, 'days') );
                data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
            }

        }else{
            //let fromdate = (timeframe === 'day' ? datefrom.clone())
            let dataUrl = '';
            if(dayQuery){
                dataUrl = '/api/enelogic/data/kwartier/' + datefrom.format('YYYY-MM-DD')
            }else if(localtimeframe === 'day'){
                dataUrl = '/api/enelogic/data/dag/' + from + '/' + dateto.clone().add(1, 'days').format('YYYY-MM-DD')
            }else{
                dataUrl = '/api/enelogic/data/dag/' + datefrom.clone().subtract(1, 'month').format('YYYY-MM-DD') + '/' + dateto.clone().add(1, 'days').format('YYYY-MM-DD')
            }
            

            console.log(dataUrl);
            data = await makeAPICall(dataUrl, 'GET', null, await auth.getAccessToken());
            if(localtimeframe === 'month'){
                data = data.filter((item: any) =>
                    moment(item.datetime).format("DD") === '01'
                );
                data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
            }
            if(dayQuery === false){
                data = data.filter((item, index) => index > 0)
            }
            
            
        }
        
        
        
        if(fillWithLocalData){
            if(localtimeframe === 'day'){
                const yesterday = moment();
                let yesterdaydata = localdata.find((item: any) =>
                    moment(item.datetime).format("YYYY-MM-DD HH:mm:ss") === (yesterday.format('YYYY-MM-DD') + " 00:00:00" )
                );
                console.log(data, yesterdaydata);
                let index = data.findIndex(entry => moment(entry.datetime).isSame(moment(yesterdaydata.datetime)));
                if(index === -1){
                    data.push(yesterdaydata);
                    data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
                }

            }
        }
        
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
        console.log(data);
    }
    
    const loadPage = async () => {
        
        let ddata = await makeAPICall('/api/meterstanden', 'GET', null, await auth.getAccessToken());
        ddata = ddata.sort((a, b) => (a.datetime > b.datetime) ? 1 : -1);
        ddata = await getDifferenceArray(ddata, 'datetime', ['180', '181', '182', '280', '281', '282'])
        //setLocaldatastart(ddata[0].datetime);
        await setLocaldata(ddata);
        await setElektraData(datefrom, dateto, timeframe, ddata);
        setLoading(false);
    }
    
    useEffect(() => {
        loadPage();
    }, [])
    
    const handleChange = event => {
        setTimeframe(event.target.value);
        console.log(event.target.name);
    };
    
    
    const haalMeterstandenOp = async () => {
        setLoading(true);
        await setElektraData(datefrom, dateto, timeframe);
        setLoading(false);
    }
    
    const updateDatePicker = (date, data) => {
        console.log(date, moment(data).format('YYYY-MM-DD'), dateto, timeframe);
        if(date === 'datefrom'){
            setDatefrom(moment(data).format('YYYY-MM-DD'));
            if(dateto !== moment(data).format('YYYY-MM-DD') && isDayQuery(timeframe)){
                setTimeframe('day');
            }
        }
        if(date === 'dateto'){
            setDateto(moment(data).format('YYYY-MM-DD'));
            if(datefrom !== moment(data).format('YYYY-MM-DD') && isDayQuery(timeframe)){
                setTimeframe('day');
            }
        }
    }
    console.log(timeframe);
    
    const checkTimeframe = (localtimeframe) => {
     console.log('jo', localtimeframe);
     return true;   
    }
    
    return <div>
        <Form>
            <Form.Row>
                <Form.Group as={Col}>
                    <Form.Label>Vanaf datum</Form.Label>
                    <DatePicker
                        id="datepicker_start"
                        selected={moment(datefrom).toDate()}
                        selectsStart
                        startDate={moment(datefrom).toDate()}
                        endDate={moment(dateto).toDate()}
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
                        selected={moment(dateto).toDate()}
                        selectsEnd
                        startDate={moment(datefrom).toDate()}
                        endDate={moment(dateto).toDate()}
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
                    <Form.Control as="select" className="form-control" name="timeframe" onChange={handleChange} value={timeframe}>
                        {(datefrom === dateto) && <option type="radio" value="minute" name="timeframe" > Minuten</option> }
                        {(datefrom === dateto) && <option type="radio" value="quarter" name="timeframe"  > Kwartier  </option>}
                        {(datefrom === dateto) && <option type="radio" value="hour" name="timeframe" > Uur  </option>}
                        <option type="radio" value="day" name="timeframe" > Dag  </option>
                        <option type="radio" value="month" name="timeframe" > Maand  </option>
                    </Form.Control>
                
                </Form.Group>
                <Form.Group as={Col}>
                    <Button style={{marginTop: '32px'}} className="form-control" variant="outline-primary" type="submit" onClick={haalMeterstandenOp} disabled={loading}>Haal op</Button>
                </Form.Group>
                
            </Form.Row>
        </Form>
        <MeterstandenTabel 
            data={data} loading={loading}
        />
    </div>
}

export default withAuth(MeterstandElektra)
