import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import {useFirestoreDocument} from '../../hooks/useFirestore';
import useSession from '../../hooks/useSession';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const TestPage = () => {
  const classes = useStyles();
  const authData = useSession();
  console.log(authData);
  const {value, loading, error} = useFirestoreDocument('users/user1');
  console.log(value, loading, error);


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
          <p>Omgeving is {process.env.REACT_APP_FIRESTORE_ENVIRONMENT}</p>
          <span>User data: {JSON.stringify(authData.userdata)}</span>
          <span>User info: {JSON.stringify(authData.userinfo)}</span>
          {value && <span>User1 data: {JSON.stringify(value.data())}</span>}
        </Grid>
        <Grid
          item
          md={5}
          xs={12} >
          <p>asd</p>
        </Grid>
      </Grid>
    </div>
  );
};

export default TestPage;
