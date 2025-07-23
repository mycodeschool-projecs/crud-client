// src/components/PrivateRoute.tsx (MODIFICAT PENTRU REDIRECȚIONARE LA FORMULARUL TĂU)
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

const PrivateRoute: React.FC = () => {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
        return <div>Verific autentificarea...</div>;
    }

    if (!keycloak.authenticated) {
        // Redirecționează la ruta formularului tău de login personalizat
        return <Navigate to="/custom-login" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;