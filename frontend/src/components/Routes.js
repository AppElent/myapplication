// routes.jsx
import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import App from '../App'
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import { AuthProvider } from '../context/AuthContext';

import Home from '../pages/Home';
import Car from '../pages/Car';
import Paperbase from '../components/Paperbase/Paperbase';
import Test from '../pages/Test';
import Events from '../pages/Events';
import Rekeningen from '../pages/Rekeningen';
import MeterstandenWarmte from '../pages/Home';
import Meterstanden from '../pages/Meterstanden';
import MeterstandenKostenOverzicht from '../pages/Home';
import Bunq from '../pages/Bunq';
//import BunqOauth from '../pages/BunqOauth';
//import EnelogicOauth from '../pages/EnelogicOauth';
import Login from '../pages/Login';
import Protected from '../pages/Protected';
import Settings from '../pages/Settings';
import OAuth from '../pages/OAuth'

function onAuthRequired({history}) {
  history.push('/login');
}

const EmptyContainer = () => (
  <div className="container">
    <Route exact path="/" render={() => <Redirect to="/login" />} />
    <Route path="/testtest" component={Car} />
    <Route path="/testtest2" component={Test} />
  </div>
)


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

const Routes = () => (
    
        <Switch>
            <Route exact path="/test1" component={Car}/>
            <Route exact path="/test2" component={Test}/>
            <Route exact path="/paperbase" component={Paperbase}/>
            <Route component={DefaultContainer}/>
            {/*
            <Security issuer='https://dev-810647.okta.com/oauth2/default'
                  client_id='0oabepfc2Yo0a3Q0H356'
                  redirect_uri={window.location.origin + '/implicit/callback'}
                  scope={['openid', 'email', 'profile', 'groups']}
                  onAuthRequired={onAuthRequired} >
                  
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
                        
                        <SecureRoute exact path="/bunq2/oauth" component={BunqOauth} />
                        <SecureRoute exact path='/enelogic/oauth' render={() => <OAuth url='/api/oauth/exchange/enelogic' name='enelogic' redirectUrl='test' />} />
                        <SecureRoute exact path='/bunq/oauth' render={() => <OAuth url='/api/bunq/oauth/exchange' name='bunq' />} />
                        <Route path='/implicit/callback' component={ImplicitCallback} />
                        <Route path='/login' render={() => <Login baseUrl='https://dev-810647.okta.com' />} />
                  </App>
                  
            </Security>
            * * */}
        </Switch>)

export default Routes
