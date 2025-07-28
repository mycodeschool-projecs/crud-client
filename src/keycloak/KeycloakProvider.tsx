import React, { useEffect, ReactNode, useRef } from 'react';
import { Spin, message } from 'antd';
import { useAuth } from '../context/AuthContext';

interface KeycloakProviderProps {
  children: ReactNode;
}

const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
  const { isLoading, initializeKeycloak, validateToken } = useAuth();
  const initAttemptedRef = useRef(false);

  useEffect(() => {
    const initKeycloak = async () => {
      // Skip initialization if this component already attempted initialization
      if (initAttemptedRef.current) {
        return;
      }

      // Mark that this component has attempted initialization
      initAttemptedRef.current = true;

      try {
        await initializeKeycloak();
        // After initialization, validate the token to update the state
        validateToken();
      } catch (error) {
        console.error('Failed to initialize Keycloak:', error);
        message.error('Failed to initialize authentication service.');
      }
    };

    initKeycloak();

    // No need for cleanup function
  }, [initializeKeycloak, validateToken]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="Loading authentication...">
          <div className="content" style={{ padding: '50px', background: 'rgba(0, 0, 0, 0.05)', borderRadius: '4px' }} />
        </Spin>
      </div>
    );
  }

  return <>{children}</>;
};

export default KeycloakProvider;

// Helper functions are now exported from AuthContext
export { login, logout, getToken, isAuthenticated, refreshToken as refreshTokenHelper } from '../context/AuthContext';
