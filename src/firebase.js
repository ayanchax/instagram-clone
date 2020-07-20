import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCxeBVxbJyqjdU0tSOk_hs9EIg-HbC3_BA",
    authDomain: "instagram-clone-react-ap-b47c5.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-ap-b47c5.firebaseio.com",
    projectId: "instagram-clone-react-ap-b47c5",
    storageBucket: "instagram-clone-react-ap-b47c5.appspot.com",
    messagingSenderId: "696232548638",
    appId: "1:696232548638:web:8ae50f3fb1177c8b89110f",
    measurementId: "G-H44XHYRL17",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export default { db, auth, storage };