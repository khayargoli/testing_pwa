import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, redirectTo, allowedAuth }) => {
  const isSignedIn = useSelector((state) => state.user.userDetails);

  if (allowedAuth) {
    return isSignedIn ? children : <Navigate to={redirectTo} />;
  } else {
    return !isSignedIn ? children : <Navigate to={redirectTo} />;
  }
};

export default ProtectedRoute;
