import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Grid
} from '@material-ui/core';

import { SettingCardBunq } from 'statecomponents';


const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
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
        spacing={2}
      >
        <Grid
          item
          md={7}
          xs={12}
        >
          <SettingCardBunq />
        </Grid>
      </Grid>
    </div>
  );
};

Settings.propTypes = {
  config: PropTypes.object
};

export default Settings;
