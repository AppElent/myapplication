
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';

import fetchBackend from 'helpers/fetchBackend';
import { useSession, useFetch } from 'hooks';

const OauthAuthorize = ({title, formatUrl}) => {
  //const [url, setUrl] = useState('');
  const {user} = useSession();
  const {data: url, error, request} = useFetch(formatUrl, {cacheKey: ('oauthUrl_' + title.replace(' ', '_'))});
  
  console.log(error, url);
  useEffect(() => {
    request.get();
  }, [formatUrl, user])
    
  return (
    <Button 
      color="primary"
      disabled={url === ''}
      href={url}
      variant="contained"
    >
      {title}
    </Button> 
  )
}

export default OauthAuthorize;