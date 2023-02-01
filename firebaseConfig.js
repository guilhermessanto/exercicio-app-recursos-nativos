import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDH0QGeTUrve0MF_h47bWpziAYyUCOTM-Y",
  authDomain: "localizacao-9e104.firebaseapp.com",
  databaseURL: "https://localizacao-9e104-default-rtdb.firebaseio.com",
  projectId: "localizacao-9e104",
  storageBucket: "localizacao-9e104.appspot.com",
  messagingSenderId: "763837279698",
  appId: "1:763837279698:web:c73cb18227ec7587fd6c0b",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
