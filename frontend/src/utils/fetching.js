//import React, {Component} from 'react';
//import { withAuth } from '@okta/okta-react';

//const someCommonValues = ['common', 'values'];

export const doSomethingWithInput = (theInput) => {
    //Do something with the input
    return theInput;
};

export const justAnAlert = () => {
    alert('hello');
};

export const getObject = object => {
    const objectKeys = Object.keys(object);
    const objectKey = objectKeys[0];

    return object[objectKey];
};

export const fetchData = (url, token=null) => {
    if(token == null){
	  return fetch(url)
		.then(response => {
		  if (!response.ok) {
			console.log("Network failure")
		  }
		  return response;
		})
		.then(response => 
			response.clone().json().catch(() => response.text())
		)	

	}else{
  
	  return fetch(url, {
            headers: {
              Authorization: 'Bearer ' + token
            }
          })
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
}

export const postData = (url, body, token = null) => {
  return fetch(url, {    
	    method: 'POST',
            headers: {
	       Authorization: 'Bearer ' + token,
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
            },
	    body: JSON.stringify(body)
          })
    .then(response => {
      if (!response.ok) {
        console.log("Network failure")
      }
      return response;
    })
    .then(data => data.json())
}

export const putData = (url, body, token = null) => {
  console.log("ja", url, body, token);
  return fetch(url, {    
	    method: 'PUT',
            headers: {
	       Authorization: 'Bearer ' + token,
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
            },
	    body: JSON.stringify(body)
          }).catch(error => console.error(error))
    .then(response => {
      if (!response.ok) {
        console.log("Network failure")
      }
      return response;
    })
    .then(data => data.json())
}

export const deleteData = (url, token = null) => {
  return fetch(url, {    
	    method: 'DELETE',
            headers: {
	       Authorization: 'Bearer ' + token,
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
            }
          }).catch(error => console.error(error))
    .then(response => {
      if (!response.ok) {
        console.log("Network failure")
      }
      return response;
    })
    .then(data => data.json())
}

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
