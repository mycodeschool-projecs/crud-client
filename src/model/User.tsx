
export interface User{
    id:number|null,
    firstName:string,
    lastName:string,
    email:string,
    password:string,
    role:Role

}


export enum Role{
    USER,
    ADMIN
}

export interface LoginUser{
    email: string,
    password: string
}