import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json';

// Initialize Firebase Admin SDK
function initFirebaseAdmin() {
    const apps = admin.apps; // Get the list of initialized apps.

    if (!apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                ...serviceAccount, // Spread the properties of the service account
                private_key: serviceAccount.private_key.replace(/\\n/g, '\n') // Fix newline handling in the private key
            }),
        });
    }

    return {
        auth: admin.auth(),
        db: admin.firestore(),
    };
}

// Initialize the app and export auth and db
const { auth, db } = initFirebaseAdmin();

export { auth, db };
