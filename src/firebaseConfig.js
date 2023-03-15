// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfZMb5LZw8FjGr1p7bm7iyezJf9RjAnkE",
  authDomain: "vue-3-2023-371a6.firebaseapp.com",
  projectId: "vue-3-2023-371a6",
  storageBucket: "vue-3-2023-371a6.appspot.com",
  messagingSenderId: "224092524404",
  appId: "1:224092524404:web:1e2bbc8c025f32ba332621"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();

export { auth };