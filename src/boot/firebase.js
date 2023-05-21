// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, update, onValue } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyAewwD0tTH-0KedDZ4TiB1A_bmnT7kvC3U",
  authDomain: "workhoursmanager.firebaseapp.com",
  projectId: "workhoursmanager",
  storageBucket: "workhoursmanager.appspot.com",
  messagingSenderId: "171359745813",
  appId: "1:171359745813:web:22e16fc4580becb935db1c",
  measurementId: "G-66C59Y8VVB"
};
const firebaseApp = initializeApp(firebaseConfig);
let Auth = getAuth(firebaseApp);
let Db = getDatabase(firebaseApp);
const dbRef = ref;
// let Funt = firebaseApp.functions();
// let Storage = firebaseApp.storage();
// let FireTime = firebase.database.ServerValue.TIMESTAMP;

export { Auth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, Db, dbRef, set, update, onValue };
