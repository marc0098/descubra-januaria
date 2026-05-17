import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDL2iEqf1XzjwCzqVgWzDR4i23Z973WSAI",
  authDomain: "atheris-delivery.firebaseapp.com",
  projectId: "atheris-delivery",
  storageBucket: "atheris-delivery.firebasestorage.app",
  messagingSenderId: "1061125891534",
  appId: "1:1061125891534:web:9e2209098148b34230b79f",
  measurementId: "G-Z0N13R7P0L"
};

// Verifica se o Firebase já foi inicializado para evitar erros
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.warn('Firebase app já inicializado, reutilizando instância existente');
  app = initializeApp(firebaseConfig);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
