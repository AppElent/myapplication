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

class MeterstandElektra extends Component {
    
    constructor() {
        super();
        this.state = {
            data: [],
            graphdata: [],
            solaredgedata: [],
            ophalen: false,
            datums: {dagstanden_from: "", dagstanden_to: "", kwartierstanden_from: "", kwartierstanden_to: ""}
        }
    }
    
    async componentDidMount() {
        var data = await makeAPICall('/api/enelogic/data/dag/2019-03-01/2019-03-31', 'GET', null, await this.props.auth.getAccessToken());
        var solaredgedata = await makeAPICall('/api/solaredge/data/day/2019-02-28/2019-03-31', 'GET', null, await this.props.auth.getAccessToken());
        console.log(data, solaredgedata);
        //const result = mergeByKey("datetime", array1, array2);
        //var mergedList = _.map(data, function(item){
          //  return _.extend(item, _.findWhere(solaredgedata.energy.values, { date: item.datetime }));
        //});
        //console.log(mergedList);
        this.setState({data: data});
        this.setState({solaredgedata: solaredgedata.energy.values});
    }
    
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
    
    render(){
        console.log(this.state.solaredgedata);
        const columns = [{
            Header: 'Datum/tijd',
            accessor: 'datetime', // String-based value accessors!
            Cell: props => <Moment date={props.value} tz="Europe/Amsterdam" format="YYYY-MM-DD HH:mm"/>
        }, {
            Header: '180',
            accessor: '180',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '180 Verbruik',
            accessor: '180_diff',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '181',
            accessor: '181',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '182',
            accessor: '182',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '280',
            accessor: '280',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '280 Verbruik',
            accessor: '280_diff',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '281',
            accessor: '281',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
            Header: '282',
            accessor: '282',
            //Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
        }, {
          Header: 'Opwekking', 
           Cell: row => {
               var opwekking = this.state.solaredgedata.find(entry => moment(entry.date).add(1, 'days').format('YYYY-MM-DD') === moment(row.original.datetime).format('YYYY-MM-DD'));
               console.log(opwekking);
               return (opwekking !== undefined ? opwekking.value : row.original.datetime);
               
            }
        }, {
           Header: 'Bruto verbruik',
           Cell: row => {
              var test = row;
              var opwekking = this.state.solaredgedata.find(entry => moment(entry.date).add(1, 'days').format('YYYY-MM-DD') === moment(row.original.datetime).format('YYYY-MM-DD'));
              //var opwekking = this.state.solaredgedata.find(entry => entry.date === row.original.datetime);
              if(opwekking !== undefined){
                  return (<div>{row.original['180_diff']+ (Math.round(parseFloat(opwekking.value)) - row.original['280_diff'])}</div>) 
              }

              
            }
        }, {
           Header: 'Netto verbruik',
           Cell: row => (<div>{row.original['180_diff']- (row.original['280_diff'])}</div>)
        }]  
        
        var data = this.getDataBetweenDates(this.state.data, "2019-01-01", "2019-01-02").sort((a, b) => (a.datetime > b.datetime) ? 1 : -1)
        //console.log(this.extractColumn(this.state.data, "datetime"));  
        //console.log(this.extractColumn(this.state.data, "kwh_180"));  
        //console.log(this.getDifferenceArray(data, "kwh_180"));   
        
        //console.log(this.extractColumn(this.state.graphdata, "kwh_180"));
        
        return <div>
        <Form>
            <Row>
            <Col><Form.Label>Dagstanden vanaf</Form.Label><Form.Control type="text" name="dagstanden_from" value={this.state.datums.dagstanden_from} onChange={this.handleChange} /></Col>
            <Col><Form.Label>Dagstanden tm</Form.Label><Form.Control type="text" name="dagstanden_to" value={this.state.datums.dagstanden_to} onChange={this.handleChange} /></Col>
            <Col><Form.Label>Kwartierstanden vanaf</Form.Label><Form.Control type="text" name="kwartierstanden_from" value={this.state.datums.kwartierstanden_from} onChange={this.handleChange} /></Col>
            <Col><Form.Label>Kwartierstanden tm</Form.Label><Form.Control type="text" name="kwartierstanden_to" value={this.state.datums.kwartierstanden_to} onChange={this.handleChange} /></Col>
            <Button variant="outline-primary" type="submit" onClick={this.haalMeterstandenOp} disabled={this.state.ophalen}>Haal op</Button>
            </Row>
        </Form>
        <ReactTable
            data={this.state.data}
            columns={columns}
            className='-highlight -striped'
            defaultPageSize={17}
            filterable={true}
        />
        {/*
        <Button variant="outline-primary" type="submit" onClick={this.zetDatums}>Zet datums</Button>
        <VictoryChart>
          <VictoryLine
            y={this.extractColumn(this.state.graphdata, "kwh_180")}
            x={this.extractColumn(this.state.graphdata, "datetime")}
          />
          <VictoryLine
            y={this.extractColumn(this.state.graphdata, "kwh_180")}
            x={this.extractColumn(this.state.graphdata, "datetime")}
          />
        </VictoryChart>
        */}
        </div>
    }
}

export default withAuth(MeterstandElektra)
