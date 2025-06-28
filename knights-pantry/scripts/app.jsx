// scripts/App.jsx
import React from "react"; 
import AuthFrontend from "./authfrontend";
import { auth } from "../backend/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Dashboard() {
  return (
    <div>
      <h2>✅ You’re logged in!</h2>
      <button onClick={() => auth.signOut()}>Log Out</button>
    </div>
  );
}

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {user ? <Dashboard /> : <AuthFrontend />}
    </div>
  );
}

export default App;
