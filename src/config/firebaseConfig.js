import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyDnKQmj-f_pXrhaiBG2aIqKlrehUpAAEJA",
    authDomain: "cse316-mockups-project.firebaseapp.com",
    databaseURL: "https://cse316-mockups-project.firebaseio.com",
    projectId: "cse316-mockups-project",
    storageBucket: "cse316-mockups-project.appspot.com",
    messagingSenderId: "824227346946",
    appId: "1:824227346946:web:c04136b50fa095a2b5c51b",
    measurementId: "G-WT5KV0TY0G"

};
firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;