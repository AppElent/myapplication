import React, {useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Grid,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Typography
} from '@material-ui/core';
import { useSession } from 'hooks';

import { Button, OauthAuthorize } from 'components';
import { deleteBunqSettings } from 'modules/Bunq';
import { fetchBackend } from 'helpers';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  deleteButton: {
    color: 'red'
  }
}));

const Settings = ({}) => {
  const classes = useStyles();
  const {user, ref, userData, userDataRef} = useSession();
  const [loadingToken, setLoadingToken] = useState(false);

  const createBunqSandbox = async () => {
    setLoadingToken(true);
    const data = await fetchBackend('/api/bunq/sandbox', {user});
    console.log(data);
    await userDataRef.doc('bunq').set({'success': true, 'environment': 'SANDBOX', sparen: 0, eigen: 0})
    setLoadingToken(false);
  }

  
  if(loadingToken) return <CircularProgress className={classes.progress} />

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
          <Card>
            <CardHeader
              subheader="Connect"
              title="Bunq"
            />
            <Divider />
            <CardContent>
              <Typography>{userData.bunq.success ? 'Connectie succesvol' : 'Bunq connectie is niet gemaakt. Deze is nodig om de data op te kunnen halen.'}</Typography>
            </CardContent>
            <Divider />
            <CardActions>
              <OauthAuthorize
                formatUrl="/api/oauth/formaturl/bunq"
                title="Connect Bunq"
              />
              <Button
                className={classes.button}
                color ="primary"
                onClick={createBunqSandbox}
                variant="contained"
              >
                Connect bunq sandbox
              </Button>
              <Button
                className={classes.deleteButton}
                onClick={() => {deleteBunqSettings(userDataRef.doc('enelogic'))}}
                variant="outlined"
              >
                    Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

Settings.propTypes = {
  config: PropTypes.object
};

export default Settings;
