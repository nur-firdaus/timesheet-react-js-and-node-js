import React, { useState } from 'react';
import { Menu, Button, message, Switch } from 'antd';
import { HomeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { SubMenu } = Menu;

const NavBar: React.FC = () => {
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
  const [realtime, setRealtime] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUsername(null);
    message.success('Logged out successfully');
    navigate('/');
  };

  const handleCreateElection = () => {
    navigate('CreateElection')
  };

  const handleCreateVoter = () => {
    navigate('createVoter')
  };
  
  const handleHome = () => {
    realtime==true?navigate('list-realtime'):navigate('list-batch')
  };

  const realtimeChange = () => {
    if(realtime==true){
      setRealtime(false)
      localStorage.setItem("realtime", "0");
      navigate('list-batch')
    }else{
      setRealtime(true)
      localStorage.setItem("realtime", "1");
      navigate('list-realtime')
    }
  };


  return (
    <>
      {username ? (
        <Menu mode="horizontal">
          <Menu.Item key="home" onClick={handleHome} icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <SubMenu key="sub1" icon={<UserOutlined />} title={`Welcome, ${username}`}>
            <Menu.Item key="profile:1">My Profile</Menu.Item>
            <Menu.Item key="profile:2">Settings</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<SettingOutlined />} title="Options">
            <Menu.Item key="options:1"><Button type="text" onClick={handleCreateElection}>Create Election</Button></Menu.Item>
            <Menu.Item key="options:1"><Button type="text" onClick={handleCreateVoter}>Create Voter</Button></Menu.Item>
          </SubMenu>
          <Menu.Item>
            <Button type="primary" onClick={handleLogout}>
              Logout
            </Button>
          </Menu.Item>
          <Menu.Item>
            Batch <Switch checked={realtime} onChange={realtimeChange} /> Real-time 
          </Menu.Item>
        </Menu>
      ) : (
        <div>Login</div>
      )}
    </>
  );
};

export default NavBar;
