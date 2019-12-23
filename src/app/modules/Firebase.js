import * as admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: 'administratie-app',
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: 'https://administratie-app.firebaseio.com',
});

export default admin;
export const db = admin.firestore();
export const auth = admin.auth();

export class FirebaseClass {
    constructor(path) {
        this.path = path;
    }

    async get(key) {
        console.log(key);
    }

    async set(key, data) {
        console.log(key, data);
    }

    async remove(key) {
        console.log(key);
    }
}

//auth.getUserByEmail('ericjansen@live.nl').then(user => {console.log(user.toJSON())})
