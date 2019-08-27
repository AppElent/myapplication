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
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const firebase = new Firebase();

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth.onAuthStateChanged((returnedUser) => {
      setUser(returnedUser);
      setIsInitializing(false);
    })
    // unsubscribe to the listener when unmounting
    return () => unsubscribe()
  }, [])
  
  return (
    <FirebaseContext.Provider value={{firebase, user, isInitializing}}>
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