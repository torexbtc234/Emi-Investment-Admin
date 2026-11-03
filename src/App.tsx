import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Deposits from './pages/Deposits';
import Withdrawals from './pages/Withdrawals';
import Plans from './pages/Plans';
import Cars from './pages/Cars';
import KYC from './pages/KYC';
import Tickets from './pages/Tickets';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('EM_INVEST_ADMIN_TOKEN');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="deposits" element={<Deposits />} />
          <Route path="withdrawals" element={<Withdrawals />} />
          <Route path="plans" element={<Plans />} />
          <Route path="cars" element={<Cars />} />
          <Route path="kyc" element={<KYC />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
