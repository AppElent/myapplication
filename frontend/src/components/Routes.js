// routes.jsx
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import App from '../App'

import Home from '../pages/Home';
import Car from '../pages/Car';
import Events from '../pages/Events';
import Rekeningen from '../pages/Rekeningen';
import MeterstandenWarmte from '../pages/Home';
import MeterstandenElektra from '../pages/Home';
import MeterstandenKostenOverzicht from '../pages/Home';
import Bunq from '../pages/Bunq';
import BunqGenerate from '../pages/BunqGenerate';

const Routes = () => (
    <App>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/cars" component={Car} />
            <Route exact path="/events" component={Events} />
            <Route exact path="/rekeningen" component={Rekeningen} />
            <Route exact path="/meterstanden_warmte" component={MeterstandenWarmte} />
            <Route exact path="/meterstanden_elektra" component={MeterstandenElektra} />
            <Route exact path="/meterstanden_kosten" component={MeterstandenKostenOverzicht} />
            <Route exact path="/bunq" component={Bunq} />
            <Route exact path="/bunq/generate" component={BunqGenerate} />
        </Switch>
    </App> )

export default Routes
