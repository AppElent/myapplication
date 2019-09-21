import React, {useState} from 'react';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';


import ScriptDialog from './ScriptDialog';


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

const SalarisVerdelen = ({accounts, accountsRequest, rekeningen}) => {
  const classes = useStyles();
  console.log(rekeningen);
  const [bunqSettings, setBunqSettings] = useState({from: '', spaar: '', income: 3150, keep: 80})

  
  const getRekeningColumns = () => {
    const months = [ 'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December' ];
    const rekeningColumns = []
    
    rekeningColumns.push({
      title: 'Rekening',
      field: 'rekening', // String-based value accessors!
    },{
      title: 'Huidig saldo',
      field: 'rekening', // String-based value accessors!
      render: rowData => {const account = accounts.find(account => account.description === rowData.rekening); return ('€' + (account === undefined ? '-' : account.balance.value))}
    })
    for(var i = 1; i < 13; i++){
      rekeningColumns.push({
        title: months[i-1],
        field: 'month_'+i
      });
    }
    return rekeningColumns;
  }
    

  const getTotal = (cellInfo) => {
    let total = 0
    if(rekeningen.length > 0){
      for (let rekening of rekeningen) {
        total += rekening[cellInfo.column.id]
      }
      let sparen = (bunqSettings.income - bunqSettings.keep - total);
      return (<div>{total}<br />{sparen}</div>);
    }
  }

  return (  
    <div className={classes.content}>
      <ScriptDialog 
        accounts={accounts}
        accountsRequest={accountsRequest}
        bunqSettings={bunqSettings}
        rekeningen={rekeningen}
      />
      <MaterialTable 
        columns={getRekeningColumns()}
        data={rekeningen}
        options={{
          paging: false,
          padding: 'dense'
          
        }}
        title="Rekeningen gegroepeerd"
      />
    </div>
  )

}

SalarisVerdelen.propTypes = {
  data: PropTypes.array,
  loadBunqData: PropTypes.bool,
  onClick: PropTypes.func
};

export default SalarisVerdelen;