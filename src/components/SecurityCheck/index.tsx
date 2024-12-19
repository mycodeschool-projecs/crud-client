import { Button } from "antd";
import {WrapperLanding} from "./indexstyle";

import { useNavigate } from "react-router-dom";


interface User{
    id: number|null,
    firstName:string,
    lastName:string,
    email:string,
    password:string
}

export default function SecurityCheck(){

    const navigate = useNavigate();


   let goTo=()=>{
       navigate("/login")
   }

    let goToRegister=()=>{
        navigate("/register")
    }

    return(
        <WrapperLanding>
            <Button type="primary" className={"button login"} danger onClick={goTo}>Login</Button>
            <Button type="primary" className={"button reg"} onClick={goToRegister}>Register</Button>

        </WrapperLanding>

    )
}