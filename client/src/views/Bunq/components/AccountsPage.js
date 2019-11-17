import React, { useEffect } from 'react';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/styles';
import { Button } from 'components'
import PropTypes from 'prop-types';

import { fetchBackend } from 'helpers';
import { useSession, useSimpleFetch, useFetch } from 'hooks';


const useStyles = makeStyles(theme => ({
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  refreshButton: {
    marginRight: theme.spacing(2)
  },
  content: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
}));



const AccountsPage = () => {
  const classes = useStyles();
  const { user, userInfo } = useSession();
  const [ requestLoading , requestExecute ] = useSimpleFetch('/api/bunq/sandbox/request', {user});
  const {data, loading, error, request} = useFetch('/api/bunq/accounts', {cacheKey: 'bunq_accounts'});

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

  useEffect(() => {
    if(userInfo.bunq.success){
      request.get();
    }
  }, [userInfo.bunq])

  return (  
    <><div className={classes.row}>
      <span className={classes.spacer} />
      {userInfo.bunq.environment === 'SANDBOX' && <Button 
        className={classes.refreshButton} 
        color="primary" 
        loading={requestLoading}
        onClick={requestExecute} 
        variant="contained"
      >
          Request money
      </Button>}
      <Button
        className={classes.refreshButton}
        color="primary"
        loading={loading}
        onClick={() => {request.get(true)}}
        variant="contained"
      >
          Force account refresh
      </Button>
    </div>
    <div className={classes.content}>
      {error && <p>{error}</p>}
      <MaterialTable 
        columns={columns}
        data={data}
        isLoading={loading}
        options={{
          pageSize: 20,
          padding: 'dense'
        }}
        title="Bunq accounts"
      />
    </div></>
  )

}

AccountsPage.propTypes = {
  accountdata: PropTypes.array,
  refreshAccounts: PropTypes.func,
  requestMoney: PropTypes.func,
  sandbox: PropTypes.bool
};

export default AccountsPage;