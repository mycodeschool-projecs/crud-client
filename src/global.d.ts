// src/global.d.ts
export {};

declare global {
    interface Window {
        _env_?: {
            REACT_APP_KEYCLOAK_CLIENT_SECRET?: string;
            [key: string]: string | undefined;
        };
    }
}
