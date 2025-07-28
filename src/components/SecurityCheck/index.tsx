import { Button, Tooltip, Typography, Space, Spin, message } from "antd";
import { WrapperLanding } from "./indexstyle";
import { useNavigate } from "react-router-dom";
import { LoginOutlined, UserAddOutlined, LockOutlined, WarningOutlined } from '@ant-design/icons';
import { useEffect, useCallback } from "react";
import { login, refreshTokenHelper } from "../../keycloak/KeycloakProvider";
import { useAuth } from "../../context/AuthContext";

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
    const { 
        isAuthenticated, 
        isLoading, 
        securityStatus, 
        tokenExpiration, 
        validateToken 
    } = useAuth();

    // Determine if token is valid based on security status
    const tokenValid = securityStatus === 'authenticated';

    // Function to validate token and check expiration
    const validateTokenStatus = useCallback(() => {
        validateToken();
        return securityStatus === 'authenticated';
    }, [validateToken, securityStatus]);

    // Function to refresh token if needed
    const refreshTokenIfNeeded = useCallback(async () => {
        try {
            const refreshed = await refreshTokenHelper();
            if (refreshed) {
                message.success('Session refreshed successfully');
                // Validate token after refresh to update state
                validateToken();
                return true;
            } else {
                message.info('Token is still valid, no need to refresh');
                // Still validate the token to ensure state is up to date
                validateToken();
                return tokenValid;
            }
        } catch (error) {
            console.error('Failed to refresh token:', error);
            message.error('Session expired. Please authenticate again.');
            return false;
        }
    }, [validateToken, tokenValid]);

    const checkAuthentication = useCallback(() => {
        // Validate token to update state
        validateToken();

        if (isAuthenticated && tokenValid) {
            // If user is authenticated and token is valid, navigate to login page
            navigate("/login");
        }
    }, [navigate, isAuthenticated, tokenValid, validateToken]);

    useEffect(() => {
        checkAuthentication();

        // Set up interval to periodically check token validity
        const intervalId = setInterval(() => {
            if (isAuthenticated) {
                validateToken();
            }
        }, 60000); // Check every minute

        return () => clearInterval(intervalId);
    }, [checkAuthentication, validateToken, isAuthenticated]);

    const authenticateWithKeycloak = () => {
        try {
            login();
        } catch (error) {
            console.error('Authentication error:', error);
            message.error('Failed to initiate authentication. Please try again.');
        }
    };

    const accessApplication = async () => {
        if (isAuthenticated && tokenValid) {
            navigate("/login");
        } else if (isAuthenticated && !tokenValid) {
            if (securityStatus === 'expired') {
                message.warning("Your session has expired. Refreshing token...");
                const refreshSuccessful = await refreshTokenIfNeeded();
                if (refreshSuccessful) {
                    navigate("/login");
                } else {
                    message.error("Failed to refresh token. Please authenticate again.");
                    authenticateWithKeycloak();
                }
            } else {
                message.error("Authentication token is invalid. Please authenticate again.");
                authenticateWithKeycloak();
            }
        } else {
            message.warning("Please authenticate with Keycloak first");
            authenticateWithKeycloak();
        }
    }

    const goToRegister = async () => {
        if (isAuthenticated && tokenValid) {
            navigate("/register");
        } else if (isAuthenticated && !tokenValid) {
            if (securityStatus === 'expired') {
                message.warning("Your session has expired. Refreshing token...");
                const refreshSuccessful = await refreshTokenIfNeeded();
                if (refreshSuccessful) {
                    navigate("/register");
                } else {
                    message.error("Failed to refresh token. Please authenticate again.");
                    authenticateWithKeycloak();
                }
            } else {
                message.error("Authentication token is invalid. Please authenticate again.");
                authenticateWithKeycloak();
            }
        } else {
            message.warning("Please authenticate with Keycloak first");
            authenticateWithKeycloak();
        }
    }

    // Function to render security status information
    const renderSecurityStatus = () => {
        if (!isAuthenticated) return null;

        let statusColor = 'green';
        let statusText = 'Valid';
        let statusIcon = <LockOutlined />;

        if (securityStatus === 'expired') {
            statusColor = 'orange';
            statusText = 'Expired';
            statusIcon = <WarningOutlined />;
        } else if (securityStatus === 'invalid') {
            statusColor = 'red';
            statusText = 'Invalid';
            statusIcon = <WarningOutlined />;
        } else if (securityStatus === 'none') {
            statusColor = 'gray';
            statusText = 'Not authenticated';
            statusIcon = <WarningOutlined />;
        }

        return (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <div style={{ 
                    padding: '10px', 
                    backgroundColor: `${statusColor}10`, 
                    border: `1px solid ${statusColor}`, 
                    borderRadius: '4px',
                    marginBottom: '15px'
                }}>
                    <Space>
                        {statusIcon}
                        <span style={{ color: statusColor, fontWeight: 'bold' }}>
                            Security Status: {statusText}
                        </span>
                    </Space>
                    {tokenExpiration && securityStatus === 'authenticated' && (
                        <div style={{ marginTop: '5px', fontSize: '12px' }}>
                            Token expires: {tokenExpiration.toLocaleString()}
                        </div>
                    )}
                </div>

                {securityStatus === 'expired' && (
                    <Button 
                        onClick={async () => {
                            const refreshSuccessful = await refreshTokenIfNeeded();
                            if (refreshSuccessful) {
                                message.success('Session refreshed successfully. You can now proceed.');
                            } else {
                                message.error('Failed to refresh session. Please authenticate again.');
                                authenticateWithKeycloak();
                            }
                        }}
                        icon={<LockOutlined />}
                        style={{ marginBottom: '15px' }}
                    >
                        Refresh Session
                    </Button>
                )}
            </div>
        );
    };

    return(
        <WrapperLanding>
            <div className="welcome-section">
                <Title level={2}>Welcome to CRUD Application</Title>
                <Paragraph className="description">
                    Please authenticate with Keycloak first, then you can access the application or register if you're a new user.
                </Paragraph>

                <Spin spinning={isLoading}>
                    {renderSecurityStatus()}

                    {!isAuthenticated ? (
                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <Button 
                                type="primary" 
                                onClick={authenticateWithKeycloak}
                                icon={<LockOutlined />}
                                size="large"
                                style={{ marginBottom: '20px' }}
                            >
                                Authenticate with Keycloak
                            </Button>
                            <Paragraph>
                                You must authenticate with Keycloak before accessing the application.
                            </Paragraph>
                        </div>
                    ) : (
                        <Space size="large" className="button-container">
                            <Tooltip title={!tokenValid ? "Token validation required before access" : "Access the application"}>
                                <Button 
                                    type="primary" 
                                    className="button access"
                                    danger 
                                    onClick={accessApplication}
                                    icon={<LockOutlined />}
                                    size="large"
                                    disabled={!tokenValid}
                                >
                                    Access Application
                                </Button>
                            </Tooltip>

                            <Tooltip title={!tokenValid ? "Token validation required before registration" : "Create a new account"}>
                                <Button 
                                    type="primary" 
                                    className="button reg" 
                                    onClick={goToRegister}
                                    icon={<UserAddOutlined />}
                                    size="large"
                                    disabled={!tokenValid}
                                >
                                    Create New Account
                                </Button>
                            </Tooltip>
                        </Space>
                    )}
                </Spin>
            </div>
        </WrapperLanding>
    )
}
