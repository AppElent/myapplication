// Import FirebaseAuth and firebase.
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
//import firebaseui from 'react-firebaseui';
//import firebase from 'firebase';
import firebase, {auth} from '../../helpers/Firebase';

export default class Login extends React.Component {

  // The component's Local state.
  state = {
    isSignedIn: false // Local signed-in state.
  };

  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers. 
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    credentialHelper: 'none',
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = auth.onAuthStateChanged(
      (user) => this.setState({isSignedIn: !!user})
    );
  }
  
  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    if (!this.state.isSignedIn) {
      return (
        <div>
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={auth}/>
        </div>
      );
    }
    return (
      <div>
        <button onClick={() => auth.signOut()}>Sign-out</button>
      </div>
    );
  }
}