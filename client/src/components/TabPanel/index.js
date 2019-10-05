import React from 'react';
import {Typography} from '@material-ui/core';

function TabPanel(props) {
  const { children, visible, tab, ...other } = props;
  
  return (
    <Typography
      component="div"
      hidden={!visible}
      id={`simple-tabpanel_${tab}`}
      role="tabpanel"
      {...other}
    >
      {children}
    </Typography>
  );
}

export default TabPanel