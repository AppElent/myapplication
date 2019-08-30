/* eslint-disable react/no-multi-comp */
import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  ThemeDashboard,
  ThemeProductList,
  ThemeUserList,
  ThemeTypography,
  ThemeIcons,
  ThemeAccount,
  ThemeSettings,
  ThemeSignUp,
  ThemeSignIn,
  ThemeNotFound,
  Home,
  SignIn,
  Account,
  Rekeningen,
  Bunq,
  NotFound
} from './views';

const Routes = () => {
  
  return (
    <Switch>
      
      <Redirect
        exact
        from="/"
        to="/home"
      />
      <RouteWithLayout 
        component={Home}
        exact
        layout={MainLayout}
        path="/home"
        protectedRoute
      />
      <RouteWithLayout 
        component={SignIn}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout 
        component={ThemeDashboard}
        exact
        layout={MainLayout}
        path="/private"
        protectedRoute
      />
      <RouteWithLayout 
        component={Account}
        exact
        layout={MainLayout}
        path="/account"
        protectedRoute
      />
      <RouteWithLayout 
        component={Rekeningen}
        exact
        layout={MainLayout}
        path="/rekeningen"
        protectedRoute
      />
      <RouteWithLayout 
        component={Bunq}
        exact
        layout={MainLayout}
        path="/bunq"
        protectedRoute
      />
      <RouteWithLayout 
        component={NotFound}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <RouteWithLayout 
        component={ThemeDashboard}
        exact
        layout={MainLayout}
        path="/theme/dashboard"
      />
      <RouteWithLayout        
        component={ThemeUserList}
        exact
        layout={MainLayout}
        path="/theme/users"
      />
      <RouteWithLayout        
        component={ThemeProductList}
        exact
        layout={MainLayout}
        path="/theme/products"
      />
      <RouteWithLayout        
        component={ThemeTypography}
        exact
        layout={MainLayout}
        path="/theme/typography"
      />
      <RouteWithLayout        
        component={ThemeIcons}
        exact
        layout={MainLayout}
        path="/theme/icons"
      />
      <RouteWithLayout        
        component={ThemeAccount}
        exact
        layout={MainLayout}
        path="/theme/account"
      />
      <RouteWithLayout 
        component={ThemeSettings}
        exact
        layout={MainLayout}
        path="/theme/settings"
      />
      <RouteWithLayout 
        component={ThemeSignUp}
        exact
        layout={MinimalLayout}
        path="/theme/sign-up"
      />
      <RouteWithLayout 
        component={ThemeSignIn}
        exact
        layout={MinimalLayout}
        path="/theme/sign-in"
      />
      <RouteWithLayout 
        component={ThemeNotFound}
        exact
        layout={MinimalLayout}
        path="/theme/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
