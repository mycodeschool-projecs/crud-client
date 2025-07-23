import {useEffect} from "react";
import keycloak from "../../utile/keycloack";
import React from 'react';
 import { useKeycloak } from '@react-keycloak/web';
// import keycloack from "../../utile/keycloack";

export default function KeycloakLogin() {
    // Folosește useKeycloak() pentru a accesa instanța Keycloak și starea de inițializare/autentificare
    const { keycloak, initialized } = useKeycloak();

    useEffect(() => {
       // keycloak.init();
       //  const initKeycloak = async () => {
       //
       //          try {
       //              const authenticated = await keycloak.init({
       //                  onLoad: 'check-sso',
       //                  pkceMethod: 'S256',
       //                  checkLoginIframe: false,
       //              });
       //              alert("lkhlkhlkhlkh")
       //              console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
       //          } catch (error) {
       //              console.error('Failed to initialize adapter:', error);}
       //  };
       //
       //   initKeycloak();

    }, []);

    // Arată un mesaj de încărcare până când Keycloak este inițializat
    // if (!initialized) {
    //     return <p>Sistemul de autentificare se încarcă...</p>;
    // }

    const handleLogin = async () => {
         alert("In HandleInit")
        // // Verificăm dacă instanța keycloak există și nu suntem deja autentificați
        // if (keycloak && !keycloak.authenticated) {
        //     alert("In authentificare")
        //    let response=await keycloak.login(
        //         {
        //             email: "test",
        //             password: "@Test1234"
        //         }
        //
        //     );
        keycloak.login();
            // console.log(response)
        // }
    };

    const handleLogout = () => {
        // Verificăm dacă instanța keycloak există și suntem autentificați
        if (keycloak && keycloak.authenticated) {
            keycloak.logout();
        }
    };

    return (
        <div>
            {/*{keycloak.authenticated ? (*/}
            {/*    // Dacă utilizatorul este autentificat*/}
            {/*    <>*/}
            {/*        <p>Salut, **{keycloak.tokenParsed?.preferred_username || keycloak.tokenParsed?.name || 'Utilizator'}**!</p>*/}
            {/*        <button onClick={handleLogout}>Deconectare</button>*/}
            {/*    </>*/}
            {/*) : (*/}
            {/*    // Dacă utilizatorul nu este autentificat*/}
            {/*    <button onClick={handleLogin}>Autentificare cu Keycloak</button>*/}
            {/*)}*/}
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}
