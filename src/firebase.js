import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDv4DVf-uxzFs5VUItuJ9UTFJpb05aQuSg",
  authDomain: "cyberguard-98a09.firebaseapp.com",
  projectId: "cyberguard-98a09",
  storageBucket: "cyberguard-98a09.firebasestorage.app",
  messagingSenderId: "183760143601",
  appId: "1:183760143601:web:02053aa8e7b9b3b096d550"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);