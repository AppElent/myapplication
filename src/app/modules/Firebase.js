import * as admin from 'firebase-admin';

//var serviceAccount = require("../../../config/firebase/firebase.json");

admin.initializeApp({
  credential: admin.credential.cert({
    "projectId": 'administratie-app',
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: 'https://administratie-app.firebaseio.com',
});

export default admin;
export const db = admin.firestore();
export const auth = admin.auth();
//auth.getUserByEmail('ericjansen@live.nl').then(user => {console.log(user.toJSON())})
