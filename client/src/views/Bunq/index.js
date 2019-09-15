import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button, AppBar, Tabs, Tab, Box, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom'


import useSession from 'hooks/useSession';
import useFetch from 'hooks/useFetch';
import fetchBackend from 'helpers/fetchBackend';
import {useFirestoreCollectionDataOnce} from 'hooks/useFirestore';
import {OAuthAuthorize} from '../../components';
import AccountsPage from './components/AccountsPage';
import SalarisVerdelen from './components/SalarisVerdelen';
import Overboeken from './components/Overboeken';
import groupData from 'helpers/groupData';


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

const Bunq = () => {

  const {user, userInfo, ref} = useSession();
  console.log(userInfo);
  const classes = useStyles();
  const {data: accountdata, loading, error, request} = useFetch('/api/bunq/accounts', {});
  const [rekeningen] = useFirestoreCollectionDataOnce('users/' + user.uid + '/rekeningen', {asArray: true});
  const [loadBunqData, setLoadBunqData] = useState(false);
  const [loadingToken, setLoadingToken] = useState(false);
  const [tab, setTab] = useState(0);

  const code = queryString.parse(window.location.search).code;
  
  useEffect(() => {
    const getToken = async () => {
      if(code !== undefined){
        setLoadingToken(true);
        const body = {code}
        const accesstoken = await fetchBackend('/api/bunq/oauth/exchange', {method: 'POST', body, user}).catch(err => { console.log(err); });
        console.log(accesstoken);
        if(accesstoken.success){
          if(userInfo !== null && userInfo.bunq !== undefined){
            await ref.update({'bunq.success': true, 'bunq.environment':'PRODUCTION'})
          }else{
            await ref.update({bunq: {success: true, sparen: 0, eigen: 1, environment: 'PRODUCTION'}});
          }
          setLoadBunqData(true);
        }
        setLoadingToken(false);
      }
    }
    getToken();
  }, [])

  useEffect(() => {
    if(loadBunqData === false){
      if(userInfo !== null && userInfo.bunq !== undefined && userInfo.bunq.success){
        setLoadBunqData(true);
      }
    }
  })

  useEffect(() => {
    if(loadBunqData){
      request.get();
    }
  }, [loadBunqData])



  
  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        <Box p={3}>{children}</Box>
      </Typography>
    );
  }

  const createBunqSandbox = async () => {
    setLoadingToken(true);
    const data = await fetchBackend('/api/bunq/sandbox', {user});
    console.log(data);
    if(userInfo !== null && userInfo.bunq !== undefined){
      await ref.update({'bunq.success': true, 'bunq.environment': 'SANDBOX'})
    }else{
      await ref.update({bunq: {success: true, sparen: 0, eigen: 1, environment: 'SANDBOX'}});
    }
    setLoadingToken(false);
  }

  if(!loadBunqData){
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

  if(loadBunqData && code !== undefined) return <Redirect to="/bunq" />

  if(loadingToken) return <CircularProgress className={classes.progress} />


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
        {/*
        <TabPanel
          value={tab}
          index={0}
        >
        Item One
        </TabPanel>
        <TabPanel
          value={tab}
          index={1}
        >
          Item Two
        </TabPanel>
        <TabPanel
          value={tab}
          index={2}
        >
          Item Three
        </TabPanel>*/}
        {tab === 0 && <AccountsPage accountdata={accountdata} refreshAccounts={() => {request.get('/api/bunq/accounts', '?forceUpdate=true')}} requestMoney={() => {fetchBackend('/api/bunq/sandbox/request', {user})}} sandbox={userInfo.bunq.environment === 'SANDBOX'} />}
        {tab === 1 && <SalarisVerdelen accounts={accountdata} accountsRequest={request} rekeningen={groupData('rekening')(rekeningen)} />} 
        {tab === 2 && <Overboeken />}
      </div>
    </div>
  );
};

export default Bunq;
