/**
 * Firebase Configuration & Initialization
 */

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyBA_cEX_pHmlUZ4xv10GIOLVOv9g_-iolQ",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "total-lakay.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "total-lakay",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "total-lakay.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "37969355540",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:37969355540:web:514e3869a9422e3681d801",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HC09M5HTVZ"
};

let auth, db, storage;

function initializeFirebase() {
  try {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
    
    console.log('✅ Firebase initialized successfully');
    return { auth, db, storage };
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
}

function getFirebaseServices() {
  if (!auth || !db || !storage) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return { auth, db, storage };
}

export {
  firebaseConfig,
  initializeFirebase,
  getFirebaseServices
};
