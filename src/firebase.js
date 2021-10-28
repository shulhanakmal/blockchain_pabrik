import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: "AIzaSyDvN287Y5wKy-_6JwiaSP4DsLRR6sPueQc",
  authDomain: "blockchain-project-3d8f4.firebaseapp.com",
  databaseURL:
    "https://blockchain-project-3d8f4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "blockchain-project-3d8f4",
  storageBucket: "blockchain-project-3d8f4.appspot.com",
  messagingSenderId: "978717605948",
  appId: "1:978717605948:web:60fbffdff906b09cf70339",
  measurementId: "G-NVDMLWS1BN",
};
// Initialize Firebase
firebase.initializeApp(config);

export default firebase;
