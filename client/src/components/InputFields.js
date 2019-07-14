import React, { Component } from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';
import moment from 'moment';
import Moment from 'react-moment';
import 'moment-timezone';
import { Button, Form, Row, Col } from 'react-bootstrap';


export const StringInputField = ({ id, label, value, onFieldChange }) => {
   
    return <div><Form.Label>{label}</Form.Label><Form.Control type="text" name={id} value={value} onChange={onFieldChange} /></div>;
};


