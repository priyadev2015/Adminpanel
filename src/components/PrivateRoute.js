import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken"); // Check token on each render

  return authToken ? children : <Navigate to="/" />;
};

export default PrivateRoute;
