// Import FirebaseAuth and firebase.
import React, {useContext} from 'react';
import {FirebaseAuthContext} from '../../context/FirebaseContext';
import {auth} from '../../config/Firebase';

const getData = async () => {
  const token = await auth.currentUser.getIdToken(true);
  console.log(token, auth.currentUser);
  const fetchhh = await fetch('/api/testfirebase',  { headers: {
    Authorization: 'Firebase ' + token,
   'Accept': 'application/json',
   'Content-Type': 'application/json'
       }})
       console.log(fetchhh.json());
}

const TestFirebase2 = () => {
  const test = useContext(FirebaseAuthContext);
  console.log(1, test, FirebaseAuthContext, process.env.NODE_ENV); 
  getData();
  return <div>Test2</div>
}

export default TestFirebase2