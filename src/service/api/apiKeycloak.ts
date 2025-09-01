import HttpResponse from "../../model/HttpResponse";
import {loadConfig} from "../../utile/utile";
import {LoginUser} from "../../model/User";
import {AppConfig} from "../../model/AppConfig";

const KEYCLOAK_URL = 'http://localhost:8080';
const REALM = 'kube-land';
const CLIENT_ID = 'kube-land-frontend';



interface loginResponse{
    access_token: string;
}
export default class ApiKeycloak{


    async apiKeycloak<T, U>(path: string, method = "GET", body: U, token:string|null): Promise<HttpResponse<T>> {
        try {


            // const clientSecret = process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET;
            const clientSecret = window._env_?.KEYCLOAK_CLIENT_SECRET;
            // const clientSecret=window._env_?
            // const url = ;
            // console.log("Request URL:", url);
            console.log(clientSecret);
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            let userLogin=body as LoginUser;
            let conf:AppConfig=await this.getKCL();
            console.log(conf);
            const basePath="http://localhost:8080";
            let securityPath = conf.KEYCLOAK_URL;
            let kclSecret=conf.KEYCLOAK_CLIENT_SECRET;
            if (!securityPath) {
                console.log("++ Nu aveam securityPath");
                securityPath= "http://localhost:8080"; // fallback if config fails
            }


            const url=securityPath+path;
            console.log("URL este "+url);
            const options: RequestInit = {
                method,
                mode: 'cors',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    grant_type: 'password',
                    client_id: 'kube-land-frontend',
                    code: code!,
                    redirect_uri: window.location.origin,
                    client_secret: kclSecret?kclSecret:'',
                    username: userLogin.email,
                    password: userLogin.password

                })
            };

            console.log()
            const response = await fetch(url, options);

            // Log response status for debugging
            // console.log(`Response status for ${url}: ${response.status}`);

            return response;
        } catch (error) {
            console.error("APIKeycloak request failed:", error);
            // Create a mock response object with error information
            const errorResponse = new Response(JSON.stringify({ message: "Network error occurred" }), {
                status: 500,
                statusText: "Network Error"
            });
            return errorResponse as HttpResponse<T>;
        }
    }


    getKCL=async () =>{
        try {
            let response = await loadConfig();
            return response;
        } catch (e) {
            console.error("Error loading config:", e);
            let cfg:AppConfig={
                BASE_URL: "http://localhost:3000",
                KEYCLOAK_URL:"http://localhost:8080",
                KEYCLOAK_CLIENT_SECRET:""
            }
            return cfg;
            // return "http://localhost:7500"; // Return a default value instead of rejecting
        }
    }

    loginKeycloak=async (user:LoginUser): Promise<loginResponse> => {
        try {
            const response: HttpResponse<any> = await this.apiKeycloak(
                "/realms/kube-land/protocol/openid-connect/token",
                "POST",
                user,
                null
            );

            // 👇 verifici statusul
            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.error_description || 'Eroare de autentificare');
            }

            return response.json(); // totul e ok
        } catch (e: any) {
            console.error('Eroare la login:', e);
            throw e; // 👈 aruncă eroarea mai departe către componentă
        }
    }

}