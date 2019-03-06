import React, { Component } from 'react';
import {Card} from 'react-bootstrap';

import NavBar from './components/NavBar';
//import Layout from './components/Layout';

class App extends Component {
  render(){
	return (
	<div>
	<NavBar />
	  <Card>
	    <Card.Body>
	      {this.props.children}
	    </Card.Body>
	  </Card>
	</div>);
  }  

}

export default App
