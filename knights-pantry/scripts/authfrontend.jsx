// AuthForm.jsx
import { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Account created!");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("✅ Logged in!");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div>
      <h2>Sign In / Sign Up</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
      <button onClick={signup}>Sign Up</button>
    </div>
  );
}
