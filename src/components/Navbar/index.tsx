import React, { useEffect, useCallback, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Badge, Button } from 'antd';
import { HomeOutlined, UserOutlined, BellOutlined, LogoutOutlined } from '@ant-design/icons';
import Api from '../../Api';
import './style.css';
import { logout } from '../../keycloak/KeycloakProvider';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);
  const { isAuthenticated } = useAuth();

  const fetchUnreadNotificationsCount = useCallback(async () => {
    try {
      const api = new Api();
      const notifications = await api.getNotificationsByReadStatus(false);
      setUnreadNotificationsCount(notifications.length);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
    }
  }, []);

  const checkNotifications = useCallback(() => {
    if (isAuthenticated) {
      fetchUnreadNotificationsCount();
    }
  }, [fetchUnreadNotificationsCount, isAuthenticated]);

  useEffect(() => {
    checkNotifications();
  }, [checkNotifications, location.pathname]);

  const handleLogout = () => {
    // Use Keycloak logout which will also clear localStorage and update Redux state
    logout();
    // No need to navigate, Keycloak will redirect to the login page
  };

  // Update unread count when component gets focus
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        fetchUnreadNotificationsCount();
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="navbar-container">
      <Menu mode="horizontal" selectedKeys={[location.pathname]} className="navbar-menu">
        <Menu.Item key="/adduser" icon={<HomeOutlined />}>
          <Link to="/adduser">Home</Link>
        </Menu.Item>
        <Menu.Item key="/notifications" icon={
          <Badge count={unreadNotificationsCount} offset={[10, 0]}>
            <BellOutlined />
          </Badge>
        }>
          <Link to="/notifications">Notifications</Link>
        </Menu.Item>
        <Menu.Item key="/profile" icon={<UserOutlined />}>
          <Link to="/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="logout" className="logout-item">
          <Button 
            type="link" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </Button>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Navbar;
