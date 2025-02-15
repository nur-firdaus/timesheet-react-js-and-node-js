import React from 'react'
import { Layout  } from 'antd';
import { Navigate, Outlet } from 'react-router-dom';
import LoginForm from './LoginContainer';


const {  Content, Footer } = Layout;

const Main: React.FC = () => {
  const username = localStorage.getItem('username');
  
  // If username doesn't exist, redirect to login
  if (username) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
           <Layout>
           <Content >
             <Outlet />
             <LoginForm/>
           </Content>
           <Footer style={{ textAlign: 'center' }}>
            Alibaba Ant Design ©{new Date().getFullYear()} Created by Ant UED
           </Footer>
         </Layout>
  );
};

export default Main;