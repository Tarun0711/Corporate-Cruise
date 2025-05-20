import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

export function OpenRoute({ children }) {
  const { token, user } = useSelector((state) => state.auth);

  if (token === null) {
    return children
  } else {
    return <Navigate to={`/dashboard/${user.userId}`}/>
  }
}

export const PrivateRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);

  if (token === null) {
    return <Navigate to="/signin" />
  } else {
    return children
  }
}
