import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Models from './pages/Models';
import Playground from './pages/Playground';
import ApiKeys from './pages/ApiKeys';
import KeyDetails from './pages/KeyDetails';
import UsageAnalytics from './pages/UsageAnalytics';
import RequestHistory from './pages/RequestHistory';
import ApiTester from './pages/ApiTester';
import AdminDashboard from './pages/AdminDashboard';

function DashboardLayout({ children }) {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Home & Authentication Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Platform Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* OpenRouter AI Gateway Features */}
          <Route
            path="/models"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Models />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Playground />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/keys"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ApiKeys />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/keys/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <KeyDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/usage"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UsageAnalytics />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <RequestHistory />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tester"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ApiTester />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Restricted Route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </AdminRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
