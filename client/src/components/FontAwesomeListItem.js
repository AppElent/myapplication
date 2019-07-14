import React, { Component }  from 'react';
import 'font-awesome/css/font-awesome.min.css';

export const FontAwesomeListItem = ({text, done}) => {
    let faclass = "fa-check";
    if(done == false){
        faclass = "fa-square";
    }else if(done == null){
        faclass = "fa-spinner";
    } 
    return (<li><span className="fa-li" ><i className={'fa ' + faclass}></i></span>{text}</li>)
};
