import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, TextField } from '@material-ui/core';

import {useSession, useCache, useFetch} from 'hooks';
import { Button, Table } from 'components';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  button: {
    marginRight: theme.spacing(2)
  }
}));

const Demo = () => {
  const classes = useStyles();
  const { userInfo } = useSession();
  const {data, loading, error, request} = useFetch('/api/demo', {})

  console.log(data, loading, error)

  const columns = [{
    title: 'ID',
    field: 'id'
  },{
    title: 'Datum/tijd',
    field: 'datetime'
  },{
    title: 'Waarde',
    field: 'value'
  }]

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          md={7}
          xs={12}
        > 
          <Button className={classes.button} variant="contained" color="primary" onClick={() => {request.get(true)}}>Get data</Button>
          <Button className={classes.button} variant="contained" color="primary" onClick={() => {request.post({value: 'test123'})}}>Post data</Button>
          <Button className={classes.button} variant="contained" color="primary" onClick={() => {const id = prompt('Welk Id wil je aanpassen?');const value=prompt('Nieuwe waarde?');request.put(parseInt(id), {value})}}>Put data</Button>
          <Button className={classes.button} variant="contained" color="primary" onClick={() => {const id = prompt('Welk Id wil je verwijderen?');request.destroy(parseInt(id))}}>Delete data</Button>
        </Grid>
      </Grid>
      <Table 
        columns={columns}
        data={data}
        title="Demo data"
      />
    </div>
  );
};

export default Demo;
