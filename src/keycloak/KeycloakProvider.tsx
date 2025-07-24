import React, { useEffect, ReactNode, useRef } from 'react';
import { Spin, message } from 'antd';
import keycloak from './keycloak';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  initializeKeycloak, 
  refreshToken, 
  login as loginAction, 
  logout as logoutAction,
  selectIsLoading,
  validateToken
} from '../store/slices/authSlice';

// Global flag to track Keycloak initialization across all instances
let keycloakInitialized = false;

interface KeycloakProviderProps {
  children: ReactNode;
}

const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const initAttemptedRef = useRef(false);

  useEffect(() => {
    const initKeycloak = async () => {
      // Skip initialization if already initialized globally or if this component already attempted initialization
      if (keycloakInitialized || initAttemptedRef.current) {
        return;
      }

      // Mark that this component has attempted initialization
      initAttemptedRef.current = true;

      // Mark as initialized before the actual init call to prevent concurrent init attempts
      keycloakInitialized = true;

      try {
        await dispatch(initializeKeycloak()).unwrap();
        // After initialization, validate the token to update the state
        dispatch(validateToken());
      } catch (error) {
        console.error('Failed to initialize Keycloak:', error);
        message.error('Failed to initialize authentication service.');
        // Reset the flag if initialization fails
        keycloakInitialized = false;
      }
    };

    initKeycloak();

    // No need for cleanup function as we're using a global flag
  }, [dispatch]);

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

// Helper functions to use throughout the app - now using Redux
export const login = () => {
  const store = require('../store/store').store;
  store.dispatch(loginAction());
};

export const logout = () => {
  const store = require('../store/store').store;
  store.dispatch(logoutAction());
};

export const getToken = () => keycloak.token;

export const isAuthenticated = () => keycloak.authenticated;

// New helper function to refresh token using Redux
export const refreshTokenHelper = async () => {
  const store = require('../store/store').store;
  try {
    await store.dispatch(refreshToken()).unwrap();
    return true;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return false;
  }
};
