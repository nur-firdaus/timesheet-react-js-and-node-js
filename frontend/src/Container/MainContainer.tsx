import React, { ReactElement, useState, useEffect  } from 'react'
import { Breadcrumb, Button, Layout, Menu, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import LoginForm from './LoginContainer';


const { Header, Content, Footer } = Layout;

const items = new Array(5).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));


const Main: React.FC = () => {

  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  
  const updateUsername = (name: string) => {
    setUsername(name);
  };

  return (
           <Layout>
           <Content >
             <Breadcrumb style={{ margin: '16px 0' }}>
               <Breadcrumb.Item>Home</Breadcrumb.Item>
               <Breadcrumb.Item>List</Breadcrumb.Item>
               <Breadcrumb.Item>App</Breadcrumb.Item>
             </Breadcrumb>
             <Outlet />
             <LoginForm/>
             <h1>MAIN PAGE</h1>
           </Content>
           <Footer style={{ textAlign: 'center' }}>
             Ant Design ©{new Date().getFullYear()} Created by Ant UED
           </Footer>
         </Layout>
  );
};

export default Main;