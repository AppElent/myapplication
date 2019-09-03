// ./src/car/car.component.jsx
import React from 'react';
import { makeStyles } from '@material-ui/styles';

import RekeningTable from './components/RekeningTable';
import useFetch from '../../hooks/useFetch';

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
  const [data /*, setData, loading, error*/] = useFetch('/api/rekeningen', {onMount: true})

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <RekeningTable data={data}/>
      </div>
    </div>
  );
};

export default Rekeningen
