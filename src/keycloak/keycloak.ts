import Keycloak from 'keycloak-js';


const keycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'kube-land',
  clientId: 'kube-land-frontend',
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;