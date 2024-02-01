// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { create } from "zustand";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEB-IrcdhPI3hVWojHy4O-ii7_mjXW53w",
  authDomain: "klass-af0a0.firebaseapp.com",
  projectId: "klass-af0a0",
  storageBucket: "klass-af0a0.appspot.com",
  messagingSenderId: "573411923549",
  appId: "1:573411923549:web:8b0ea1e6c48c432086dfb4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function logIn() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

export async function logOut() {
  return await signOut(auth)
}

export const useUser = create<{ user: null|User, setUser: (user: null|User) => void}>((set) => ({
  user: undefined,
  setUser: (user: null|User) => set({ user }),
}))

onAuthStateChanged(auth, async (user) => {
  if (typeof window !== 'undefined') {
    fetch('/api/auth', { method: 'POST', body: JSON.stringify({ token: await user?.getIdToken() }) })
    useUser.getState().setUser(user)
  }
});