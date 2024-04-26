// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnsosJsqZ_w4P7Cskjq5G6GIp4tVXSrT4",
  authDomain: "realtor-clone-react-pro.firebaseapp.com",
  projectId: "realtor-clone-react-pro",
  storageBucket: "realtor-clone-react-pro.appspot.com",
  messagingSenderId: "547846863022",
  appId: "1:547846863022:web:47d8e9f9ef4f406485553f",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
