import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFX9xdFACnQ-bIzsA12ytmfNuJ6k-cmZY",
  authDomain: "market-place-info-3173.firebaseapp.com",
  projectId: "market-place-info-3173",
  storageBucket: "market-place-info-3173.firebasestorage.app",
  messagingSenderId: "716022953190",
  appId: "1:716022953190:web:cfb5d53dd2963e20bbf727",
};

// Check if Firebase is already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth only once
let auth;
if (!getApps().length) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

// Sign-out function
const signOutUser = async () => {
  try {
    await auth.signOut();
    console.log("User signed out successfully!");
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
};

export {
  auth,
  db,
  storage,
  signOutUser,
  addDoc,
  collection,
  ref,
  uploadBytes,
  getDownloadURL,
};
