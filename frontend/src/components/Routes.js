// routes.jsx
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import App from '../App'
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';

import Home from '../pages/Home';
import Car from '../pages/Car';
import Events from '../pages/Events';
import Rekeningen from '../pages/Rekeningen';
import MeterstandenWarmte from '../pages/Home';
import Meterstanden from '../pages/Meterstanden';
import MeterstandenKostenOverzicht from '../pages/Home';
import Bunq from '../pages/Bunq';
import BunqOauth from '../pages/BunqOauth';
import Login from '../pages/Login';
import Protected from '../pages/Protected';

function onAuthRequired({history}) {
  history.push('/login');
}

const Routes = () => (
    <App>
        <Switch>
        
            <Security issuer='https://dev-810647.okta.com/oauth2/default'
                  client_id='0oabepfc2Yo0a3Q0H356'
                  redirect_uri={window.location.origin + '/implicit/callback'}
                  onAuthRequired={onAuthRequired} >
                  <Route exact path="/" component={Home} />
                  <SecureRoute exact path='/protected' component={Protected} />
                  <SecureRoute exact path="/cars" component={Car} />
                  <SecureRoute exact path="/events" component={Events} />
                  <SecureRoute exact path="/rekeningen" component={Rekeningen} />
                  <SecureRoute exact path="/meterstanden_warmte" component={MeterstandenWarmte} />
                  <SecureRoute exact path="/meterstanden" component={Meterstanden} />
                  <SecureRoute exact path="/meterstanden_kosten" component={MeterstandenKostenOverzicht} />
                  <SecureRoute exact path="/bunq" component={Bunq} />
                  <SecureRoute exact path="/bunq/oauth" component={BunqOauth} />
                  
                  <Route path='/login' render={() => <Login baseUrl='https://dev-810647.okta.com' />} />
                  <Route path='/implicit/callback' component={ImplicitCallback} />
            </Security>
        </Switch>
    </App> )

export default Routes
