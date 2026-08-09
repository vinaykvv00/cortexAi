import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import api from "../utils/axios.js";

function App() {
  const handleLogin = async (token) => {
    try {
      const { data } = await api.post("/auth/login", { token });
      console.log("User data:", data);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      await handleLogin(token);

      console.log(token);
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
