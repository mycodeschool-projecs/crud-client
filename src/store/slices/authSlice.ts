import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import keycloak from '../../keycloak/keycloak';

// Define the authentication state interface
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  tokenExpiration: Date | null;
  securityStatus: 'none' | 'authenticated' | 'expired' | 'invalid';
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  token: localStorage.getItem('tkn'),
  tokenExpiration: null,
  securityStatus: 'none',
  error: null,
};

// Async thunks for authentication actions
export const initializeKeycloak = createAsyncThunk(
  'auth/initializeKeycloak',
  async (_, { rejectWithValue }) => {
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
              }
            })
            .catch(() => {
              console.error('Session expired. Please login again.');
              keycloak.logout();
            });
        };

        // Calculate token expiration time
        let tokenExpiration = null;
        if (keycloak.tokenParsed && keycloak.tokenParsed.exp) {
          tokenExpiration = new Date(keycloak.tokenParsed.exp * 1000);
        }

        return {
          authenticated,
          token: keycloak.token,
          tokenExpiration,
        };
      }

      return { authenticated, token: null, tokenExpiration: null };
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error);
      return rejectWithValue('Failed to initialize authentication service.');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshed = await keycloak.updateToken(30);
      if (refreshed) {
        localStorage.setItem('tkn', keycloak.token || '');

        // Calculate token expiration time
        let tokenExpiration = null;
        if (keycloak.tokenParsed && keycloak.tokenParsed.exp) {
          tokenExpiration = new Date(keycloak.tokenParsed.exp * 1000);
        }

        return {
          token: keycloak.token,
          tokenExpiration,
        };
      }

      return { token: keycloak.token, tokenExpiration: null };
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return rejectWithValue('Failed to refresh token. Please authenticate again.');
    }
  }
);

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.isLoading = true;
      keycloak.login({
        redirectUri: window.location.origin
      });
    },
    logout: (state) => {
      localStorage.removeItem('tkn');
      keycloak.logout();
      state.isAuthenticated = false;
      state.token = null;
      state.tokenExpiration = null;
      state.securityStatus = 'none';
    },
    validateToken: (state) => {
      if (!keycloak.authenticated) {
        state.isAuthenticated = false;
        state.token = null;
        state.tokenExpiration = null;
        state.securityStatus = 'none';
        return;
      }

      if (!keycloak.token) {
        state.isAuthenticated = false;
        state.token = null;
        state.tokenExpiration = null;
        state.securityStatus = 'invalid';
        return;
      }

      try {
        if (keycloak.isTokenExpired()) {
          state.isAuthenticated = false;
          state.token = null;
          state.tokenExpiration = null;
          state.securityStatus = 'expired';
          return;
        }

        // Calculate token expiration time
        if (keycloak.tokenParsed && keycloak.tokenParsed.exp) {
          state.tokenExpiration = new Date(keycloak.tokenParsed.exp * 1000);
        }

        state.isAuthenticated = true;
        state.token = keycloak.token;
        state.securityStatus = 'authenticated';
      } catch (error) {
        console.error('Token validation error:', error);
        state.isAuthenticated = false;
        state.token = null;
        state.tokenExpiration = null;
        state.securityStatus = 'invalid';
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle initializeKeycloak
      .addCase(initializeKeycloak.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeKeycloak.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.authenticated;
        state.token = action.payload.token ?? null;
        state.tokenExpiration = action.payload.tokenExpiration;
        state.securityStatus = action.payload.authenticated ? 'authenticated' : 'none';
      })
      .addCase(initializeKeycloak.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.securityStatus = 'invalid';
      })
      // Handle refreshToken
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token ?? null;
        state.tokenExpiration = action.payload.tokenExpiration;
        state.securityStatus = 'authenticated';
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.securityStatus = 'expired';
      });
  },
});

// Export actions and reducer
export const { login, logout, validateToken, setError } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectSecurityStatus = (state: { auth: AuthState }) => state.auth.securityStatus;
export const selectTokenExpiration = (state: { auth: AuthState }) => state.auth.tokenExpiration;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
