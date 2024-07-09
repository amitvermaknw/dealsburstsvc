import admin from 'firebase-admin';
import { firebaseKeys } from '../../../firebaseConfig';

// var serviceAccount = require('../../../firebaseKeys.json');

class Config {
    initConfig() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(firebaseKeys as admin.ServiceAccount),
                databaseURL: "https://streettadka-default-rtdb.firebaseio.com"
            });
        }
        return { db: admin.firestore(), admin: admin };
    }
}


export default Config;