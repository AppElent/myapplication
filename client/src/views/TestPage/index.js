import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { useFirestoreDocumentDataOnce} from '../../hooks/useFirestore';
import useSession from '../../hooks/useSession';

import {OAuthAuthorize, OAuthToken, LoadingButton} from '../../components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const TestPage = () => {
  const classes = useStyles();
  const authData = useSession();
  console.log(authData);
  const {value, loading, error} = useFirestoreDocumentDataOnce('users/<dummy>');
  const [een, twee, drie] = useFirestoreDocumentDataOnce('users/' + authData.user.uid);
  console.log(value, loading, error);
  console.log(een, twee, drie);

  

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
          <OAuthAuthorize title="Enelogic" formatUrl='/api/oauth/formaturl/enelogic' />
          <OAuthToken />
          <p>Omgeving is {process.env.REACT_APP_FIRESTORE_ENVIRONMENT}</p>
          <span>User data: {JSON.stringify(authData.userData)}</span>
          <span>User info: {JSON.stringify(authData.userInfo)}</span>
          {value && <span>User1 data: {JSON.stringify(value.data())}</span>}
          {error && <span>User1 data: {JSON.stringify(error)}</span>}
          <LoadingButton loading={true}>Testje</LoadingButton>
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
