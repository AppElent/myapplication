// Import FirebaseAuth and firebase.
import React, {useState, useEffect} from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
//import firebaseui from 'react-firebaseui';
//import firebase from 'firebase';
import useSession from '../../hooks/useSession';

const Login = () => {
  const firebase = useSession();
  const [isSignedIn, setIsSignedIn] = useState(false);


  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers. 
    signInOptions: [
      firebase.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    credentialHelper: 'none',
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth.onAuthStateChanged((user) => {setIsSignedIn(!!user)})
    // unsubscribe to the listener when unmounting
    return () => unsubscribe()
  }, [])

  if (!isSignedIn) {
    return (
      <div>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth}/>
      </div>
    );
  }
  return (
    <div>
      <button onClick={() => firebase.auth.signOut()}>Sign-out</button>
    </div>
  );
}

export default Login;
/*
export default class Login extends React.Component {
  firebase = useSession();
  
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
      this.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      this.firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      this.firebase.auth.GithubAuthProvider.PROVIDER_ID,
      this.firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    credentialHelper: 'none',
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = this.firebase.auth.onAuthStateChanged(
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
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={this.firebase.auth}/>
        </div>
      );
    }
    return (
      <div>
        <button onClick={() => this.firebase.auth.signOut()}>Sign-out</button>
      </div>
    );
  }
}
*/