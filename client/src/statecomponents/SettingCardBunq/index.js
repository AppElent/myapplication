import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Typography
} from '@material-ui/core';

import { useSession } from 'hooks';
import { Button, OauthAuthorize } from 'components';


const useStyles = makeStyles(theme => ({
  deleteButton: {
    color: 'red'
  }
}));

const SettingCardEnelogic = ({}) => {
  const classes = useStyles();
  const {userInfo, ref} = useSession();

  return (
    <div></div>
  );
};

SettingCardEnelogic.propTypes = {
  config: PropTypes.object
};

export default SettingCardEnelogic;


