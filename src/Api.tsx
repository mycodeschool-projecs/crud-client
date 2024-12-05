import HttpResponse from "./model/HttpResponse";
import {Client} from "./model/Client";

export default class Api {

    api<T, U>(path: string, method = "GET", body: U): Promise<HttpResponse<T>> {

        let basepath=process.env.REACT_APP_API_URL

        if(basepath==undefined){
            basepath="http://localhost:1234";
        }

        const url = basepath + path;

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
        return fetch(url, options)
    }

    addClient=async (client:Client):Promise<Client>=>{

        let response= await this.api(`/api/v1/add`,'POST',client);
        if(response.status==200){
            return response.json();
        }else{
            console.log("Eroare in api")
            return Promise.reject(response.message);
        }
    }

    findClient=async (eml:string):Promise<Client>=>{

        let response= await this.api(`/api/v1/find/${eml}`,'GET',null);
        if(response.status==200){
            return response.json() as Promise<Client>;
        }else{
            return Promise.reject(response.message);
        }
    }

    delClient=async (client:string):Promise<Client>=>{

        let response= await this.api(`/api/v1/del/${client}`,'DELETE',null);
        if(response.status==200){
            return response.json();
        }else{
            return Promise.reject([]);
        }
    }


    getAllClients=async ():Promise<Client[]>=>{
        let response=await this.api('/api/v1/getall','GET',null);
        if(response.status==200){
            return response.json();
        }else{
            return Promise.reject("Coud not get list of Clients!!")
        }
    }


}
