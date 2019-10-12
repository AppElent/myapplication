import * as firebase from 'firebase';


var firebaseConfig = {
  apiKey: 'AIzaSyCCyQmkLU5UFKg7C4mqEvTw0QaVZ5ZWKyU',
  authDomain: 'administratie-app.firebaseapp.com',
  databaseURL: 'https://administratie-app.firebaseio.com',
  projectId: 'administratie-app',
  storageBucket: 'administratie-app.appspot.com',
  messagingSenderId: '909589468874',
  appId: '1:909589468874:web:25a83d1464dd94f0'
};

class Firebase {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.firebase = firebase;
    this.auth = firebase.auth();
    this.db = firebase.firestore();
  }

}
export default Firebase;