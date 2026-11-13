import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  Auth,
} from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim(),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim(),
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL?.trim(),
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim(),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim(),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim(),
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim(),
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
