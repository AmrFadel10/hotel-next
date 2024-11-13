import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBjD52Y-3U8FFev2RkCBrdZ6Ajy7htMagk",
  authDomain: "hotel-app-ff0a7.firebaseapp.com",
  projectId: "hotel-app-ff0a7",
  storageBucket: "hotel-app-ff0a7.firebasestorage.app",
  messagingSenderId: "327222193244",
  appId: "1:327222193244:web:ea9e25f28269e320e0ca99",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
