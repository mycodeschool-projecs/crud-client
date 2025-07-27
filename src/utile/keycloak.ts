// @ts-ignore
import Keycloak, { KeycloakInstance } from "keycloak-js";

const config={
    url: "http://localhost:8080",
    realm: "kube-land",
    clientId: "kube-land-frontend"

}
const keycloakInstance = new Keycloak(config);



export default keycloakInstance;
