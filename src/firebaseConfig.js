import { initializeApp, getApps } from "firebase/app"; // Tambahkan getApps
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "ISI_API_KEY_ANDA",
  authDomain: "sipka-djkn-sumut.firebaseapp.com",
  projectId: "sipka-djkn-sumut",
  storageBucket: "sipka-djkn-sumut.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcd1234efgh"
};

// Cek apakah sudah ada koneksi, jika belum maka buat baru
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;