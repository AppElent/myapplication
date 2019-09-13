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
  root2: {},
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

  const {user, userInfo, ref} = useSession();
  console.log(userInfo);
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
          if(userInfo !== null && userInfo.bunq !== undefined){
            await ref.update({'bunq.success': true})
          }else{
            await ref.update({bunq: {success: true, sparen: 0, eigen: 1}});
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
    <div>
      <div className={classes.root2}>
        {loadBunqData && code !== undefined && <Redirect to="/bunq" />}
        <div className={classes.row}>
          <span className={classes.spacer} />
          {loadBunqData && <Button
            color="primary"
            onClick={() => {request.get('/api/bunq/accounts', '?forceUpdate=true')}}
            variant="contained"
          >
            Force account refresh
          </Button>}
          {!loadBunqData && 
            <Button className={classes.exportButton}>Connect bunq sandbox</Button> &&
            <OAuthAuthorize formatUrl="/api/oauth/formaturl/bunq" title="Connect bunq" />
            
          }
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
