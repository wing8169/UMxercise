import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: "AIzaSyCOVopAhh5hHobMrolA3Fg0OfRoDy3zP1I",
  authDomain: "umxercise.firebaseapp.com",
  databaseURL: "https://umxercise.firebaseio.com",
  projectId: "umxercise",
  storageBucket: "umxercise.appspot.com",
  messagingSenderId: "925621739598"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const db = firebase.database();

export { db, auth };
