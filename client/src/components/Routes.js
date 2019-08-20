// routes.jsx
import React, {useContext} from 'react'
import { Route, Switch } from 'react-router-dom'
import App from '../App'
//import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
//import { AuthProvider } from '../context/AuthContext';
import FirebaseAuthProvider, {FirebaseAuthContext} from '../context/FirebaseContext';

import Home from '../pages/Home';
import Car from '../pages/Car';
//import Paperbase from './Paperbase/Paperbase';
//import Layout from './Layout';
import Test from '../pages/Test';
import Events from '../pages/Events';
import Rekeningen from '../pages/Rekeningen';
import MeterstandenWarmte from '../pages/Home';
import Meterstanden from '../pages/Meterstanden';
import MeterstandenKostenOverzicht from '../pages/Home';
import Bunq from '../pages/Bunq';
//import BunqOauth from '../pages/BunqOauth';
//import EnelogicOauth from '../pages/EnelogicOauth';
//import Login from '../pages/Login';
import Protected from '../pages/Protected';
import Settings from '../pages/Settings';
import OAuth from '../pages/OAuth'

import TestFirebase from './TestFirebase';
import TestFirebase2 from './TestFirebase2';

/*
function onAuthRequired({history}) {
  history.push('/login');
}

 const DefaultContainer = () => (
    <div>
      <Security issuer='https://dev-810647.okta.com/oauth2/default'
            client_id='0oabepfc2Yo0a3Q0H356'
            redirect_uri={window.location.origin + '/implicit/callback'}
            scope={['openid', 'email', 'profile', 'groups']}
            onAuthRequired={onAuthRequired} >
            <AuthProvider>
              <App>
                <SecureRoute exact path="/" component={Home} />
                <SecureRoute exact path='/protected' component={Protected} />
                <SecureRoute exact path="/cars" component={Car} />
                <SecureRoute exact path="/events" component={Events} />
                <SecureRoute exact path="/rekeningen" component={Rekeningen} />
                <SecureRoute exact path="/meterstanden_warmte" component={MeterstandenWarmte} />
                <SecureRoute exact path="/meterstanden" component={Meterstanden} />
                <SecureRoute exact path="/meterstanden_kosten" component={MeterstandenKostenOverzicht} />
                <SecureRoute exact path="/bunq" component={Bunq} />
                <SecureRoute exact path="/settings" component={Settings} />
                

                <SecureRoute exact path='/enelogic/oauth' render={() => <OAuth url='/api/oauth/exchange/enelogic' name='enelogic' redirectUrl='test' />} />
                <SecureRoute exact path='/bunq/oauth' render={() => <OAuth url='/api/bunq/oauth/exchange' name='bunq' />} />
                <Route path='/implicit/callback' component={ImplicitCallback} />
                <Route path='/login' render={() => <Login  />} />
              </App>
            </AuthProvider>
      </Security>
    </div>
 )
 */

 const PaperbaseContainer = () => (
  
  <div>
    <FirebaseAuthProvider>
      <App>
        <Route exact path="/login" component={TestFirebase} />
        <Route exact path="/jojo" component={TestFirebase2} />
        <PrivateRoute exact path="/magniet" component={TestFirebase2} />



        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute exact path='/protected' component={Protected} />
        <PrivateRoute exact path="/cars" component={Car} />
        <PrivateRoute exact path="/events" component={Events} />
        <PrivateRoute exact path="/rekeningen" component={Rekeningen} />
        <PrivateRoute exact path="/meterstanden_warmte" component={MeterstandenWarmte} />
        <PrivateRoute exact path="/meterstanden" component={Meterstanden} />
        <PrivateRoute exact path="/meterstanden_kosten" component={MeterstandenKostenOverzicht} />
        <PrivateRoute exact path="/bunq" component={Bunq} />
        <PrivateRoute exact path="/settings" component={Settings} />
        

        <PrivateRoute exact path='/enelogic/oauth' render={() => <OAuth url='/api/oauth/exchange/enelogic' name='enelogic' redirectUrl='test' />} />
        <PrivateRoute exact path='/bunq/oauth' render={() => <OAuth url='/api/bunq/oauth/exchange' name='bunq' />} />
        {/*<Route path='/implicit/callback' component={ImplicitCallback} />*/}
        {/*<Route path='/login' render={() => <Login  />} />*/}
      </App>
    </FirebaseAuthProvider>
  </div>
)

 const PrivateRoute = ({ component, ...options }) => {
  const auth = useContext(FirebaseAuthContext);
  console.log(auth);
  const finalComponent = auth.isUserSignedIn ? component : TestFirebase;

  return <Route {...options} component={finalComponent} />;
};

const Routes = () => (
    
        <Switch>
            <Route exact path="/test1" component={Car}/>
            <Route exact path="/test2" component={Test}/>
            <Route component={PaperbaseContainer}/>
        </Switch>)

export default Routes
