import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  Auth,
} from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';

// Public Firebase Web App config (Project PRI_Dashboard) used as fallback
// when VITE_FIREBASE_* environment variables are not configured on the host.
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBkIwRzFAhLjHklfW0J9PITkrILJgO0EOQ',
  authDomain: 'monitoring-tambak-udang-5a0d0.firebaseapp.com',
  databaseURL:
    'https://monitoring-tambak-udang-5a0d0-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'monitoring-tambak-udang-5a0d0',
  storageBucket: 'monitoring-tambak-udang-5a0d0.firebasestorage.app',
  messagingSenderId: '251716497756',
  appId: '1:251716497756:web:02f150bcebaf33a8e7d199',
};

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY?.trim() ||
    DEFAULT_FIREBASE_CONFIG.apiKey,
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() ||
    DEFAULT_FIREBASE_CONFIG.authDomain,
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL?.trim() ||
    DEFAULT_FIREBASE_CONFIG.databaseURL,
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() ||
    DEFAULT_FIREBASE_CONFIG.projectId,
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() ||
    DEFAULT_FIREBASE_CONFIG.storageBucket,
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() ||
    DEFAULT_FIREBASE_CONFIG.messagingSenderId,
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID?.trim() ||
    DEFAULT_FIREBASE_CONFIG.appId,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.databaseURL &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Database | null = null;

if (isFirebaseConfigured) {
  app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getDatabase(app);
}

export { app, auth, db };

let signInPromise: Promise<void> | null = null;

/**
 * Ensures the browser client holds an authenticated Firebase session
 * before subscribing to Realtime Database rules requiring `auth != null`.
 */
export async function ensureFirebaseSignedIn(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase Auth belum dikonfigurasi.');
  }

  await auth.authStateReady();
  if (auth.currentUser) {
    return;
  }

  if (signInPromise) {
    return signInPromise;
  }

  const activeAuth = auth;
  signInPromise = (async () => {
    const email = import.meta.env.VITE_FIREBASE_AUTH_EMAIL?.trim();
    const password = import.meta.env.VITE_FIREBASE_AUTH_PASSWORD?.trim();

    if (email && password) {
      await signInWithEmailAndPassword(activeAuth, email, password);
    } else {
      await signInAnonymously(activeAuth);
    }
  })().finally(() => {
    signInPromise = null;
  });

  return signInPromise;
}
