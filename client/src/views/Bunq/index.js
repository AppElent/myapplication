import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
//import Moment from 'react-moment';
import MaterialTable from 'material-table';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom'

import useSession from 'hooks/useSession';
import useFetch from 'hooks/useFetch';
import fetchBackend from 'helpers/fetchBackend';
import {OAuthAuthorize} from '../../components';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
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
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const Bunq = () => {

  const {user, userData, ref} = useSession();
  const classes = useStyles();
  const {data, loading, error, request} = useFetch('/api/bunq/accounts', {});
  const [loadBunqData, setLoadBunqData] = useState(false);
  const [loadingToken, setLoadingToken] = useState(false);

  const code = queryString.parse(window.location.search).code;
  
  useEffect(() => {
    const getToken = async () => {
      if(code !== undefined){
        setLoadingToken(true);
        const body = {code}
        const accesstoken = await fetchBackend('/api/bunq/oauth/exchange', {method: 'POST', body, user}).catch(err => { console.log(err); });
        console.log(accesstoken);
        if(accesstoken.success){
          if(userData !== null && userData.bunq !== undefined){
            await ref.collection('data').doc('bunq').update({success: true});
          }else{
            await ref.collection('data').doc('bunq').set({success: true});
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
      if(userData !== null && userData.bunq !== undefined && userData.bunq.success){
        setLoadBunqData(true);
      }
    }
  })

  useEffect(() => {
    if(loadBunqData){
      console.log(999);
      request.get();
    }
  }, [loadBunqData])

  const renderRedirect = () => {
    if (loadBunqData && code !== undefined) {
      return <Redirect to="/bunq" />
    }
  }
  
  //const data = [{description: 'a', value: '1'}, {description: 'b', value: '2'}]

  const columns = [{
    title: 'Account',
    field: 'description'
  }, {
    title: 'Balance',
    field: 'balance.value'
  }, {
    title: 'Type',
    field: 'monetary_bank_account_type'
  }, {
    title: 'Daily limit',
    field: 'daily_limit.value'
  }, {
    title: 'Daily spent',
    field: 'daily_spent.value'
  }, {
    title: 'Actief',
    field: 'status',
    lookup: {
      'ACTIVE': 'Actief',
      'CANCELLED': 'Niet actief'
    }
  }]     

  return (
    <div className={classes.root}>
      <div>
        {renderRedirect()}
        <div className={classes.row}>
          <span className={classes.spacer} />
          {loadBunqData && <Button
            color="primary"
            onClick={() => {request.get('/api/bunq/accounts', '?forceUpdate=true')}}
            variant="contained"
          >
            Force account refresh
          </Button>}
          {!loadBunqData && <OAuthAuthorize formatUrl="/api/oauth/formaturl/bunq" title="Connect bunq" /> }
        </div>
      </div>
      <div className={classes.content}>
        {loadingToken && <CircularProgress className={classes.progress} />}
        {loadBunqData && <MaterialTable 
          columns={columns}
          data={data}
          title="Bunq accounts"
        /> }
      </div>
    </div>
  );
};

export default Bunq;
