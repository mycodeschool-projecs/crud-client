
import { Button, Form, Input, Table, Spin, message, Badge } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { Client } from "../../model/Client";
import { WrapperHome } from "./indexstyle";
import Api from "../../Api";
import { useEffect, useState } from "react";
import type { TableProps } from 'antd';
import { useNavigate } from "react-router-dom";

interface DataType {
  key: number | null;
  name: string;
  surName: string;
  email: string;
  age: number;
}

export default function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState<DataType[]>([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Surname',
      dataIndex: 'surName',
      key: 'surName',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem("tkn");
    if (!token) {
      message.error("Authentication required");
      navigate("/");
      return;
    }

    loadData();
    fetchUnreadNotificationsCount();
  }, []);

  const fetchUnreadNotificationsCount = async () => {
    try {
      const api = new Api();
      const notifications = await api.getNotificationsByReadStatus(false);
      setUnreadNotificationsCount(notifications.length);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
    }
  };



  const loadData = async () => {
    setTableLoading(true);
    try {
      const api = new Api();
      const clients = await api.getAllClients();
      const formattedData = clients.map(client => ({
        key: client.id,
        name: client.name,
        surName: client.surName,
        email: client.email,
        age: client.age
      }));
      setData(formattedData);
    } catch (error) {
      message.error("Failed to load clients");
      console.error("Error loading clients:", error);
    } finally {
      setTableLoading(false);
    }
  };

  const findClientByEmail = async (email: string): Promise<Client | null> => {
    try {
      const api = new Api();
      return await api.findClient(email);
    } catch (error) {
      return null;
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const api = new Api();
      const client: Client = {
        name: values.name,
        surName: values.surName,
        email: values.email,
        age: Number(values.age),
        id: values.id || null
      };

      const existingClient = await findClientByEmail(client.email);

      if (existingClient) {
        client.id = existingClient.id;
        await api.updClient(client);
        message.success("Client updated successfully");
      } else {
        await api.addNewClient(client);
        message.success("Client added successfully");
      }

      form.resetFields();
      loadData();
    } catch (error) {
      message.error("Operation failed");
      console.error("Error saving client:", error);
    } finally {
      setLoading(false);
    }
  };

  const onEmailBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
    const email = event.target.value;
    if (!email) return;

    setLoading(true);
    try {
      const client = await findClientByEmail(email);
      if (client) {
        form.setFieldsValue({
          name: client.name,
          surName: client.surName,
          age: client.age,
          email: client.email,
          id: client.id
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async () => {
    const email = form.getFieldValue("email");
    if (!email) {
      message.warning("Please enter an email to delete");
      return;
    }

    setLoading(true);
    try {
      const api = new Api();
      await api.delClient(email);
      message.success("Client deleted successfully");
      form.resetFields();
      loadData();
    } catch (error) {
      message.error("Failed to delete client");
      console.error("Error deleting client:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (record: DataType) => {
    form.setFieldsValue({
      name: record.name,
      surName: record.surName,
      age: record.age,
      email: record.email
    });

    findClientByEmail(record.email)
      .then(client => {
        if (client) {
          form.setFieldsValue({ id: client.id });
        }
      });
  };


  useEffect(() => {
    const handleFocus = () => {
      fetchUnreadNotificationsCount();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <WrapperHome>
      <div className="client-management">
        <h2>Client Management</h2>

        <Spin spinning={loading}>
          <div className="form-container">
            <Form
              name="clientForm"
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                name="id"
                hidden
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please input email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input onBlur={onEmailBlur} placeholder="Email" />
              </Form.Item>

              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input name!' }]}
              >
                <Input placeholder="Name" />
              </Form.Item>

              <Form.Item
                label="Surname"
                name="surName"
                rules={[{ required: true, message: 'Please input surname!' }]}
              >
                <Input placeholder="Surname" />
              </Form.Item>

              <Form.Item
                label="Age"
                name="age"
                rules={[
                  { required: true, message: 'Please input age!' },
                  { 
                    validator: (_, value) => {
                      const num = Number(value);
                      if (isNaN(num) || num <= 0) {
                        return Promise.reject('Age must be a positive number!');
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input type="number" placeholder="Age" />
              </Form.Item>

              <div className="button-group">
                <Button type="primary" htmlType="submit" className="btn submit">
                  Save
                </Button>
                <Button type="primary" danger onClick={deleteClient} className="btn delete">
                  Delete
                </Button>
              </div>
            </Form>
          </div>
        </Spin>

        <div className="table-container">
          <h3>Client List</h3>
          <Table
            loading={tableLoading}
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5 }}
            rowClassName="clickable-row"
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
          />
        </div>
      </div>
    </WrapperHome>
  );
}
