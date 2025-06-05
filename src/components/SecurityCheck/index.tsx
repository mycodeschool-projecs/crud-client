import { Button, Tooltip, Typography, Space } from "antd";
import { WrapperLanding } from "./indexstyle";
import { useNavigate } from "react-router-dom";
import { LoginOutlined, UserAddOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface User{
    id: number|null,
    firstName:string,
    lastName:string,
    email:string,
    password:string
}

export default function SecurityCheck(){
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login");
    }

    const goToRegister = () => {
        navigate("/register");
    }

    return(
        <WrapperLanding>
            <div className="welcome-section">
                <Title level={2}>Welcome to CRUD Application</Title>
                <Paragraph className="description">
                    Please login to access your account or register if you're a new user.
                </Paragraph>

                <Space size="large" className="button-container">
                    <Tooltip title="Sign in to your existing account">
                        <Button 
                            type="primary" 
                            className="button login" 
                            danger 
                            onClick={goToLogin}
                            icon={<LoginOutlined />}
                            size="large"
                        >
                            Login to Account
                        </Button>
                    </Tooltip>

                    <Tooltip title="Create a new account">
                        <Button 
                            type="primary" 
                            className="button reg" 
                            onClick={goToRegister}
                            icon={<UserAddOutlined />}
                            size="large"
                        >
                            Create New Account
                        </Button>
                    </Tooltip>
                </Space>
            </div>
        </WrapperLanding>
    )
}
