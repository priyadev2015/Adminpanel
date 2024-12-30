
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "../LayoutPage/Layout";
import RoleCreate from "../pages/Admin_Panel/RoleCreate";
import Login from "../pages/Login";
import Main from "../MainDashboard/Main";
import PropertiesListPage from "../pages/Admin_Panel/PropertiesList";
import LeaseTable from "../pages/Admin_Panel/LeaseExpired";
import PropertyApprovedList from "../pages/Admin_Panel/PropertyAlooted";
import TenantRequests from "../pages/Admin_Panel/TenantRequest";
import MessageApp from "../pages/Admin_Panel/Message/AllUser";
import UserManagement from "../pages/Admin_Panel/UserManagement";
import PrivateRoute from "../components/PrivateRoute"; 


const AppRouting = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    setIsAuthenticated(!!token); 

  }, []);

  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Login onLogin={() => setIsAuthenticated(true)} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Main />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/role-create"
          element={
            <PrivateRoute>
              <Layout>
                <RoleCreate />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/properties-list"
          element={
            <PrivateRoute>
              <Layout>
                <PropertiesListPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <PrivateRoute>
              <Layout>
                <UserManagement />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/lease-expired"
          element={
            <PrivateRoute>
              <Layout>
                <LeaseTable />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/property-alloted-list"
          element={
            <PrivateRoute>
              <Layout>
                <PropertyApprovedList />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tenant-request"
          element={
            <PrivateRoute>
              <Layout>
                <TenantRequests />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/message"
          element={
            <PrivateRoute>
              <Layout>
                <MessageApp />
              </Layout>
            </PrivateRoute>
          }
        />
      
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRouting;
