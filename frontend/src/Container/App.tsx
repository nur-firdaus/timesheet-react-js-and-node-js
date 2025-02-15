import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeContainer from "./HomeContainer";
import Maincontainer from "./MainContainer";
import LoginForm from "./LoginContainer";

// Components
const Login = () => <LoginForm/>;
const Home = () => <Maincontainer/>;
const Dashboard = () => <HomeContainer/>;

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const username = localStorage.getItem('username');

  // If username doesn't exist, redirect to login
  if (!username) {
    return <Navigate to="/login" replace />;
  }

  // If username exists, render the children (Dashboard)
  return children;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default App;