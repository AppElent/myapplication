import React, { Component } from 'react';


import NavBar from './components/NavBar';

class App extends Component {
  render(){
	return (<div>
	<NavBar /><div className="m-5 pb-5">
            {this.props.children}
          </div></div>);
  }  

}

export default App
