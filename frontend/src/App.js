import React, { Component } from 'react';
import {Card} from 'react-bootstrap';

import NavBar from './components/NavBar';
//import Layout from './components/Layout';

//class App extends Component {
const App = ({children}) => {
  
  //render(){
	return (
	<div>
	<NavBar />
	  <Card>
	    <Card.Body>
	      {children}
	    </Card.Body>
	  </Card>
	</div>);
  //}  

}

export default App
