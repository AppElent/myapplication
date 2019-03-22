

export const getObject = object => {
    const objectKeys = Object.keys(object);
    const objectKey = objectKeys[0];

    return object[objectKey];
};

export const makeAPICall = (url, method, body, token) => {
  if(body == null){body = undefined}
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
        console.log("Network failure")
      }
      return response;
    })
    .then(response => 
	    response.clone().json().catch(() => response.text())
    )
}
