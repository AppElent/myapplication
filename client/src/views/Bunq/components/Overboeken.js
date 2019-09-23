import React, {useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';



const useStyles = makeStyles(theme => ({
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  refreshButton: {
    marginRight: theme.spacing(2)
  },
  content: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2)
  }
}));

const Overboeken = (props) => {
  const classes = useStyles();

  return (  
    <div className={classes.content}>
      Test
    </div>
  )

}

Overboeken.propTypes = {

};

export default Overboeken;