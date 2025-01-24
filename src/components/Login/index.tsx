import { Button } from "antd";
import { WrapperLogin} from "./indexstyle";
import {useNavigate} from "react-router-dom";
import {createRef, useRef} from "react";
import Api from "../../Api";
import {LoginUser} from "../../model/User";



interface User{
    id: number|null,
    firstName:string,
    lastName:string,
    email:string,
    password:string
}

export default function Login(){

    const navigate = useNavigate();
    let refEml = createRef<HTMLInputElement>();
    let refPass = createRef<HTMLInputElement>();

    let goBack=()=>{
        navigate("/")
    }


    let loginClk=async ()=>{
        let api=new Api();

        let usrLogin:LoginUser={
            email: refEml!.current!.value,
            password: refPass!.current!.value
        }
        try{
            let response=await api.login(usrLogin);

                localStorage.clear();
                localStorage.setItem("tkn",response.token);

                navigate("/adduser")

        }catch (e) {
            alert("Eroare Login!!")
            navigate("/")

        }


    }



    return(
        <WrapperLogin>
            <div className={"frm"}>
                <div className={"sect"}>
                    <label>Email</label>
                    <input ref={refEml} typeof={"text"} className={"camp"}/>
                </div>
                <div className={"sect"}>
                    <label>Password</label>
                    <input ref={refPass} typeof={"text"} className={"camp"}/>
                </div>

                <div className={"buttons"}>

                    <Button type="primary" className={"btn submit"} onClick={loginClk}>Submit</Button>
                    <Button type="primary" className={"btn back"} onClick={goBack}>Back</Button>

                </div>
            </div>

        </WrapperLogin>

    )
}