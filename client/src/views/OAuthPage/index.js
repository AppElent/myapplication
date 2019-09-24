import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';

import fetchBackend from '../../helpers/fetchBackend';
import useSession from '../../hooks/useSession';
import {OauthAuthorize} from '../../components';

const config = {
  enelogic: {
    redirectUrl: '/meterstanden',
    url: '/api/oauth/exchange/enelogic',
    refreshUrl: '/api/oauth/refresh/enelogic',
    formatUrl: '/api/oauth/formaturl/enelogic'
  },bunq: {
    redirectUrl: '/bunq',
    url: '/api/bunq/oauth/exchange',
    formatUrl: '/api/oauth/formaturl/bunq'
  }
}


const OAuthPage = ({match}) => {
  const {user, ref, userData} = useSession();
  const [loading, setLoading] = useState(true);
  const name = match.params.name.toLowerCase();
  const settings = config[name]
  console.log(settings);

  const exchangeToken = async () => {
    const parsed = queryString.parse(window.location.search);
    console.log(parsed);
        
    if(parsed.code !== undefined){
      const body = {code: parsed.code}
      console.log(body);
      const accesstoken = await fetchBackend(settings.url, {method: 'POST', body, user}).catch(err => {console.log(err);});
      console.log(accesstoken);
      if(accesstoken !== undefined && name !== 'bunq'){
        ref.update({[`${name}.token`]: accesstoken.data}).then(setLoading(false));
      }
    }
  }

  const refreshToken = async () => {
    const body = userData.enelogic.data;
    const accesstoken = await fetchBackend('/api/oauth/refresh/enelogic', {method: 'POST', body, user}).catch(err => {console.log(err);});
    console.log(accesstoken);
    ref.update({
      [`${name}.token.access_token`]: accesstoken.data.access_token,
      [`${name}.token.expires_at`] : accesstoken.data.expires_at,
      [`${name}.token.refresh_token`] : accesstoken.data.refresh_token
    }).then(setLoading(false));
    console.log(accesstoken);
  }
    
  useEffect(() => {
    exchangeToken() 
  }, [])

  return (<div>
    <OauthAuthorize title={name} formatUrl={settings.formatUrl} />
    <Typography variant='h1'>OAuth 2.0</Typography>
    {!loading && <Redirect to={settings.redirectUrl} />}
    <Button onClick={refreshToken}>Refresh</Button>
    </div>
  );
} 

OAuthPage.propTypes = {
  match: PropTypes.any.isRequired
}

export default OAuthPage


