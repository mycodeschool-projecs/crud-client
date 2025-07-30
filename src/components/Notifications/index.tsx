import React, { useEffect, useState, useCallback } from 'react';
import Api from '../../Api';
import { Notification } from '../../model/Notification';
import { Card, List, Badge, Button, Typography, Tag, Spin, Alert, Empty, Divider } from 'antd';
import { BellOutlined, CheckOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './indexstyle.css';

// Create a single instance of the API outside the component
const notificationsApi = new Api();

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const data = await notificationsApi.getAllNotifications();
            setNotifications(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch notifications');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationsApi.markNotificationAsRead(id);
            console.log('Notification marked as read');
            // Update the local state to reflect the change
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification.id === id
                        ? { ...notification, read: true }
                        : notification
                )
            );
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsApi.markAllNotificationsAsRead();
            console.log('All notifications marked as read');
            // Update the local state to reflect the change
            setNotifications(prevNotifications =>
                prevNotifications.map(notification => ({ ...notification, read: true }))
            );
        } catch (err) {
            console.error('Failed to mark all notifications as read', err);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Loading notifications...">
                    <div className="content" />
                </Spin>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    const { Title, Text } = Typography;

    const getOperationColor = (operation: string) => {
        switch (operation.toUpperCase()) {
            case 'CREATE':
                return 'green';
            case 'UPDATE':
                return 'blue';
            case 'DELETE':
                return 'red';
            case 'LOGIN':
                return 'purple';
            default:
                return 'default';
        }
    };

    return (
        <div className="notifications-container">
            <Card 
                title={
                    <div className="notifications-header">
                        <Title level={3}>
                            <BellOutlined className="bell-icon" /> Notifications
                        </Title>
                        {notifications.filter(n => !n.read).length > 0 && (
                            <Badge 
                                count={notifications.filter(n => !n.read).length} 
                                className="unread-badge"
                            />
                        )}
                    </div>
                }
                extra={
                    notifications.length > 0 && notifications.some(n => !n.read) && (
                        <Button 
                            type="primary" 
                            icon={<CheckCircleOutlined />} 
                            onClick={handleMarkAllAsRead}
                        >
                            Mark All as Read
                        </Button>
                    )
                }
                className="notifications-card"
            >
                {notifications.length === 0 ? (
                    <Empty 
                        description="No notifications" 
                        image={Empty.PRESENTED_IMAGE_SIMPLE} 
                    />
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={notifications}
                        renderItem={notification => (
                            <List.Item
                                key={notification.id}
                                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                                actions={[
                                    !notification.read && (
                                        <Button 
                                            type="primary" 
                                            icon={<CheckOutlined />} 
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            size="small"
                                        >
                                            Mark as Read
                                        </Button>
                                    )
                                ].filter(Boolean)}
                            >
                                <List.Item.Meta
                                    title={
                                        <div className="notification-title">
                                            <Tag color={getOperationColor(notification.operation)}>
                                                {notification.operation.toUpperCase()}
                                            </Tag>
                                            <Text strong>{notification.entityType}</Text>
                                            {!notification.read && <Badge status="processing" className="unread-indicator" />}
                                        </div>
                                    }
                                    description={
                                        <div className="notification-details">
                                            <Text>ID: {notification.entityId}</Text>
                                            <Text>Source: {notification.sourceService}</Text>
                                            {notification.details && <Text>Details: {notification.details}</Text>}
                                            <Text type="secondary" className="timestamp">
                                                {new Date(notification.timestamp).toLocaleString()}
                                            </Text>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                )}
            </Card>
        </div>
    );
};

export default Notifications;
