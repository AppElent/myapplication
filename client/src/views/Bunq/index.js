import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button, AppBar, Tabs, Tab } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import queryString from 'query-string';


import useSession from 'hooks/useSession';
import useFetch from 'hooks/useFetch';
import fetchBackend from 'helpers/fetchBackend';
import {useFirestoreCollectionDataOnce, useFirestoreDocumentData} from 'hooks/useFirestore';
import {OAuthAuthorize} from '../../components';
import AccountsPage from './components/AccountsPage';
import SalarisVerdelen from './components/SalarisVerdelen';
import Overboeken from './components/Overboeken';
import groupData from 'helpers/groupData';
import OauthReceiver from 'components/OauthReceiver';


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
  const {value: bunqConfig, ref: bunqRef} = useFirestoreDocumentData(ref.collection('config').doc('bunq'));
  const classes = useStyles();
  const {data: accountdata, loading, error, request} = useFetch('/api/bunq/accounts', {});
  const [rekeningen, rekeningenLoading, rekeningenError, rekeningenRef] = useFirestoreCollectionDataOnce(ref.collection('rekeningen'));
  const [loadBunqData, setLoadBunqData] = useState(undefined);
  const [loadingToken, setLoadingToken] = useState(false);
  const [tab, setTab] = useState(0);
  const urlTab = (match.params.tab ? match.params.tab : null);

  useEffect(() => {
    if(bunqConfig !== undefined){
      if(bunqConfig.success){
        setLoadBunqData(true);
      }else{
        setLoadBunqData(false);
      }
    }
  }, [bunqConfig])

  useEffect(() => {
    if(loadBunqData){
      request.get();
    }
  }, [loadBunqData])

  

  const saveBunqSettings = (ref, bunqConfig) => async (accesstoken) => {
    if(bunqConfig === undefined) bunqConfig = {}
    if(accesstoken.success){
      bunqConfig['success'] = true;
      bunqConfig['environment'] = 'PRODUCTION';
      ref.set(bunqConfig);
      setLoadBunqData(true);
    }else{
      bunqConfig['success'] = false;
      bunqConfig['environment'] = 'PRODUCTION';
      ref.set(bunqConfig);
    }
  }


  //if there is a query-param named code, the OauthReceiver is returned
  const code = queryString.parse(window.location.search).code;
  if(code !== undefined) return <OauthReceiver code={code} exchangeUrl="/api/bunq/oauth/exchange" saveFunction={saveBunqSettings(bunqRef, bunqConfig)} />



  const createBunqSandbox = async () => {
    setLoadingToken(true);
    const data = await fetchBackend('/api/bunq/sandbox', {user});
    console.log(data);
    if(bunqConfig === undefined){
      await bunqRef.set({'success': true, 'environment': 'SANDBOX', sparen: 0, eigen: 0})
    }else{
      await bunqRef.update({'success': true, 'environment': 'SANDBOX'});
    }
    setLoadingToken(false);
  }
  if(loadingToken) return <CircularProgress className={classes.progress} />

  if(loadBunqData === false){
    return     <div>
      <div className={classes.root}>
        <div className={classes.row}>
          <Button
            className={classes.button}
            color ="primary"
            onClick={createBunqSandbox}
            variant="contained"
          >Connect bunq sandbox</Button>
          <OAuthAuthorize
            formatUrl="/api/oauth/formaturl/bunq"
            title="Connect bunq"
          />
        </div>
      </div>
    </div>
  }




  return (
    <div>
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs 
            aria-label="simple tabs example"
            onChange={(e, newValue) => setTab(newValue)}
            scrollButtons="auto"
            value={tab}
            variant="scrollable"
          >
            <Tab label="Rekening overzicht"/>
            <Tab label="Salaris verdelen"/>
            <Tab label="Overboeken" />
          </Tabs>
        </AppBar>
        {tab === 0 && <AccountsPage accountdata={accountdata} refreshAccounts={() => {request.get('/api/bunq/accounts', '?forceUpdate=true')}} requestMoney={() => {fetchBackend('/api/bunq/sandbox/request', {user})}} sandbox={bunqConfig !== undefined && bunqConfig.environment === 'SANDBOX'} />}
        {tab === 1 && <SalarisVerdelen accounts={accountdata} accountsRequest={request} rekeningen={groupData('rekening')(rekeningen)} />} 
        {tab === 2 && <Overboeken />}
      </div>
    </div>
  );
};

export default Bunq;
