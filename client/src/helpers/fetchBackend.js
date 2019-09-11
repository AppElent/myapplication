
/*

export const getObject = object => {
  const objectKeys = Object.keys(object);
  const objectKey = objectKeys[0];

  return object[objectKey];
};

export const makeAPICall = (url, method, body, token) => {
  if(body == null){body = undefined}
  console.log('Making ' + method + ' API call to ' + url);
  return fetch(url, {    
	  method: method ,
    headers: {
	       Authorization: 'Bearer ' + token,
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
    },
	    body: JSON.stringify(body)
  })//.catch(error => console.error(error))
    .then(response => {
      if (!response.ok) {
        console.log(response)
        throw new Error('Network error')
      }
      return response;
    })
    .then(response => 
	    response.clone().json().catch(() => response.text())
    )
}

export const makeAPICallFromNodeJS = async (url, method, headers, body, token) => {
  const totalBody = {url: url, headers: headers, body: body, method: method}
  const data = await makeAPICall('/api/redirectcall', 'POST', totalBody, token);
  return (data);
  
}

export const fetchBackend = async (url, options) => {
  if(options.method === undefined) options.method = 'GET';
  return (await makeAPICall(url, options.method, options.body, await options.auth.getAccessToken()));
}
*/



const fetchBackend = async (url, options) => {
  const token = await options.user.getIdToken();
  if(options.body === null){options.body = undefined}
  if(options.method === undefined) options.method = 'GET';
  console.log('Making ' + options.method + ' API call to ' + url, options.body);
  return fetch(url, {    
	  method: options.method ,
    headers: {
	       Authorization: 'Firebase ' + token,
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
    },
	    body: JSON.stringify(options.body)
  })//.catch(error => console.error(error))
    .then(async response => {
      if (!response.ok) {
        console.log(response)
        throw await response.json();
      }
      return response;
    })
    .then(response => 
	    response.clone().json().catch(() => response.text())
    )
}
export default fetchBackend;
