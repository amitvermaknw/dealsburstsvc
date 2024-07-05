import admin from 'firebase-admin';

var serviceAccount = require('../../../firebaseKeys.json');

class Config {
    initConfig() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://streettadka-default-rtdb.firebaseio.com"
            });
        }
        return admin.firestore();
    }
}


export default Config;