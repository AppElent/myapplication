import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  TextField, 
  Typography
} from '@material-ui/core';

import { useForm, useSession } from 'hooks';
import { saveSolarEdgeSettings, deleteSolarEdgeSettings } from 'modules/SolarEdge';
import { deleteEnelogicSettings } from 'modules/Enelogic';
import { Alert, Button, OauthAuthorize } from 'components';


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

  const {hasError, isDirty, state, handleOnChange, handleOnSubmit, submitting, setInitial} = useForm({api_key: userData.solaredge.access_token || ''}, {}, saveSolarEdgeSettings(user, userDataRef.doc('solaredge')));

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          md={5}
          xs={12}
        >
          <Card>
            <CardHeader
              subheader="Connect"
              title="Enelogic"
            />
            <Divider />
            <CardContent>
              <Typography>{userData.enelogic.success ? `Registratie vanaf: ${userData.enelogic.measuringpoints.electra.dayMin}` : 'Enelogic connectie is niet gemaakt. Deze is nodig om de meterstanden op te kunnen halen.'}</Typography>
            </CardContent>
            <Divider />
            <CardActions>
              <OauthAuthorize
                formatUrl="/api/oauth/formaturl/enelogic"
                title="Connect Enelogic"
              />
              <Button
                className={classes.deleteButton}
                onClick={() => {deleteEnelogicSettings(userDataRef.doc('enelogic'))}}
                variant="outlined"
              >
                    Delete
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid
          item
          md={5}
          xs={12}
        >
          <Card>
            <CardHeader
              subheader="Set SolarEdge API key"
              title="SolarEdge"
            />
            <Divider />
            <CardContent>
              <TextField
                fullWidth
                helperText={userData.solaredge.success ? 'Configuratie is succesvol' : ''}
                label="API Key"
                name="api_key"
                onChange={handleOnChange}
                type="password"
                value={state.api_key.value || ''}
                variant="outlined"
              />
            </CardContent>

            <Divider />
            <CardActions>
              <Button
                color="primary"
                disabled={!isDirty}
                loading={submitting}
                onClick={handleOnSubmit}
                variant="contained"
              >
                    Save
              </Button>
              <Button
                className={classes.deleteButton}
                onClick={() => {deleteSolarEdgeSettings(userDataRef.doc('solaredge')); setInitial()}}
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
