import { Button, Form, Input, message, Spin } from "antd";
import { WrapperLogin } from "./indexstyle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Api from "../../service/api/Api";
import { LoginUser } from "../../model/User";

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const goBack = () => {
        navigate("/");
    };

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        const api = new Api();

        const usrLogin: LoginUser = {
            email: values.email,
            password: values.password
        };

        try {
            const response = await api.login(usrLogin);
            localStorage.clear();
            localStorage.setItem("tkn", response.token);
            message.success("Login successful!");
            navigate("/adduser");
        } catch (e) {
            message.error("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <WrapperLogin>
            <div className="login-container">
                <h2>Login</h2>
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        name="login"
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Please input your email!" },
                                { type: "email", message: "Please enter a valid email address!" }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: "Please input your password!" }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <div className="buttons">
                            <Button type="primary" htmlType="submit" className="btn submit">
                                Login
                            </Button>
                            <Button type="default" className="btn back" onClick={goBack}>
                                Back
                            </Button>
                        </div>
                    </Form>
                </Spin>
            </div>
        </WrapperLogin>
    );
}
