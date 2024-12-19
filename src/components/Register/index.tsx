import { Button } from "antd";
import { WrapperRegister} from "./indexstyle";
import {useNavigate} from "react-router-dom";
import {createRef, useEffect, useRef, useState} from "react";
import Api from "../../Api";
import {User} from "../../model/User";




export default function Register(){

    const navigate = useNavigate();
    // const refEml=useRef(null);
    let refEml = createRef<HTMLInputElement>();
    let refPass = createRef<HTMLInputElement>();
    let refFirst = createRef<HTMLInputElement>();
    let refLast = createRef<HTMLInputElement>();
    const [eml,setEml]=useState("");
    const [pass,setPass]=useState("");
    const [firstN,setFirstN]=useState("");
    const [lastN,setLast]=useState("");


    const [ch,setCh]=useState(0);

    useEffect(()=>{
        setEml("");

        refEml.current!.value="";
        refEml.current!.defaultValue="";
        console.log("Schimb fata")

    },[ch])

    let goBack=()=>{
        navigate("/")
    }



    let registerUser=async ()=>{
            let newUser:User={
                id:null,
                email:refEml.current?.value?refEml.current?.value:"",
                firstName:refFirst.current?.value?refFirst.current?.value:"",
                lastName:refLast.current?.value?refLast.current?.value:"",
                password:refPass.current?.value?refPass.current?.value:"",
                role: 0
            }
            if(newUser.password.length>0&&newUser.email.length>0){
                let api=new Api();
                try{
                    let response=await api.register(newUser).then(a=>console.log(a)).catch(e=>console.log(e));
                    setCh(prevState => prevState++);

                    if (refEml.current) {
                        refEml.current.value = "";
                    }
                    if (refFirst.current) {
                        refFirst.current.value = "";
                    }
                    if (refPass.current) {
                        refPass.current.value = "";
                    }
                    if (refLast.current) {
                        refLast.current.value = "";
                    }
                    navigate("/");

                }catch (e){
                    console.log(e);
                    navigate("/")


                }

    }
    }


    return(
        <WrapperRegister>
            {
                ch>=0?(
                    <div className={"frmr"}>
                        <div className={"sect"}>
                            <label>Email</label>
                            <input ref={refEml} typeof={"text"} className={"camp"} placeholder={"Email"} defaultValue={eml}/>
                        </div>
                        <div className={"sect"}>
                            <label>Password</label>
                            <input ref={refPass} type={"PASSWORD"} className={"camp"} placeholder={"Password"} defaultValue={pass}/>
                        </div>

                        <div className={"sect"}>
                            <label>First Name</label>
                            <input ref={refFirst} typeof={"text"} className={"camp"} placeholder={"First Name"} defaultValue={firstN}/>
                        </div>
                        <div className={"sect"}>
                            <label>Last Name</label>
                            <input ref={refLast} typeof={"text"} className={"camp"} placeholder={"Last Name"} defaultValue={lastN} />
                        </div>
                        <div className={"buttons"}>

                            <Button type="primary" className={"btn submit"} onClick={registerUser}>Submit</Button>
                            <Button type="primary" className={"btn back"} onClick={goBack}>Back</Button>

                        </div>
                    </div>
                ):""
            }


        </WrapperRegister>

    )
}