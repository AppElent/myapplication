// ./src/car/car.component.jsx
import React, { Component } from 'react';
//import { Table } from 'react-bootstrap';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import { withAuth } from '@okta/okta-react';
import {makeAPICall} from '../utils/fetching';
//import {mergeArrayById} from '../utils/arrays';
import { Button, Form, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import Moment from 'react-moment';
import 'moment-timezone';
import { VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel, VictoryStack } from 'victory';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import MeterstandenTabel from '../components/MeterstandenTabel';
import {StringInputField} from '../components/InputFields';

class MeterstandElektra extends Component {
    
    constructor() {
        super();
        this.state = {
            datefrom: '',
            dateto: '',
            data: [],
            graphdata: [],
            solaredgedata: [],
            localdata: [],
            localdatastart: '',
            timeframe: 'day',
            ophalen: false,
            datums: {dagstanden_from: "", dagstanden_to: "", kwartierstanden_from: "", kwartierstanden_to: ""}
        }
    }
    

    
    /*
    
    zetDatums = () => {
        let datums = this.state.datums;
        
        datums.dagstanden_from = moment(((this.state.data.find(obj => obj.kwh_181 !== null).datetime))).format("YYYY-MM-DD");
        datums.dagstanden_to = moment(((this.state.data.find(obj => obj.kwh_181 !== null).datetime))).format("YYYY-MM-DD");
        datums.kwartierstanden_from = moment(((this.state.data.find(obj => obj.kwh_180 !== null).datetime))).format("YYYY-MM-DD");
        datums.kwartierstanden_to = moment(((this.state.data.find(obj => obj.kwh_180 !== null).datetime))).format("YYYY-MM-DD");
        this.setState({datums: datums});
        //console.log(datums);
    }
    
    
    
    haalMeterstandenOp = async () => {
        this.setState({ophalen: true})
        let datums = this.state.datums;
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
        let datums = this.state.datums;
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
        //console.log(this.state.rekeningen);
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
    
    getDifferenceArray = async (array, id, columnArray) => {
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
    
    setLocalData = async () => {
        let ddata = await makeAPICall('/api/meterstanden', 'GET', null, await this.props.auth.getAccessToken());
        ddata = ddata.sort((a, b) => (a.datetime > b.datetime) ? 1 : -1);
        ddata = await this.getDifferenceArray(ddata, 'datetime', ['180', '181', '182', '280', '281', '282'])
        
        this.setState({localdata: ddata, localdatastart: ddata[0].datetime});
        //console.log(this.state.localdatastart, this.state.localdata);
    }
    
    addSolarEdgeData = async (data) => {
        const solarEdgeUrl = await (this.state.timeframe === 'day' ? '/api/solaredge/data/day/' + this.state.datefrom + '/' + moment(this.state.dateto).clone().add(1, 'days').format('YYYY-MM-DD') : '/api/solaredge/data/quarter_of_an_hour/' + this.state.datefrom + '/' + moment(this.state.dateto).clone().add(1, 'days').format('YYYY-MM-DD'));
        let solaredgedata = await makeAPICall(solarEdgeUrl, 'GET', null, await this.props.auth.getAccessToken());
        solaredgedata = solaredgedata.energy.values;
        for(let item of data){
            //let item = data[i];
            let i = data.findIndex((e) => e.datetime === item.datetime);
            data[i]['opwekking'] = null;
            //console.log(item.datetime);
            let correctdate = this.state.timeframe === 'day' ? moment(item.datetime).subtract(1, 'days') : moment(item.datetime);
            let solaredgeitem = solaredgedata.find(entry => moment(entry.date).isSame(correctdate));
            if(solaredgeitem !== undefined && solaredgeitem.value !== null){
                data[i]['opwekking'] = (Math.round(parseFloat(solaredgeitem.value)));
                //console.log(data[i]);
            }
        };
        //console.log(moment(solaredgedata[0].date))
        this.setState({solaredgedata: solaredgedata});
        return data;
    }
    
    addBrutoNetto = async (data) => {
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
    
    setData = async (from, to) => {
        const datefrom = moment(from);
        const dateto = moment(to);
        const sourcediff = moment().subtract(6, 'days');
        console.log(from, to);
        
        let localquery = (datefrom.isAfter(moment(this.state.localdatastart)) ? true: false);
        let timeframe = (from === to ? 'quarter' : 'day');
        this.setState({timeframe: timeframe});
        let data = '';
        
        
        if(localquery){
            data = this.state.localdata.filter((item: any) =>
                moment(item.datetime) >= (moment(from)) && moment(item.datetime) <= (dateto.clone().add(1, 'days'))
            );

        }else{
            let dataUrl = (timeframe === 'day' ? ('/api/enelogic/data/dag/' + from + '/' + dateto.clone().add(1, 'days').format('YYYY-MM-DD')) : ('/api/enelogic/data/kwartier/' + datefrom.clone().add(1, 'days').format('YYYY-MM-DD')));
            let solarEdgeUrl = (timeframe === 'day' ? ('/api/solaredge/data/day/' + from + '/' + to) : ('/api/solaredge/data/quarter_of_an_hour/' + from + '/' + dateto.clone().add(1, 'days').format('YYYY-MM-DD')));

            console.log(dataUrl, solarEdgeUrl);
            data = await makeAPICall(dataUrl, 'GET', null, await this.props.auth.getAccessToken());
            data = data.filter((item, index) => index > 0)
        }
        data = await this.addSolarEdgeData(data);
        data = await this.addBrutoNetto(data);
        this.setState({data: data});
        //console.log(data);
    }
    
    async componentDidMount() {
        this.setState({datefrom: moment().format('YYYY-MM-DD'), dateto: moment().format('YYYY-MM-DD')});
        await this.setLocalData();
        await this.setData(this.state.datefrom, this.state.dateto);
    }
    
    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
        console.log(event);
    };
    
    haalMeterstandenOp = async () => {
        this.setState({ophalen: true})
        await this.setData(this.state.datefrom, this.state.dateto);
        this.setState({ophalen: false})
    }
    
    render(){
        return <div>
            <Form><Row>
            <Col><Row><Form.Label>Vanaf datum</Form.Label></Row>
            <Row><DatePicker
                selected={moment(this.state.datefrom).toDate()}
                selectsStart
                startDate={moment(this.state.datefrom).toDate()}
                endDate={moment(this.state.dateto).toDate()}
                onChange={(data) => this.setState({datefrom: moment(data).format('YYYY-MM-DD')})}
                className="form-control"
                dateFormat="yyyy-MM-dd"
            /></Row></Col>

            <Col><Row><Form.Label>Tm datum</Form.Label></Row>
            <Row><DatePicker
                selected={moment(this.state.dateto).toDate()}
                selectsEnd
                startDate={moment(this.state.datefrom).toDate()}
                endDate={moment(this.state.dateto).toDate()}
                onChange={(data) => this.setState({dateto: moment(data).format('YYYY-MM-DD')})}
                className="form-control"
                dateFormat="yyyy-MM-dd"
            /></Row></Col>
                <Col><Form.Label>Timeframe</Form.Label><div name="timeframe" key='timeframe' className="mb-3">
                  <Form.Check
                    custom
                    inline
                    onChange={(data) => this.setState({datefrom: data})}
                    label="Minuut"
                    type='radio'
                    id='minuut'
                  />
                  <Form.Check
                    custom
                    inline
                    onChange={(data) => this.setState({dateto: data})}
                    label="Dag"
                    type='radio'
                    id='dag'
                  />
                  <Form.Check
                    custom
                    inline
                    onChange={this.handleChange}
                    disabled
                    label="Maand"
                    type='radio'
                    id='maand'
                  />
                </div></Col>
                <Button variant="outline-primary" type="submit" onClick={this.haalMeterstandenOp} disabled={this.state.ophalen}>Haal op</Button>
            </Row></Form>
            <MeterstandenTabel 
                data={this.state.data}
                solaredgedata={this.state.solaredgedata}
                timeframe={this.state.timeframe}
            />
        </div>
    }
}

export default withAuth(MeterstandElektra)
