import React from 'react';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core'
import PropTypes from 'prop-types';


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

const AccountsPage = (props) => {
  const classes = useStyles();
  
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
      <><div className={classes.row}>
        <span className={classes.spacer} />
        {props.sandbox && <Button 
          className={classes.refreshButton} 
          color="primary" 
          onClick={props.requestMoney} 
          variant="contained"
        >
          Request money
        </Button>}
        <Button
          className={classes.refreshButton}
          color="primary"
          onClick={props.refreshAccounts}
          variant="contained"
        >
          Force account refresh
        </Button>
      </div>
    <div className={classes.content}>
      <MaterialTable 
        columns={columns}
        data={props.accountdata}
        options={{
          pageSize: 15,
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