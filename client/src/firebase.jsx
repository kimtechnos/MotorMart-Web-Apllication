import firebase from "firebase/app";
import "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPcLSI4_RUTMjkVHo0gHUcgd3cj0ChreI",
  authDomain: "contact-form-199b4.firebaseapp.com",
  projectId: "contact-form-199b4",
  storageBucket: "contact-form-199b4.appspot.com",
  messagingSenderId: "759279885477",
  appId: "1:759279885477:web:6648328d9e3f7fda08814c",
};

const fireDb = firebase.initializeApp(firebaseConfig);
export default fireDb.database.ref();
