import HttpResponse from "./model/HttpResponse";
import {Client} from "./model/Client";
import {LoginUser, User} from "./model/User";
import {loadConfig} from "./utile/utile";
import {Notification} from "./model/Notification";

export default class Api {

   async api<T, U>(path: string, method = "GET", body: U, token:string|null): Promise<HttpResponse<T>> {
        try {
            // Get base URL with error handling
            let basepath = await this.getBaseURL();
            if (!basepath) {
                console.log("++ Nu aveam basepath");
                basepath = "http://localhost:8082"; // fallback if config fails
            }

            const url = basepath + path;
            console.log("Request URL:", url);

            const options: RequestInit = {
                method,
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                body: body == null ? null : JSON.stringify(body)
            };

            if (token !== null) {
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${token}`
                };
            }

            // Make the fetch request with error handling
            const response = await fetch(url, options);

            // Log response status for debugging
            console.log(`Response status for ${url}: ${response.status}`);

            return response;
        } catch (error) {
            console.error("API request failed:", error);
            // Create a mock response object with error information
            const errorResponse = new Response(JSON.stringify({ message: "Network error occurred" }), {
                status: 500,
                statusText: "Network Error"
            });
            return errorResponse as HttpResponse<T>;
        }
    }

    addNewClient=async (client:Client):Promise<Client>=>{
        let tk=localStorage.getItem("tkn");
        console.log(tk);
        console.log("------api add---");
        let response= await this.api(`/api/v1/addclient`,'POST',client,tk);
        console.log("status="+response.status);
        if(response.status===200){
            console.log("KORECT")

            return response.json();
        }else{
            console.log("Eroare in Promise la addclient")
            return Promise.reject("Nu a mers adaugarea");
        }
    }

    updClient=async (client:Client):Promise<Client>=>{
        let tk=localStorage.getItem("tkn");
        console.log(tk);
        console.log("------api add---");
        let response= await this.api(`/api/v1/updclient`,'POST',client,tk);
        if(response.status===200){
            console.log("KORECT")
            return response.json();
        }else{
            console.log("Eroare in Promise la update")
            return Promise.reject(response.message);
        }
    }

    findClient=async (eml:string):Promise<Client>=>{
        let tk=localStorage.getItem("tkn");
        console.log(tk);
        console.log("------api add---");
        let response= await this.api(`/api/v1/findclient/${eml}`,'GET',null,tk);
        console.log("Raspuns din api find client");
        console.log(response);
        console.log("------------------------------------------------");

        if(response.status===200){
            return response.json() as Promise<Client>;
        }else{
            return Promise.reject(response.message);
        }
    }

    getBaseURL=async () =>{
        try {
            let response = await loadConfig();
            return response.BASE_URL;
        } catch (e) {
            console.error("Error loading config:", e);
            return "http://localhost:8082"; // Return a default value instead of rejecting
        }
    }
    delClient=async (client:string):Promise<Client>=>{
        let tk=localStorage.getItem("tkn");
        console.log(tk);
        console.log("------api add---");
        let response= await this.api(`/api/v1/delclient/${client}`,'DELETE',null,tk);
        if(response.status===200){
            return response.json();
        }else{
            return Promise.reject([]);
        }
    }


    getAllClients=async ():Promise<Client[]>=>{
        let tk=localStorage.getItem("tkn");

        let response=await this.api('/api/v1/clients','GET',null,tk);
        console.log(response);
        console.log("-------------------get all")
        if(response.status===200){
            return response.json();
        }else{
            return Promise.reject("Coud not get list of Clients!!")
        }
    }


    register=async (user:User):Promise<User>=>{
        console.log("In Api");
        console.log(user);

            let response=await this.api('/api/v1/auth/signup','POST',user,null);
            if(response.status===200){
                return response.json();
            }else {
                return Promise.reject("Nu am putut adauga")
            }

    }

    login=async (user:LoginUser)=>{
        console.log("In Api");
        console.log(user);

        let response=await this.api('/api/v1/auth/signin','POST',user,null);
        console.log("Raspuns");
        console.log(response);
        if(response.status===200){
              return response.json();
        }
        return Promise.reject("Nashpa")
        // if(response.){
        //
        //     return response.data;
        // }else {
        //     return Promise.reject("User eronat sau parola gresita!!!")
        // }

    }

    // Notification API methods
    getAllNotifications = async (): Promise<Notification[]> => {
        let tk = localStorage.getItem("tkn");

        let response = await this.api('/api/v1/notifications', 'GET', null, tk);
        console.log("Response from getAllNotifications:", response);

        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject("Could not get notifications");
        }
    }

    getNotificationsByReadStatus = async (read: boolean): Promise<Notification[]> => {
        try {
            let tk = localStorage.getItem("tkn");

            let response = await this.api(`/api/v1/notifications/status/${read}`, 'GET', null, tk);
            console.log("Response from getNotificationsByReadStatus:", response);

            if (response.status === 200) {
                return response.json();
            } else {
                console.error(`Error fetching notifications by read status: ${response.status}`);
                // Return empty array instead of rejecting to prevent app crashes
                return [];
            }
        } catch (error) {
            console.error("Exception in getNotificationsByReadStatus:", error);
            // Return empty array on exception
            return [];
        }
    }

    markNotificationAsRead = async (id: number): Promise<Notification> => {
        let tk = localStorage.getItem("tkn");

        let response = await this.api(`/api/v1/notifications/${id}/mark-read`, 'PUT', null, tk);
        console.log("Response from markNotificationAsRead:", response);

        if (response.status === 200) {
            console.log("Notification marked as read");
            return response.json();
        } else {
            return Promise.reject("Could not mark notification as read");
        }
    }

    markAllNotificationsAsRead = async (): Promise<void> => {
        let tk = localStorage.getItem("tkn");

        let response = await this.api('/api/v1/notifications/mark-all-read', 'PUT', null, tk);
        console.log("Response from markAllNotificationsAsRead:", response);

        if (response.status === 200) {
            console.log("All notifications marked as read");
            return;
        } else {
            return Promise.reject("Could not mark all notifications as read");
        }
    }

}
