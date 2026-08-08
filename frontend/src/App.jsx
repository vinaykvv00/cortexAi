import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";

function App() {
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result.user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <button className="w-52 h-24 bg-white" onClick={googleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}

export default App;
