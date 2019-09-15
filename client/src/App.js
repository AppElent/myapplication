import React, { useState, useEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Chart } from 'react-chartjs-2';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';

import { chartjs } from './helpers';
import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';

import Firebase, {FirebaseContext} from './context/FirebaseContext';

const browserHistory = createBrowserHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

const App = () => {
  const firebase = new Firebase();
  const [authData, setAuthData] = useState({firebase, user: undefined, isInitializing: true, ref: null});
  
  
  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth.onAuthStateChanged(async (returnedUser) => {
      console.log(returnedUser);
      let ref = null;
      if(returnedUser) ref = firebase.db.doc('/env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/users/' + returnedUser.uid);
      setAuthData({...authData, user: returnedUser, isInitializing: false, ref})
    })
    // unsubscribe to the listener when unmounting
    return () => unsubscribe()
  }, [])

  const [userInfo, setUserInfo] = useState(undefined);

  useEffect(() => {
    if (authData.isInitializing || authData.user === null) return;
    const ref = firebase.db.doc('/env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/users/' + authData.user.uid);
    return ref.onSnapshot(doc => {
      setUserInfo(doc.data());
    });
  }, [authData.isInitializing, authData.user]);

  const [userData, setUserData] = useState(undefined);

  useEffect(() => {
    if (authData.isInitializing || authData.user === null) return;
    const ref = firebase.db.collection('/env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/users/' + authData.user.uid + '/data');
    return ref.onSnapshot(collection => {
      const userdata = {}
      for(var doc of collection.docs){
        userdata[doc.id] = doc.data();
      }
      setUserData(userdata);
    })
  }, [authData.isInitializing, authData.user]);

  if(authData.isInitializing || (authData.user !== null && userInfo === undefined)){
    return <div>Loading</div>
  }

  return (
    <FirebaseContext.Provider value={{firebase: authData.firebase, user: authData.user, isInitializing: authData.isInitializing, userInfo, userData, ref: authData.ref}}>
      <ThemeProvider theme={theme}>
        <Router history={browserHistory}>
          <Routes />
        </Router>
      </ThemeProvider>
    </FirebaseContext.Provider>
  );
}

export default App;
