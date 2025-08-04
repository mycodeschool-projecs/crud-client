import React, { useEffect } from 'react';
import type { FormProps } from 'antd';
import { Button, Form, Input,message } from 'antd';
import { WrapperKeycloakLogin } from './indexStyle';
import ApiKeycloak from '../../service/api/apiKeycloak';
import { LoginUser } from '../../model/User';
import { useNavigate } from 'react-router-dom';

type FieldType = {
    username?: string;
    password?: string;
};

const KeycloakLogin: React.FC = () => {
    const [form] = Form.useForm();
    const nav = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            form.resetFields(); // acum sigur merge
        }, 0);
    }, []);

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values.username);
        handlecliak(values);
    };

    const handlecliak = async (values: FieldType) => {
        const api = new ApiKeycloak();
        const loginUser: LoginUser = {
            email: values.username ?? '',
            password: values.password ?? '',
        };

        try {
            const response = await api.loginKeycloak(loginUser);
            console.log(response);
            form.resetFields(); // poți pune și aici dacă vrei
            nav('/appsecurity');
        } catch (e) {
            message.error({
                content: 'Autentificare Keyclaok eșuată!!!!',
                duration:3, // secunde
            });            form.resetFields(); // resetezi câmpurile pe eroare
            nav('/');
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <WrapperKeycloakLogin>
            <div className="container-kcl">
                <Form
                    form={form}
                    name="basic"
                    id="form-kcl"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input className="custom-input" placeholder="Username" />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password className="custom-input" placeholder="Password" />
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit" className="custom-button">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </WrapperKeycloakLogin>
    );
};

export default KeycloakLogin;
