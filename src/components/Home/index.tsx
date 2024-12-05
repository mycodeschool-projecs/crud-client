
import type { FormProps } from 'antd';
import {Button, Checkbox, Form, Input, InputRef} from 'antd';
import {Client} from "../../model/Client";
import {WrapperHome} from "./indexstyle";
import Api from "../../Api";
import {LegacyRef, useEffect, useRef, useState} from "react";
import {ReactComponent as Spinner} from "../../Images/gear.svg";


import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';

interface DataType{
    key: number|null,
    name:string,
    surName:string,
    email:string,
    age:number
}

export default function Home(){


    const refEmail=useRef<InputRef>(null);
    const refName=useRef<InputRef>(null);
    const refSurNAme=useRef<InputRef>(null);
    const refAge=useRef<InputRef>(null);
    const[data,setData]=useState<DataType[]>();
    const [clnt,setClnt]=useState<Client>();
    const [ch,setCh]=useState(0);
    const [num,setNum]=useState("");
    const [myBasic] = Form.useForm(); // Creează instanța formei
    const [showSpin,setShowSpin]=useState(true);


    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,

        },
        {
            title: 'SurName',
            dataIndex: 'surName',
            key: 'surName',
            render: (text) => <a>{text}</a>,

        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            render: (number)=><a>{number}</a>

        }
        ]

    useEffect(()=>{
        console.log("La incarcare");

        setData([]);
        setNum("jajlellell");
        refName!.current!.input!.value="dsllkl";
        setClnt({name:"",surName:"",email:"",age:0,id:null})
        loadData();
        setCh(1);
        // myBasic.setFieldValue( "name","Nouă valoare" );

        setShowSpin(true);
    },[]);

    useEffect(()=>{
        console.log("------ Modif clnt")
        console.log(clnt);
        // if(refName.current!=null&&refName.current.input!=null){
        //     refName.current.input.value="";
        // }
        // setNum("");
        // myBasic.resetFields();
    },[ch])


    const client:Client={
        id: 100,
        name: "Nelu",
        surName: "Santinelu",
        email: "aaa@aaa",
        age: 22
    }


    let loadData=async ()=>{
        setShowSpin(true)
        let api=new Api();
        let response=api.getAllClients().then(l=>{
            let dt:DataType[]=[];
            dt=l.map(v=>{
                return {key:v.id,name:v.name,surName:v.surName,email:v.email,age:v.age} as DataType;
            });
            setShowSpin(true);
            setData(dt);
        }).catch(e=>{
            console.log(e.value)
            setShowSpin(true);
        });
    }

    let onSubmit=async ()=>{


        setShowSpin(true);
        let client:Client={
            name: myBasic.getFieldValue("name"),
            surName:refSurNAme!.current!.input!.value,
            email:refEmail!.current!.input!.value,
            age:Number (refAge!.current!.input!.value),
            id:null
        }

        if(client.email.length>0&&client.name.length>0&&client.surName.length>0){

            let api=new Api();
            let newClient:Client=client;
            newClient.id=null;
            let response=await api.addClient(newClient).then(v=>{
                myBasic.resetFields();
                loadData();
            }).catch(r=>{
                console.log("Nashpa");
                // basic.resetFields(()=>{})
            });

        }
        console.log("schimb");

        myBasic.resetFields();
    }


    const onFinish: FormProps<Client>['onFinish'] =async (values) => {

    };


    const onFinishFailed: FormProps<Client>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    let onEmail=async (eml:HTMLInputElement):Promise<void>=>{
        let api=new Api();
        let response=api.findClient(eml.value).then(c=>{
                myBasic.setFieldsValue({name:c.name,surName:c.surName,age:c.age,email:c.email,id:c.id})

            setShowSpin(false);
            }

        ).catch(v=>{
            setShowSpin(false);
            console.log("Eroare nu am gasit email!!!")

        });
    }


    let getByEml=async (eml:string):Promise<Client>=>{
        let api=new Api();
        let response=await api.findClient(eml)
        return response;
    }
    let delEml=()=>{
        const emailValue = myBasic.getFieldValue("email"); // Preia valoarea câmpului "email"

        if(emailValue!=null){
            let api=new Api();

            let response=api.delClient(emailValue).then(u=> {
                    myBasic.resetFields();

                    loadData();
                }
            ).catch(e=>{
                console.log("ERRRRRRRR "+e)

            });





        }
    }

    let handleRowClick=async (row:DataType)=>{

        getByEml(row.email).then(c=>{
            myBasic.setFieldsValue({name:row.name,surName:row.surName,age:row.age,email:row.email,id:c.id});

        }).catch((e)=>console.log(e.value));


    }



    return(
        <WrapperHome>


            {/*{*/}
            {/*    showSpin?(*/}
            {/*        <>*/}
            {/*            /!*<img className={"spinner"} src="https://example.com/myGif.gif" alt="GIFFFY animat" />*!/*/}
            {/*            /!*<img  src={spinner} className={"spinner"} />*!/*/}
            {/*            <Spinner className={"spinner"} />*/}
            {/*        </>*/}
            {/*    ):""*/}
            {/*}*/}

                    <Form
                        name="myBasic"
                        form={myBasic}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        style={{ maxWidth: 600 }}
                        // initialValues={{ remember: true }}
                        // onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                            className={"lbl"}
                        >
                            <Input ref={refEmail} onBlur={(em)=> onEmail(em.target)} />
                        </Form.Item>


                        <Form.Item<Client>
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >

                                    <Input ref={refName} value={num} />



                        </Form.Item>

                        <Form.Item<Client>
                            label="Surname"
                            name="surName"
                            rules={[{ required: true, message: 'Please input your surname!' }]}
                        >
                            <Input ref={refSurNAme} value={num} />
                        </Form.Item>

                        <Form.Item<Client>
                            label="Age"
                            name="age"
                            rules={[{ required: true, message: 'Please input your Age!' }]}
                        >
                            <Input ref={refAge} defaultValue={0} />
                        </Form.Item>


                        <div className={"buttons"}>
                            <Form.Item label={null}>
                                <Button type="primary" onClick={(e)=>{
                                    e.preventDefault();
                                    onSubmit()
                                }}>
                                    Submit
                                </Button>
                            </Form.Item>

                            <Form.Item label={null}>
                                <Button type="primary" danger className={"btn delete"} onClick={delEml}>
                                    Delete
                                </Button>
                            </Form.Item>

                        </div>

                    </Form>








            {
                data?(
                    <div className={"tbl"}>
                        <Table<DataType> className={"custom-tbl"}
                                         // components={{
                                         //     header: {
                                         //         cell: (props:React.HTMLAttributes<HTMLTableCellElement>) => (
                                         //             <th {...props} style={{ backgroundColor: '#FEFF00', color: '#000', fontWeight: 'bold' }}>
                                         //                 {props.children}
                                         //             </th>
                                         //         ),
                                         //     },
                                         //     body: {
                                         //         cell: (props:React.HTMLAttributes<HTMLTableCellElement>) => (
                                         //             <th {...props} style={{ backgroundColor: '#91b0b0', color: '#000', fontWeight: 'bold' }}>
                                         //                 {props.children}
                                         //             </th>
                                         //         ),
                                         //
                                         //     }
                                         //
                                         // }}
                                         columns={columns} dataSource={data.length>0?data:[]} pagination={{ pageSize: 5 }}
                                         onRow={(record, rowIndex) => {
                                                return {
                                                            onClick: () => handleRowClick(record), // Eveniment click pe rând
                                                        };
                                                }}
                        />

                    </div>
                ):(
                 ""
                )
            }

        </WrapperHome>
    )
}