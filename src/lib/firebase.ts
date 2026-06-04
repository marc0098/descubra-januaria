import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Verifica se o Firebase já foi inicializado para evitar erros
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.warn('Firebase app já inicializado, reutilizando instância existente');
  app = initializeApp(firebaseConfig); // Isso pode falhar no catch, mas o fallback padrão da V1
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Inicializa o App Check apenas no ambiente de produção para evitar atrasos no localhost
export let appCheck: any;
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.NODE_ENV !== 'development') {
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  });
}
