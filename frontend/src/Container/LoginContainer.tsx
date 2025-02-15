import React, { useState } from 'react';
import { Form, Input, Button, message, Row, Col, Flex, Card, Typography } from 'antd';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinishVoter = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
       // Send login request to the server
      const response = await axios.post('http://localhost:3001/api/login', values);
      const userData = response.data;

      // Store the entire user object in localStorage as a JSON string
      localStorage.setItem('user', JSON.stringify(userData.user));

      // Store additional data (e.g., role)
      localStorage.setItem('Role', 'Voter');
      localStorage.setItem('username', userData.user.username);

      // Show success message
      message.success('Login successful');

      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (error) {
      message.error('Login failed');
    }
    setLoading(false);
  };
  const cardStyle: React.CSSProperties = {
    width: 620,
  };
  
  const imgStyle: React.CSSProperties = {
    display: 'block',
    width: 273,
  };
  return (
    <>
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <Col span={12}>
            <Card hoverable style={cardStyle} styles={{ body: { padding: 0, overflow: 'hidden' } }}>
              <Flex justify="space-between">
                <img
                  alt="avatar"
                  src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                  style={imgStyle} />
                <Flex vertical align="flex-end" justify="space-between" style={{ padding: 32 }}>
                  Login as Voter
                  <Form name="login_form" onFinish={onFinishVoter} layout="vertical">
                      <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please enter your username' }]}
                      >
                        <Input placeholder="Username" />
                      </Form.Item>
                      <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                      >
                        <Input.Password placeholder="Password" />
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                          Log in
                        </Button>
                      </Form.Item>
                  </Form>
                </Flex>
              </Flex>
            </Card>
          </Col>
        </Row>
      </>
  );
};

export default LoginForm;
