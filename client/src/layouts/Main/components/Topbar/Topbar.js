import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'

import AppTitle from 'components/AppTitle';

import { useMaterialUIMenu, useSession } from 'hooks';


const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}));

const Topbar = props => {
  const {firebase} = useSession();
  
  const { className, onSidebarOpen, ...rest } = props;

  const classes = useStyles();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const {anchorEl, open, handleOpen, handleClose} = useMaterialUIMenu();
  const {anchorEl: logoutAnchor, open: logoutOpen, handleOpen: logoutHandleOpen, handleClose: logoutHandleClose} = useMaterialUIMenu();

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <RouterLink to="/">
          <AppTitle />
        </RouterLink>
        <div className={classes.flexGrow} />
        <Hidden mdDown>
          <IconButton color="inherit" onClick={handleOpen}>
            <Badge
              badgeContent={notifications.length}
              color="error"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            id="simple-menu"
            keepMounted
            open={open}
            onClose={handleClose}
          >
            {notifications.map(notification => <MenuItem>{notification}</MenuItem>)}
            {notifications.length === 0 && <MenuItem>{t('notifications.no_notifications')}</MenuItem>}
          </Menu>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={logoutHandleOpen}
            //onClick={() => {
              //firebase.auth.signOut();
            //}}
          >
            <InputIcon />
          </IconButton>
          <Menu
            anchorEl={logoutAnchor}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            id="simple-menu"
            keepMounted
            open={logoutOpen}
            onClose={logoutHandleClose}
          >
            <MenuItem onClick={logoutHandleClose} component={Link} to="/account">{t('navigation.account')}</MenuItem>
            <MenuItem onClick={() => {firebase.auth.signOut();logoutHandleClose();}}>{t('buttons.logout')}</MenuItem>
          </Menu>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func
};

export default Topbar;
