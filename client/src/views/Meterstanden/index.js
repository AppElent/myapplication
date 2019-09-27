
import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { makeStyles } from '@material-ui/styles';
import {AppBar, Tab, Tabs} from '@material-ui/core'

import {OauthAuthorize, OauthReceiver} from 'components';
import useSession from 'hooks/useSession';
import useTabs from 'hooks/useTabs';
import Overzicht from './components/Overzicht';
import fetchBackend from 'helpers/fetchBackend';



const useStyles = makeStyles(theme => ({
  root: {
    //padding: theme.spacing(3)
  }, 
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  spacer: {
    flexGrow: 1
  },
  content: {
    padding: theme.spacing(2)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  button: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1)
  }
}));


const Meterstanden = () => {
  const classes = useStyles();
  const {user, ref, userData, userDataRef} = useSession();

  const [tab, handleTabChange] = useTabs('overzicht');
  const enelogicConfig = userData.enelogic;

  const saveEnelogicSettings = (ref, enelogicConfig) => async (accesstoken) => {
    if(enelogicConfig === undefined) enelogicConfig = {}
    if(!accesstoken.success){
      enelogicConfig.success = false
      await ref.set(enelogicConfig);
      return;
    }
    enelogicConfig['token'] = accesstoken.data;
    try{
      const measuringpoints = await fetchBackend('/api/enelogic/measuringpoints?access_token=' + accesstoken.data.access_token, {user});
      enelogicConfig.measuringpoints = {}
      const mpointelectra = measuringpoints.data.find(item => (item.active === true && item.unitType === 0))
      if(mpointelectra !== undefined) enelogicConfig.measuringpoints.electra = mpointelectra;
      const mpointgas = measuringpoints.data.find(item => (item.active === true && item.unitType === 1))
      if(mpointgas !== undefined) enelogicConfig.measuringpoints.gas = mpointgas;
      enelogicConfig.success = true;
    }catch(err){
      enelogicConfig.success = false;
    }
    await ref.set(enelogicConfig);
  }

  //if there is a query-param named code, the OauthReceiver is returned
  const code = queryString.parse(window.location.search).code;
  if(code !== undefined) return <OauthReceiver code={code} exchangeUrl="/api/oauth/exchange/enelogic" saveFunction={saveEnelogicSettings(userDataRef.doc('enelogic'), enelogicConfig)} />

  if((enelogicConfig !== undefined && !enelogicConfig.success)){
    return     <div>
      <div className={classes.root}>
        <div className={classes.row}>
          <OauthAuthorize
            formatUrl="/api/oauth/formaturl/enelogic"
            title="Connect Enelogic"
          />
        </div>
      </div>
    </div>
  }

  //Refresh token if necessary
  ///////////////////////////


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
            <Tab label="Overzicht" value="overzicht" />
            <Tab label="Instellingen" value="settings" />
          </Tabs>
        </AppBar>
        {tab === 'overzicht' && <Overzicht config={enelogicConfig} user={user} />}
        {tab === 'settings' && <div>Hallo</div>}
      </div>
    </div>
  );

}

export default Meterstanden
