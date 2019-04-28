// ./src/car/car.component.jsx
import React, { useState } from 'react';
import { withAuth } from '@okta/okta-react';
import { Tab, Tabs } from 'react-bootstrap';
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react';
import { Switch } from 'react-router-dom'

import Profile from '../components/Profile';
import Usersettings from '../components/Usersettings'
import APIManagement from '../components/APIManagement'
const queryString = require('query-string');

const Settings = ({auth}) => {
    
    console.log(window.location.search);
    const [activeTab, setActiveTab] = useState(queryString.parse(window.location.search).tab || 'profile')
    
    return <div>
        <h1>Settings</h1>
          <Tabs
            id="controlled-tab-example"
            activeKey={activeTab}
            onSelect={key => setActiveTab(key)}
            mountOnEnter
          >
            <Tab eventKey="profile" title="Profile">
              <Profile />
            </Tab>
            <Tab eventKey="users" title="User management">
              <Usersettings />
            </Tab>
            <Tab eventKey="apimanagement" title="API's">
              <APIManagement />
            </Tab>
            <Tab eventKey="bunq" title="Bunq" disabled>
              <APIManagement />
            </Tab>
          </Tabs>
        </div>

}

export default withAuth(Settings)
