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
  const [authData, setAuthData] = useState({firebase, user: null, isInitializing: true, userdata: {info: null, data: null}});
  //const [user, setUser] = useState(null);
  //const [isInitializing, setIsInitializing] = useState(true);
  //const [userdata, loading, error] = useFirestoreDocument('users/' + user.uid);
  //const [userdata, setUserdata] = useState(null);

  //const firebase = new Firebase();

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth.onAuthStateChanged(async (returnedUser) => {
      console.log(returnedUser);
      //setUser(returnedUser);
      //setIsInitializing(false);
      let userdata = {info: null, data: null};
      if(returnedUser){
        let info = await firebase.db.doc('/env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/users/' + returnedUser.uid).get();
        userdata.info = info.data();
        const collection = await firebase.db.collection('/env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/users/' + returnedUser.uid + '/data').get();
        userdata.data = {};
        for(var doc of collection.docs){
          userdata.data[doc.id] = doc.data();
        }
        console.log(userdata);
      }
      setAuthData({...authData, user: returnedUser, isInitializing: false, userdata: userdata})
      //setUserdata(data.data());
    })
    // unsubscribe to the listener when unmounting
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if(authData.isInitializing || authData.user === null) return;
    const ref = firebase.db.doc('/env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/users/' + authData.user.uid);
    return ref.onSnapshot(doc => {
      setAuthData({...authData, userinfo: doc.data()});
    });
  }, []);
  
  return (
    <FirebaseContext.Provider value={{firebase: authData.firebase, user: authData.user, isInitializing: authData.isInitializing, userinfo: authData.userinfo, userdata: authData.userdata}}>
      <ThemeProvider theme={theme}>
        <Router history={browserHistory}>
          <Routes />
        </Router>
      </ThemeProvider>
    </FirebaseContext.Provider>
  );
}

export default App;

/*
export default class App extends Component {

  render() {
    return (
      <FirebaseContext.Provider value={new Firebase()}>
        <ThemeProvider theme={theme}>
          <Router history={browserHistory}>
            <Routes />
          </Router>
        </ThemeProvider>
      </FirebaseContext.Provider>
    );
  }
}
*/