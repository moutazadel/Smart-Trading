
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkFRPDLr6b4WssYHA2aXmGHWuGksCqNHQ",
  authDomain: "smart-walet-79121.firebaseapp.com",
  projectId: "smart-walet-79121",
  storageBucket: "smart-walet-79121.appspot.com",
  messagingSenderId: "521689085845",
  appId: "1:521689085845:web:4d8996aaa58e4b9571e89c",
  measurementId: "G-5MENXSHM3M"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

export { app, auth, db };
