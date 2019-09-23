import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Moment from 'react-moment';
import MaterialTable from 'material-table';

import EventsToolbar from './components/EventsToolbar';
import useSession from 'hooks/useSession';
import useFetch from 'hooks/useFetch';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const Events = () => {

  const {user} = useSession();
  const classes = useStyles();
  const {data, loading, error, request} = useFetch('/api/events', {user})
  const [all, setAll] = useState(false)
    
  useEffect(() => {
    const queryparams = (all ? '' : '?scope=last_week')
    request.get('/api/events', queryparams)
  }, [all]);



  const columns = [{
    title: 'Datum/tijd',
    field: 'datetime'
    //render: rowData => <Moment date={rowData.datetime} format="YYYY-MM-DD HH:mm" tz="Europe/Amsterdam"/>
  }, {
    title: 'Event',
    field: 'value',
  }]     

  return (
    <div className={classes.root}>
      <EventsToolbar 
        all={all}
        setAll={setAll}
      />
      <div className={classes.content}>
        <MaterialTable 
          columns={columns}
          data={data}
          title="Events"
        /> 
      </div>
    </div>
  );
};

export default Events;
