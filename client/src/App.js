import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Chart } from 'react-chartjs-2';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';

import { chartjs } from 'helpers';
import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';

import Firebase, {FirebaseContext} from './context/FirebaseContext';
import { CacheContext } from './context/CacheContext';

const browserHistory = createBrowserHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

const App = () => {
  
  if (window.location.protocol != 'https:' && process.env.NODE_ENV !== 'development') window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
  
  const firebase = new Firebase();
  const [authData, setAuthData] = useState({firebase, user: undefined, isInitializing: true, ref: null, userDataRef: null});
  const [cacheData, setCacheData] = useState({});
  const getCache = useCallback((cacheData) => (key) => {
    console.log('Getting value from cache with key ' + key, cacheData);
    return cacheData[key];
  })
  const setCache = useCallback((setFunction) => (key, data) => {
    try{
      console.log(cacheData);
    
      console.log('Setting value to cache with key ' + key, data);
      let dataCopy = JSON.parse(JSON.stringify(cacheData));
      dataCopy[key] = data;
      console.log(dataCopy, cacheData);
      setFunction(dataCopy); 
      console.log('jaja');
    }catch(err){
      console.log(err);
    }
  })

 
  
  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth.onAuthStateChanged(async (returnedUser) => {
      console.log(returnedUser);
      let ref = null;
      let userDataRef = null;
      if(returnedUser){
        ref = firebase.db.doc('/env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/users/' + returnedUser.uid);
        userDataRef = ref.collection('config');
      } 
      setAuthData({...authData, user: returnedUser, isInitializing: false, ref, userDataRef})
    })
    // unsubscribe to the listener when unmounting
    return () => unsubscribe()
  }, [])

  const [userInfo, setUserInfo] = useState(undefined);

  useEffect(() => {
    if (authData.isInitializing || authData.user === null) return;
    const ref = firebase.db.doc('/env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/users/' + authData.user.uid);
    return ref.onSnapshot(async doc => {
      const userInfoData = doc.data();
      let changed = false;
      if(!userInfoData.bunq) {changed = true; userInfoData.bunq = {success: false}}
      if(!userInfoData.enelogic) {changed = true; userInfoData.enelogic = {success: false}}//await ref.doc('enelogic').set({success: false});
      if(!userInfoData.solaredge) {changed = true; userInfoData.solaredge = {success: false}}//await ref.doc('solaredge').set({success: false});
      if(changed) ref.set(userInfoData);
      console.log('UserInfo wijziging', userInfoData);
      setUserInfo(userInfoData);
    });
  }, [authData.isInitializing, authData.user]);

  const [userData, setUserData] = useState(undefined);

  useEffect(() => {
    if (authData.isInitializing || authData.user === null) return;
    const ref = firebase.db.collection('/env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/users/' + authData.user.uid + '/config');
    return ref.onSnapshot(async collection => {
      const userdata = {}
      for(var doc of collection.docs){
        userdata[doc.id] = doc.data();
      }
      //if(userdata.bunq === undefined) await ref.doc('bunq').set({success: false});
      //if(userdata.enelogic === undefined) await ref.doc('enelogic').set({success: false});
      //if(userdata.solaredge === undefined) await ref.doc('solaredge').set({success: false});
      setUserData(userdata);
    })
  }, [authData.isInitializing, authData.user]);

  if(authData.isInitializing || (authData.user !== null && userInfo === undefined) || (authData.user !== null && userData === undefined)){
    return <div>Loading</div>
  }

  return (
    <FirebaseContext.Provider value={{firebase: authData.firebase, user: authData.user, isInitializing: authData.isInitializing, userInfo, userData, ref: authData.ref, userDataRef: authData.userDataRef}}>
      <CacheContext.Provider value={{data: cacheData, get: getCache(cacheData), set: setCache(setCacheData)}}>
        <ThemeProvider theme={theme}>
          <Router history={browserHistory}>
            <Routes />
          </Router>
        </ThemeProvider>
      </CacheContext.Provider>
    </FirebaseContext.Provider>
  );
}

export default App;
