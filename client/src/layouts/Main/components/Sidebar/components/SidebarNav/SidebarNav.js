/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, ListSubheader, Button, colors, Collapse, Divider } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    position: 'relative',
    overflow: 'auto',
  },
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  },
  nested: {
    marginLeft: theme.spacing(2)
  },
  spacer: {
    flexGrow: 1
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

const SidebarNav = props => {
  const { pages, className, ...rest } = props;

  const classes = useStyles();
  const [state, setState] = useState({});

  const handleClick = (name) => (e) => {
    console.log(state, !state[name]);
    setState(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
      subheader={<li />}
    >
      {pages.map(group => (
        <li>
          <ul className={classes.ul}>
            {group.groupname && <><Divider /><ListSubheader>{group.groupname}</ListSubheader></> }
            {group.routes.map(page => (
              <div key={page.title}>
                {page.children ? 
                  <>
                    <ListItem
                      className={classes.item}
                      disableGutters
                      key={page.title}
                    >                
                      <Button
                      //activeClassName={classes.active}
                        className={classes.button}
                        //component={CustomRouterLink}
                        onClick={handleClick(page.title)}
                      //to={page.href}
                      >
                        <div className={classes.icon}>{page.icon}</div>
                        {page.title}
                        <span className={classes.spacer} />
                        {state[page.title] ? <ExpandLess /> : <ExpandMore />}
                      </Button>
                    </ListItem>
                    <Collapse in={state[page.title] ? true : false} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {page.children.map(childpage => (
                          <ListItem
                            className={classes.nested}
                            disableGutters
                            key={childpage.title}
                          >                
                            <Button
                              activeClassName={classes.active}
                              className={classes.button}
                              component={CustomRouterLink}
                              to={childpage.href}
                            >
                              <div className={classes.icon}>{childpage.icon}</div>
                              {childpage.title}
                            </Button>
                          </ListItem>
                        ))}

                      </List>
                    </Collapse>
                  </>
                  : 
                  <ListItem
                    className={classes.item}
                    disableGutters
                    key={page.title}
                  >
                    <Button
                      activeClassName={classes.active}
                      className={classes.button}
                      component={CustomRouterLink}
                      to={page.href}
                    >
                      <div className={classes.icon}>{page.icon}</div>
                      {page.title}
                    </Button>
                  </ListItem>
                }
              </div>
            ))}
          </ul>
        </li>
      ))}
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default SidebarNav;