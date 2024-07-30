import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "krafchat.firebaseapp.com",
  projectId: "krafchat",
  storageBucket: "krafchat.appspot.com",
  messagingSenderId: "104383606034",
  appId: "1:104383606034:web:03b3dad774df7351f297cb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();