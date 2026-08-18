import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "contact-form-199b4.firebaseapp.com",
  projectId: "contact-form-199b4",
  storageBucket: "contact-form-199b4.appspot.com",
  messagingSenderId: "759279885477",
  appId: "1:759279885477:web:6648328d9e3f7fda08814c",
};

const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null;
const database = app ? getDatabase(app) : null;

export default database ? ref(database, "contacts") : null;
