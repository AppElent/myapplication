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

export const postData = (url, token = null) => {
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
    .then(data => data.json())
}
