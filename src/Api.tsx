import HttpResponse from "./model/HttpResponse";
import {Client} from "./model/Client";
import {LoginUser, User} from "./model/User";
import {loadConfig} from "./utile/utile";

export default class Api {

   async api<T, U>(path: string, method = "GET", body: U,token:string|null): Promise<HttpResponse<T>> {

        // let basepath=process.env.REACT_APP_API_URL
       let basepath = await this.getBaseURL();
       if (!basepath) {
            console.log("++ Nu aveam basepath")
           basepath = "http://localhost:7500"; // fallback if config fails
       }

       const url = basepath + path;
       console.log(url);

       console.log("---------------------AFTER")
       // console.log(request URL: ${url});


       // const url = basepath + path;

        // const url = path;

        console.log(url);

        const options: RequestInit = {
            method,
            mode: 'cors',
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },


            body: body == null ? null : JSON.stringify(body)
        }
        if (token !== null) {
            options.headers = {
                ...options.headers,
                Authorization: `Bearer `+token
            };
        }
       console.log(url);

       return fetch(url, options);
    }

    addNewClient=async (client:Client):Promise<Client>=>{
        let tk=localStorage.getItem("tkn");
        console.log(tk);
        console.log("------api add---");
        let response= await this.api(`/api/v1/addclient`,'POST',client,tk);
        console.log("status="+response.status);
        if(response.status==200){
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
        if(response.status==200){
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

        if(response.status==200){
            return response.json() as Promise<Client>;
        }else{
            return Promise.reject(response.message);
        }
    }

    getBaseURL=async () =>{

          try {
              let response = await loadConfig();
              return response.BASE_URL;
          }catch (e) {
              return Promise.reject("Error");
          }


    }
    delClient=async (client:string):Promise<Client>=>{
        let tk=localStorage.getItem("tkn");
        console.log(tk);
        console.log("------api add---");
        let response= await this.api(`/api/v1/delclient/${client}`,'DELETE',null,tk);
        if(response.status==200){
            return response.json();
        }else{
            return Promise.reject([]);
        }
    }


    getAllClients=async ():Promise<Client[]>=>{
        let tk=localStorage.getItem("tkn");

        let response=await this.api('/api/v1/getclients','GET',null,tk);
        console.log(response);
        console.log("-------------------get all")
        if(response.status==200){
            return response.json();
        }else{
            return Promise.reject("Coud not get list of Clients!!")
        }
    }


    register=async (user:User):Promise<User>=>{
        console.log("In Api");
        console.log(user);

            let response=await this.api('/api/v1/auth/signup','POST',user,null);
            if(response.status==200){
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
        if(response.status==200){
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

}
