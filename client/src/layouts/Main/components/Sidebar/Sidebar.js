import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { useTranslation } from 'react-i18next';

import { Profile, SidebarNav } from './components';
import useSession from 'hooks/useSession';


const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const {user} = useSession();

  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();
  const {t} = useTranslation();

  const pages = [
    {
      title: t('navigation.account'),
      href: '/account',
      icon: <AccountBoxIcon />
    },
    {
      title: t('navigation.meterstanden'),
      href: '/meterstanden',
      icon: <DashboardIcon />
    },
    {
      title: t('navigation.rekeningen'),
      href: '/rekeningen',
      icon: <DashboardIcon />,
      children: [{
        title: 'Rekeningen',
        href: '/rekeningen',
        icon: <DashboardIcon />
      },{
        title: 'Test 2',
        href: '/rekeningen?tab=2',
        icon: <DashboardIcon />
      }]
    },
    {
      title: t('navigation.bunq'),
      href: '/bunq',
      icon: <DashboardIcon />
    },
    {
      title: t('navigation.events'),
      href: '/events',
      icon: <DashboardIcon />
    }
  ];

  const avatar = user !== null ? (user.photoURL ? user.photoURL : 'https://media.npr.org/assets/img/2016/01/07/macaca_nigra_self-portrait_custom-a8e13582c9ca6f71f5cd62815b8bb5d6ff112dc2-s800-c15.jpg') : '';

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      > 
        
        {user !== null && <><Profile name={user.displayName} avatar={avatar}/><Divider className={classes.divider} /></>}
        
        
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
