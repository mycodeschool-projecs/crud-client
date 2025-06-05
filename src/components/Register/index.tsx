import { Button, Form, Input, message, Spin } from "antd";
import { WrapperRegister } from "./indexstyle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Api from "../../Api";
import { User } from "../../model/User";

interface RegisterFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const goBack = () => {
    navigate("/");
  };

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true);

    const newUser: User = {
      id: null,
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
      role: 0
    };

    const api = new Api();

    try {
      await api.register(newUser);
      message.success("Registration successful!");
      form.resetFields();
      navigate("/");
    } catch (e) {
      console.error("Registration error:", e);
      message.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <WrapperRegister>
      <div className="register-container">
        <h2>Register</h2>
        <Spin spinning={loading}>
          <Form
            form={form}
            name="register"
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
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Password must be at least 6 characters!" }
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "Please input your first name!" }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Please input your last name!" }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>

            <div className="buttons">
              <Button type="primary" htmlType="submit" className="btn submit">
                Register
              </Button>
              <Button type="default" className="btn back" onClick={goBack}>
                Back
              </Button>
            </div>
          </Form>
        </Spin>
      </div>
    </WrapperRegister>
  );
}
