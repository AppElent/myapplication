// src/pages/Login.js

import React, { Component, useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import OktaSignInWidget from '../components/OktaSignInWidget';
import { withAuth } from '@okta/okta-react';
import { AuthContext } from '../context/AuthContext';


const Login = ({auth}) => {
  //const [authenticated, setAuthenticated] = useState(false);
  const { authenticated, setAuthenticated, admin, setAdmin } = useContext(AuthContext);
  
  const checkAuthenticated = async () => {
    const authenticatedResponse = await auth.isAuthenticated();
    if (authenticatedResponse !== authenticated) {
      setAuthenticated( authenticatedResponse );
    }
  }
  
  useEffect(() => {
    checkAuthenticated();
  }, [authenticated])
  
  
  const onSuccess = (res) => {
    if (res.status === 'SUCCESS') {
      return auth.redirect({
        sessionToken: res.session.token
      });
   } else {
    // The user can be in another authentication state that requires further action.
    // For more information about these states, see:
    //   https://github.com/okta/okta-signin-widget#rendereloptions-success-error
    }
  }

  const onError = (err) => {
    console.log('error logging in', err);
  }

  if (authenticated === null) return null;
  return authenticated ?
    <Redirect to={{ pathname: '/' }}/> :
    <OktaSignInWidget
      baseUrl='https://dev-810647.okta.com'
      onSuccess={onSuccess}
      onError={onError}/>;

  
}

export default withAuth(Login)

/*
export default withAuth(class Login extends Component {
  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.state = {
      authenticated: null
    };
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  onSuccess(res) {
    if (res.status === 'SUCCESS') {
      return this.props.auth.redirect({
        sessionToken: res.session.token
      });
   } else {
    // The user can be in another authentication state that requires further action.
    // For more information about these states, see:
    //   https://github.com/okta/okta-signin-widget#rendereloptions-success-error
    }
  }

  onError(err) {
    console.log('error logging in', err);
  }

  render() {
    if (this.state.authenticated === null) return null;
    return this.state.authenticated ?
      <Redirect to={{ pathname: '/' }}/> :
      <OktaSignInWidget
        baseUrl={this.props.baseUrl}
        onSuccess={this.onSuccess}
        onError={this.onError}/>;
  }
});
*/
