import React from 'react';
//import {Card} from 'react-bootstrap';

//import NavBar from './components/NavBar';
import Layout from './components/Layout/index.js';

//class App extends Component {
const App = ({children}) => {
  
  //render(){
	return (
	<div>
	<Layout >
		{children}
	</Layout>
	</div>);
  //}  

}

export default App
