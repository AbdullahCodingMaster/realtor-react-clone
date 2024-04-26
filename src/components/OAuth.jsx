import { FcGoogle } from "react-icons/fc";
import React from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function OAuth() {
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // check user exists
      const docRef = doc(db, "users", user.uid);

      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      toast.error("Could not Authorize with Google.");
    }
  };
  return (
    <button
      typeof="button"
      onClick={handleClick}
      className="flex items-center justify-center w-full bg-red-600 text-white mb-6 px-7 py-3 text-sm font-medium rounded uppercase shadow-md hover:bg-red-700 transition duration-200 ease-in-out active:bg-red-800 hover:shadow-lg"
      type="submit"
    >
      <FcGoogle className="text-2xl bg-white rounded-full mr-2" />
      continue with google
    </button>
  );
}
