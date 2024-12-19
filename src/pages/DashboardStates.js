
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid"; 
import axios from "axios"; 
import config from "../config/ServiceApi";
import { toast } from "react-toastify"; 
import Loader from "./../components/Loader/Loader"; 
import { House, People, Archive, CheckCircle } from "@mui/icons-material";

const DashboardStates = () => {
  const [metrics, setMetrics] = useState([
    { title: "Total Properties", value: 0, icon: <House />, bgColor: "#118cb3" },
    { title: "Total Tenants", value: 0, icon: <People />, bgColor: "#417841" },
    { title: "Total Expired Lease", value: 0, icon: <Archive />, bgColor: "#777756" },
    { title: "Total Active Lease", value: 0, icon: <CheckCircle />, bgColor: "#c1737f" },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          toast.error("No token found. Please log in again.");
          return;
        }

        const [
          propertiesResponse,
          tenantsResponse,
          expiredLeasesResponse,
          nonexpiredLeasesResponse,
        ] = await Promise.all([
          axios.get(`${config.baseURL}${config.propertiesCount}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${config.baseURL}${config.totalCounts}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${config.baseURL}${config.expiredLease}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${config.baseURL}${config.nonexpiredLease}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setMetrics([
          {
            title: "Total Properties",
            value: propertiesResponse.data.totalProperties,
            icon: <House />,
            bgColor: "#118cb3",
          },
          {
            title: "Total Tenants",
            value: tenantsResponse.data.totalTenants,
            icon: <People />,
            bgColor: "#417841",
          },
          {
            title: "Total Expired Lease",
            value: expiredLeasesResponse.data.expiredLeasesCount,
            icon: <Archive />,
            bgColor: "#777756",
          },
          {
            title: "Total Active Lease",
            value: nonexpiredLeasesResponse.data.nonExpiredLeasesCount,
            icon: <CheckCircle />,
            bgColor: "#c1737f",
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data: " + error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ flexGrow: 1, mt: 8, px: 3 }}>
    <Grid container spacing={3}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card
            variant="outlined"
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              border: `1px solid rgba(0, 0, 0, 0.12)`,
              backgroundColor: metric.bgColor, 
              transition: "all 0.3s ease",
             "&:hover": {
      boxShadow: 10, 
      borderColor: "#118cb3bd.main", 
      backgroundColor: "#118cb3bd", 
      color: "black", 
    },
              width: "100%",
            }}
          >
           <CardContent
  sx={{
    display: "flex",
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center",
    padding: 1, 
    height: "150px", 
  }}
>
  <Box
    sx={{
      borderRadius: "50%",
      padding: 1, 
      color: "white",
      fontSize: "80px", 
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 1, 
    }}
  >
    {React.cloneElement(metric.icon, { sx: { fontSize: "60px" } })} 
  </Box>

  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      alignItems: "center",
    }}
  >
    <Typography
      sx={{
        color: "white", 
        fontSize: 14, 
        fontWeight: "bold",
        textAlign: "left",
        flex: 1, 
      }}
    >
      {metric.title}
    </Typography>

    <Box
      sx={{
        width: 40, 
        height: 40, 
        borderRadius: "50%",
        backgroundColor: "white", 
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "black", 
        fontSize: 16, 
        fontWeight: "600",
      }}
    >
      {metric.value}
    </Box>
  </Box>
</CardContent>

          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
  
  );
};

export default DashboardStates;
