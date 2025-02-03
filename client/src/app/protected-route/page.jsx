import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('https://autoflow-nnn5.onrender.com/users/settings/my-account', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log('Authentication Response:',{
            status: response.status,
            ok: response.ok
        });

        if (response.ok) {
          const userData = await response.json();
          setAuthStatus({
            isAuthenticated: true,
            isLoading: false,
            user: userData[0],
            error: null
          });
        } else {
            const errorData = await response.json();
            console.error('Authentication failed:', errorData);

          setAuthStatus({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: errorData.message || 'Authentication Failed'
          });
        }
      } catch (error) {
        console.error('Authentication check failed', error);
        setAuthStatus({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: error.message
        });
      }
    };

    checkAuthentication();
  }, []);

  if (authStatus.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div role="status" className="flex flex-col items-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
          <span className="text-gray-600">Checking authentication...</span>
        </div>
      </div>
    );
  }

  if (!authStatus.isAuthenticated) {
    return <Navigate to="/users/login" replace />;
  }

  return <Outlet context={authStatus.user} />;
}

