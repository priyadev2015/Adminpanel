import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'; 
import axios from 'axios'; 
import config from '../config/ServiceApi';
import { toast } from 'react-toastify'; 
import Loader from './../components/Loader/Loader'; 

const DashboardStates = () => {

  const [metrics, setMetrics] = useState([
    { title: 'Total Properties', value: 0 },
    { title: 'Total Tenants', value: 0 },
    { title: 'Total Expired lease', value: 0 },
    { title: 'Total Active lease', value: 0 },
  ]);
<<<<<<< HEAD
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
=======


  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
    
>>>>>>> 29f169d43448e5c13ab3a4eae8688a2d077404a7
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          toast.error('No token found. Please log in again.');
          return;
        }
<<<<<<< HEAD
=======

    
>>>>>>> 29f169d43448e5c13ab3a4eae8688a2d077404a7
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
<<<<<<< HEAD
=======

>>>>>>> 29f169d43448e5c13ab3a4eae8688a2d077404a7
        setMetrics([
          { title: 'Total Properties', value: propertiesResponse.data.totalProperties },
          { title: 'Total Tenants', value: tenantsResponse.data.totalTenants },
          { title: 'Total Expired Lease', value: expiredLeasesResponse.data.expiredLeasesCount },
          { title: 'Total Active Lease', value: nonexpiredLeasesResponse.data.nonExpiredLeasesCount },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data: ' + error.message);
        setLoading(false); // Set loading to false in case of error
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
                border: '1px solid rgba(0, 0, 0, 0.12)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: 6,
                  borderColor: 'primary.main',
                },
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  height: '100%',
                }}
              >
                <Typography
                  gutterBottom
                  sx={{
                    color: 'text.secondary',
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}
                >
                  {metric.title}
                </Typography>

                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'success.main',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: 24,
                    fontWeight: '600',
                    marginBottom: 2,
                  }}
                >
                  {metric.value}
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
