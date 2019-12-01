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
import { useTranslation } from 'react-i18next';

import { useForm, useSession } from 'hooks';
import { saveSolarEdgeSettings, deleteSolarEdgeSettings } from 'modules/SolarEdge';
import { deleteEnelogicSettings } from 'modules/Enelogic';
import { Alert, Button, OauthAuthorize } from 'components';
import { SettingCardEnelogic } from 'statecomponents';



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
  const {user, userInfo, ref} = useSession();
  const { t } = useTranslation();

  const {hasError, isDirty, state, handleOnChange, handleOnSubmit, submitting, setInitial} = useForm({api_key: userInfo.solaredge.access_token || ''}, {}, saveSolarEdgeSettings(user, ref));

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
          <SettingCardEnelogic />
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
                helperText={userInfo.solaredge.success ? 'Configuratie is succesvol' : ''}
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
                {t('buttons.save')}
              </Button>
              <Button
                className={classes.deleteButton}
                onClick={() => {deleteSolarEdgeSettings(ref); setInitial()}}
                variant="outlined"
              >
                {t('buttons.delete')}
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
