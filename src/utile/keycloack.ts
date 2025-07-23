import Keycloak from 'keycloak-js';


const keycloackConfig ={

    url: "http://localhost:8080",
    realm: "kube-land",
    clientId: "kube-land-frontend",
    clientSecret: "your-client-secret-here",

}

const keycloak= new Keycloak(keycloackConfig);



export default keycloak;
