import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import queryString from 'query-string';


import { useSession, useFetch, useTabs, useFirestoreCollectionDataOnce } from 'hooks';
import { fetchBackend, groupData } from 'helpers';
import { OauthReceiver, TabPanel } from 'components';
import AccountsPage from './components/AccountsPage';
import SalarisVerdelen from './components/SalarisVerdelen';
import Overboeken from './components/Overboeken';
import Settings from './components/Settings';


const useStyles = makeStyles(theme => ({
  root: {
    //padding: theme.spacing(3)
  }, 
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  button: {
    marginRight: theme.spacing(1)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const Bunq = ({match}) => {

  const {user, userInfo, ref} = useSession();
  const classes = useStyles();
  const {data: accountdata, loading, error, request} = useFetch('/api/bunq/accounts', {});

  const [rekeningen, rekeningenLoading, rekeningenError, rekeningenRef] = useFirestoreCollectionDataOnce(ref.collection('rekeningen'));
  const [loadBunqData, setLoadBunqData] = useState(undefined);
  const [tab, handleTabChange] = useTabs('overzicht');

  useEffect(() => {
    if(userInfo.bunq !== undefined && userInfo.bunq.success){
      setLoadBunqData(true);
    }else{
      setLoadBunqData(false);
    }
  }, [userInfo.bunq])

  useEffect(() => {
    if(loadBunqData){
      request.get();
    }
  }, [loadBunqData])

  

  const saveBunqSettings = (ref, bunqConfig) => async (accesstoken) => {
    if(bunqConfig === undefined) bunqConfig = {}
    bunqConfig['success'] = accesstoken.success;
    bunqConfig['environment'] = 'PRODUCTION';
    ref.update({bunq: bunqConfig});
    if(accesstoken.success){
      setLoadBunqData(true);
    }
  }

  //if there is a query-param named code, the OauthReceiver is returned
  const code = queryString.parse(window.location.search).code;
  if(code !== undefined) return <OauthReceiver code={code} exchangeUrl="/api/bunq/oauth/exchange" saveFunction={saveBunqSettings(ref, userInfo.bunq)} />


  if((!userInfo.bunq.success)){
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
            <Tab label="Rekening overzicht" value="overzicht" disabled={loading} />
            <Tab label="Salaris verdelen" value="verdelen" disabled={loading} />
            <Tab label="Overboeken" value="overboeken" disabled={loading} />
            <Tab label="Instellingen" value="settings" />
          </Tabs>
        </AppBar>
        <TabPanel visible={tab === 'overzicht'} tab="overzicht">
          {tab === 'overzicht' && <AccountsPage accountdata={accountdata} refreshAccounts={() => {request.get('/api/bunq/accounts', '?forceUpdate=true')}} requestMoney={() => {fetchBackend('/api/bunq/sandbox/request', {user})}} sandbox={userInfo.bunq.environment === 'SANDBOX'} />}
        </TabPanel>
        <TabPanel visible={tab === 'verdelen'} tab="verdelen">
          <SalarisVerdelen accounts={accountdata} accountsRequest={request} rekeningen={rekeningenLoading ? undefined : groupData('rekening')(rekeningen)} user={user}/>
        </TabPanel>
        <TabPanel visible={tab === 'overboeken'} tab="overboeken">
          <Overboeken accounts={accountdata} accountsRequest={request} user={user} />
        </TabPanel>
        <TabPanel visible={tab === 'settings'} tab="settings">
          <Settings />
        </TabPanel>
      </div>
    </div>
  );
};

export default Bunq;
