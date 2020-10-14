// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDlAARr1JyTYSYuXgCN7NgMFv47INWmsvY",
    authDomain: "schefs.firebaseapp.com",
    databaseURL: "https://schefs.firebaseio.com",
    projectId: "schefs",
    messagingSenderId: "1078198186854",
    appId: "1:1078198186854:web:4928cdbed5f459a68fcea7",
    measurementId: "G-SFQEPY2PRN",
    storageBucket: "schefs.appspot.com"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
try {
    firebase.analytics();
    } catch (error) {
    console.error(error);
  }
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();