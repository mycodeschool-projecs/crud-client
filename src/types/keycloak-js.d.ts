declare module 'keycloak-js' {
  interface KeycloakConfig {
    url?: string;
    realm: string;
    clientId: string;
  }

  interface KeycloakInitOptions {
    onLoad?: 'login-required' | 'check-sso';
    silentCheckSsoRedirectUri?: string;
    pkceMethod?: 'S256';
    checkLoginIframe?: boolean;
    checkLoginIframeInterval?: number;
    responseMode?: 'query' | 'fragment';
    flow?: 'standard' | 'implicit' | 'hybrid';
  }

  class Keycloak {
    authenticated?: boolean;
    token?: string;
    refreshToken?: string;
    idToken?: string;
    tokenParsed?: {
      exp?: number;
      [key: string]: any;
    };

    constructor(config: KeycloakConfig);

    init(options?: KeycloakInitOptions): Promise<boolean>;
    login(options?: any): void;
    logout(options?: any): void;
    updateToken(minValidity: number): Promise<boolean>;
    isTokenExpired(minValidity?: number): boolean;

    onTokenExpired: () => void;
  }

  export default Keycloak;
}
