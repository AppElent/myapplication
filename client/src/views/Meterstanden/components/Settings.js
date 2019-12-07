import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

import { SettingCardEnelogic, SettingCardSolarEdge } from 'statecomponents';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  deleteButton: {
    color: 'red'
  }
}));

const Settings = () => {
  const classes = useStyles();

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
          <SettingCardSolarEdge />
        </Grid>


      </Grid>
    </div>
  );
};

Settings.propTypes = {
  config: PropTypes.object
};

export default Settings;
