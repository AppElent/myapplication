
import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { makeStyles } from '@material-ui/styles';
import {AppBar, Tab, Tabs} from '@material-ui/core'

import { OauthReceiver, TabPanel } from 'components';
import { useSession, useTabs } from 'hooks';
import Overzicht from './components/Overzicht';
import KostenOverzicht from './components/KostenOverzicht';
import Settings from './components/Settings';
import { saveEnelogicSettings } from 'modules/Enelogic';



const useStyles = makeStyles(theme => ({
  root: {
    //padding: theme.spacing(3)
  }
}));


const Meterstanden = () => {
  const classes = useStyles();
  const {user, userInfo, ref} = useSession();

  const [tab, handleTabChange] = useTabs('overzicht');

  //if there is a query-param named code, the OauthReceiver is returned
  const code = queryString.parse(window.location.search).code;
  if(code !== undefined) return <OauthReceiver code={code} exchangeUrl="/api/oauth/exchange/enelogic" saveFunction={saveEnelogicSettings(user, ref, userInfo.enelogic)} />

  if((!userInfo.enelogic.success)){
    if(tab !== 'settings') handleTabChange(null, 'settings')
  }

  return (
    <div>
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs 
            aria-label="simple tabs example"
            onChange={handleTabChange}
            scrollButtons="auto"
            value={tab}
            variant="scrollable"
          >
            <Tab label="Overzicht" value="overzicht" disabled={!userInfo.enelogic.success} />
            <Tab label="Kosten overzicht" value="kostenoverzicht" />
            <Tab label="Instellingen" value="settings" />
          </Tabs>
        </AppBar>
        <TabPanel visible={tab === 'overzicht'} tab="overzicht">
          <Overzicht />
        </TabPanel>
        <TabPanel visible={tab === 'kostenoverzicht'} tab="kostenoverzicht">
          <KostenOverzicht />
        </TabPanel>
        <TabPanel visible={tab === 'settings'} tab="settings">
          <Settings />
        </TabPanel>
      </div>
    </div>
  );

}

export default Meterstanden
