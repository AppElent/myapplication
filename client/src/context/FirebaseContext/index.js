// @flow
import * as React from 'react';
import Firebase from '../../helpers/Firebase';


export const FirebaseContext = React.createContext(null);
export default Firebase;
/*
export default class FirebaseAuthProvider extends React.Component {

    state = defaultFirebaseContext;

  /*
    componentDidMount() {
      auth.onAuthStateChanged(user => {
        if(user){
          this.setState({
            auth,
            firebase,
            authStatusReported: true,
            isUserSignedIn: true,
            user
          });
        }else{
          this.setState({
            auth,
            firebase,
            authStatusReported: true,
            isUserSignedIn: false,
            user: null
          });
        }

      });
    }
    

    render(){
      const {children} = this.props;
      //const {firebase, authStatusReported, isUserSignedIn, user, db} = this.state;
      return (
        <FirebaseAuthContext.Provider value={new Firebase()}>
          {/*authStatusReported && children}
        </FirebaseAuthContext.Provider>
      );
    }
}
*/
