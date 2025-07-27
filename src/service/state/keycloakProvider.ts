import React, { createContext, useContext, useEffect, useState,PropsWithChildren } from "react";
import keycloak from "../../utile/keycloak";

type AuthCtx = { keycloak: typeof keycloak; init: boolean; auth: boolean };
const AuthContext = createContext<AuthCtx>({ keycloak, init: false, auth: false });
export const useAuth = () => useContext(AuthContext);


// export const KCProvider: React.FC<PropsWithChildren> = ({ children }) => {
//     const [init, setInit] = useState(false);
//     const [auth, setAuth] = useState(false);
//
//     useEffect(() => {
//         let intervalId: number | undefined;
//
//         (async () => {
//             const authenticated = await keycloak.init({
//                 onLoad: "login-required",
//                 pkceMethod: "S256",
//             });
//
//             setAuth(authenticated);
//             setInit(true);
//
//             intervalId = window.setInterval(() => {
//                 keycloak.updateToken(30).catch(() => keycloak.logout());
//             }, 10_000);
//         })();
//
//         return () => {
//             if (intervalId) clearInterval(intervalId);
//         };
//     }, []);
//
//     return (
//         <AuthContext.Provider value={{ keycloak, init, auth }}>
//     {children}
//     </AuthContext.Provider>
// );
// };