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
    if (!isAuthenticated) return;

    // API method now handles errors internally and returns an empty array instead of rejecting
    const api = new Api();
    const notifications = await api.getNotificationsByReadStatus(false);
    setUnreadNotificationsCount(notifications.length);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadNotificationsCount();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    // Use Keycloak logout which will also clear localStorage and update auth state
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

  const items = [
    {
      key: '/adduser',
      icon: <HomeOutlined />,
      label: <Link to="/adduser">Home</Link>,
    },
    {
      key: '/notifications',
      icon: (
        <Badge count={unreadNotificationsCount} offset={[10, 0]}>
          <BellOutlined />
        </Badge>
      ),
      label: <Link to="/notifications">Notifications</Link>,
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: 'logout',
      className: 'logout-item',
      label: (
        <Button 
          type="link" 
          icon={<LogoutOutlined />} 
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </Button>
      ),
    },
  ];

  return (
    <div className="navbar-container">
      <Menu 
        mode="horizontal" 
        selectedKeys={[location.pathname]} 
        className="navbar-menu"
        items={items}
      />
    </div>
  );
};

export default Navbar;
