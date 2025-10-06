// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
//new//
import { getAuth } from "firebase/auth";
//end new//

const firebaseConfig = {
  apiKey: "AIzaSyD4Lt9oRJfVVAcx--K1JiT5TFbiUbbK41A",
  authDomain: "commerc-ec055.firebaseapp.com",
  projectId: "commerc-ec055",
  storageBucket: "commerc-ec055.appspot.com",
  messagingSenderId: "3460706833",
  appId: "1:3460706833:web:b2b2d04839b0e352cfb7b0",
  measurementId: "G-E5PJBPHXDN"
};
 
const app = initializeApp(firebaseConfig); // ✅ أولاً تعريف app

const auth = getAuth(app);       // ✅ ثم auth

//const auth = getAuth(app);

//const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };


