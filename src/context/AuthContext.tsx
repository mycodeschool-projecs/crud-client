import React, { createContext, useContext, useState, ReactNode } from 'react';
import keycloak from '../keycloak/keycloak';

// Define the authentication state interface
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  tokenExpiration: Date | null;
  securityStatus: 'none' | 'authenticated' | 'expired' | 'invalid';
  error: string | null;
}

// Define the context interface
interface AuthContextType extends AuthState {
  initializeKeycloak: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  login: () => void;
  logout: () => void;
  validateToken: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  token: localStorage.getItem('tkn'),
  tokenExpiration: null,
  securityStatus: 'none',
  error: null,
};

// Global flag to track Keycloak initialization across all instances
let keycloakInitialized = false;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Initialize Keycloak
  const initializeKeycloak = async (): Promise<void> => {
    // Skip if already initialized
    if (keycloakInitialized) {
      return;
    }

    // Mark as initialized before the actual init call to prevent concurrent init attempts
    keycloakInitialized = true;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const authenticated = await keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
      });

      if (authenticated) {
        localStorage.setItem('tkn', keycloak.token || '');

        // Set up token refresh
        keycloak.onTokenExpired = () => {
          keycloak.updateToken(30)
            .then((refreshed: boolean) => {
              if (refreshed) {
                localStorage.setItem('tkn', keycloak.token || '');

                // Calculate token expiration time
                let tokenExpiration: Date | null = null;
                if (keycloak.tokenParsed && keycloak.tokenParsed.exp) {
                  tokenExpiration = new Date(keycloak.tokenParsed.exp * 1000);
                }

                setState(prev => ({
                  ...prev,
                  token: keycloak.token || null,
                  tokenExpiration,
                  securityStatus: 'authenticated',
                  isAuthenticated: true
                }));
              }
            })
            .catch(() => {
              console.error('Session expired. Please login again.');
              keycloak.logout();
            });
        };

        // Calculate token expiration time
        let tokenExpiration: Date | null = null;
        if (keycloak.tokenParsed && keycloak.tokenParsed.exp) {
          tokenExpiration = new Date(keycloak.tokenParsed.exp * 1000);
        }

        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: authenticated,
          token: keycloak.token || null,
          tokenExpiration,
          securityStatus: authenticated ? 'authenticated' : 'none'
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
          token: null,
          tokenExpiration: null,
          securityStatus: 'none'
        }));
      }
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to initialize authentication service.',
        securityStatus: 'invalid'
      }));
      // Reset the flag if initialization fails
      keycloakInitialized = false;
    }
  };

  // Refresh token
  const refreshToken = async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const refreshed = await keycloak.updateToken(30);
      if (refreshed) {
        localStorage.setItem('tkn', keycloak.token || '');

        // Calculate token expiration time
        let tokenExpiration: Date | null = null;
        if (keycloak.tokenParsed && keycloak.tokenParsed.exp) {
          tokenExpiration = new Date(keycloak.tokenParsed.exp * 1000);
        }

        setState(prev => ({
          ...prev,
          isLoading: false,
          token: keycloak.token || null,
          tokenExpiration,
          securityStatus: 'authenticated',
          isAuthenticated: true
        }));

        return true;
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to refresh token. Please authenticate again.',
        securityStatus: 'expired'
      }));
      return false;
    }
  };

  // Login
  const login = () => {
    setState(prev => ({ ...prev, isLoading: true }));
    keycloak.login({
      redirectUri: window.location.origin
    });
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('tkn');
    keycloak.logout();
    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      token: null,
      tokenExpiration: null,
      securityStatus: 'none'
    }));
  };

  // Validate token
  const validateToken = () => {
    if (!keycloak.authenticated) {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        token: null,
        tokenExpiration: null,
        securityStatus: 'none'
      }));
      return;
    }

    if (!keycloak.token) {
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        token: null,
        tokenExpiration: null,
        securityStatus: 'invalid'
      }));
      return;
    }

    try {
      if (keycloak.isTokenExpired()) {
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          token: null,
          tokenExpiration: null,
          securityStatus: 'expired'
        }));
        return;
      }

      // Calculate token expiration time
      let tokenExpiration: Date | null = null;
      if (keycloak.tokenParsed && keycloak.tokenParsed.exp) {
        tokenExpiration = new Date(keycloak.tokenParsed.exp * 1000);
      }

      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        token: keycloak.token || null,
        tokenExpiration,
        securityStatus: 'authenticated'
      }));
    } catch (error) {
      console.error('Token validation error:', error);
      setState(prev => ({
        ...prev,
        isAuthenticated: false,
        token: null,
        tokenExpiration: null,
        securityStatus: 'invalid'
      }));
    }
  };

  // Provide the context value
  const contextValue: AuthContextType = {
    ...state,
    initializeKeycloak,
    refreshToken,
    login,
    logout,
    validateToken
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper functions to use throughout the app
export const getToken = () => keycloak.token;
export const isAuthenticated = () => keycloak.authenticated;

// Direct implementation without using hooks
export const login = () => {
  keycloak.login({
    redirectUri: window.location.origin
  });
};

export const logout = () => {
  localStorage.removeItem('tkn');
  keycloak.logout();
};

export const refreshToken = async (): Promise<boolean> => {
  try {
    return await keycloak.updateToken(30);
  } catch (error) {
    console.error('Failed to refresh token:', error);
    return false;
  }
};
