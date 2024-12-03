import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Placeholder while authentication state is loading
  }

  return user ? children : <Navigate to="/login" />;
};
