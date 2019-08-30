// ./src/car/car.component.jsx
import React from 'react';
import { makeStyles } from '@material-ui/styles';

import RekeningTable from './components/RekeningTable';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const Rekeningen = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <RekeningTable />
      </div>
    </div>
  );
};

export default Rekeningen
