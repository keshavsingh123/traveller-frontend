import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
    const [checking, setChecking] = useState(true);

  useEffect(() => {
    setChecking(false);
  }, []);

  if (checking) return null;

  return user ? children : <Navigate to="/login" />;
}