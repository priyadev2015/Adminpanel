import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../config/ServiceApi';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  CircularProgress,
  Typography,
  Box,
  TablePagination,
} from '@mui/material';

const TenantList = () => {
  const [tenantList, setTenantList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchTenantList = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('No token found. Please log in again.');
          return;
        }

        const response = await fetch(`${api.baseURL}${api.tenantlist}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tenant list');
        }

        const data = await response.json();
        setTenantList(data.tenantList); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantList();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" mt={2} gutterBottom>
        Tenant List
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Tenant Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Contact</strong></TableCell>
              <TableCell><strong>Lease Start</strong></TableCell>
              <TableCell><strong>Lease End</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenantList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) 
              .map((tenant) => (
                <TableRow key={tenant.requestId}>
                  <TableCell>{tenant.tenantName}</TableCell>
                  <TableCell>{tenant.tenantEmail}</TableCell>
                  <TableCell>{tenant.tenantContact}</TableCell>
                  <TableCell>{tenant.leaseStart}</TableCell>
                  <TableCell>{tenant.leaseEnd}</TableCell>
                  <TableCell>{tenant.status}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]} 
        component="div"
        count={tenantList.length} 
        rowsPerPage={rowsPerPage}
        page={page} 
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage} 
      />
    </Box>
  );
};

export default TenantList;
