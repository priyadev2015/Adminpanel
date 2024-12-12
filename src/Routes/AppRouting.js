


// import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Layout from "../LayoutPage/Layout"; // Import the Layout component
// import RoleCreate from "../pages/Admin_Panel/RoleCreate"; // Import RoleCreate page
// import Login from "../pages/Login";
// import Main from "../MainDashboard/Main"; // Import Main component
// import PropertiesListPage from "../pages/Admin_Panel/PropertiesList"; // Import the new PropertiesListPage
// import LeaseTable from "../pages/Admin_Panel/LeaseExpired"; // Import the LeaseExpired page
// import TenantList from "../pages/Admin_Panel/TenantList"; // Import the TenantList page
// import PropertyApprovedList from "../pages/Admin_Panel/PropertyAlooted";
// import TenantRequests from "../pages/Admin_Panel/TenantRequest";
// import MessageApp from "../pages/Admin_Panel/Message/AllUser";
// import UserManagement from "../pages/Admin_Panel/UserManagement";
// import OwnerList from "../pages/Admin_Panel/OwnerList";
// import MaintenanceList from "../pages/Admin_Panel/MaintenanceList";

 
// const AppRouting = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Check if the user is already authenticated (e.g., token exists in localStorage)
//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       setIsAuthenticated(true); // If the token exists, set authenticated to true
//     }
//   }, []);

//   const handleLogin = () => {
//     setIsAuthenticated(true); // Set isAuthenticated to true after successful login
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* Default route to Login */}
//         <Route
//           path="/"
//           element={
//             !isAuthenticated ? (
//               <Login onLogin={handleLogin} />
//             ) : (
//               <Navigate to="/dashboard" />
//             )
//           }
//         />

//         {/* Protected route for Main (Dashboard with nested components) */}
//         <Route
//           path="/dashboard"
//           element={
//             isAuthenticated ? (
//               <Layout>
//                 <Main /> {/* This includes DashboardStates and Chart */}
//               </Layout>
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

//         {/* RoleCreate page inside Layout */}
//         <Route
//           path="/role-create"
//           element={
//             isAuthenticated ? (
//               <Layout>
//                 <RoleCreate />
//               </Layout>
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

//         {/* Properties List page inside Layout */}
//         <Route
//           path="/properties-list"
//           element={
//             isAuthenticated ? (
//               <Layout>
//                 <PropertiesListPage />
//               </Layout>
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

//         <Route
//           path="/user-management"
//           element={
//             isAuthenticated ? (
//               <Layout>
//                 <UserManagement />
//               </Layout>
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

//         <Route
//           path="/owner-list"
//           element={
//             isAuthenticated ? (
//               <Layout>
//                 <OwnerList />
//               </Layout>
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

//         {/* LeaseExpired page */}
//         <Route
//           path="/lease-expired"
//           element={
//             isAuthenticated ? (
//               <Layout>
//                 <LeaseTable />
//               </Layout>
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

//         {/* Tenant List page inside Layout */}
//         <Route
//           path="/tenant-list"
//           element={
//             isAuthenticated ? (
//               <Layout>
//                 <TenantList />
//               </Layout>
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

//         <Route
//           path="/maintenance-list"
//           element={
//             isAuthenticated ? (
//               <Layout>
//                 <MaintenanceList />
//               </Layout>
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

//         <Route
//           path="/property-alloted-list"
//           element={
//             isAuthenticated ? (
//               <Layout>
//                 <PropertyApprovedList />
//               </Layout>
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

//         <Route
//           path="/tenant-request"
//           element={
//             isAuthenticated ? (
//               <Layout>
//                 <TenantRequests />
//               </Layout>
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

//         <Route
//           path="/message"
//           element={
//             isAuthenticated ? (
//               <Layout>
//                 <MessageApp />
//               </Layout>
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

// <Route
//           path="/dashboard"
//           element={
//             isAuthenticated ? (
//               <Layout>
//                 <Main />
//               </Layout>
//             ) : (
//               <Navigate to="/" />
//             )
//           }
//         />

//         {/* Catch-all route for 404 */}
//         <Route path="*" element={<div>404 Page Not Found</div>} />
//       </Routes>
//     </Router>
//   );
// };

// export default AppRouting;




import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../LayoutPage/Layout";
import RoleCreate from "../pages/Admin_Panel/RoleCreate";
import Login from "../pages/Login";
import Main from "../MainDashboard/Main";
import PropertiesListPage from "../pages/Admin_Panel/PropertiesList";
import LeaseTable from "../pages/Admin_Panel/LeaseExpired";
import TenantList from "../pages/Admin_Panel/TenantList";
import PropertyApprovedList from "../pages/Admin_Panel/PropertyAlooted";
import TenantRequests from "../pages/Admin_Panel/TenantRequest";
import MessageApp from "../pages/Admin_Panel/Message/AllUser";
import UserManagement from "../pages/Admin_Panel/UserManagement";
import OwnerList from "../pages/Admin_Panel/OwnerList";
import MaintenanceList from "../pages/Admin_Panel/MaintenanceList";
import PrivateRoute from "../components/PrivateRoute"; // Import the PrivateRoute component

const AppRouting = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token); // Simplified check for token existence
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
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

        {/* Protected Routes */}
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
          path="/owner-list"
          element={
            <PrivateRoute>
              <Layout>
                <OwnerList />
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
          path="/tenant-list"
          element={
            <PrivateRoute>
              <Layout>
                <TenantList />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/maintenance-list"
          element={
            <PrivateRoute>
              <Layout>
                <MaintenanceList />
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
        {/* 404 Route */}
        <Route path="*" element={<div>404 Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRouting;

