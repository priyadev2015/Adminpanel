import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, CircularProgress, Typography, Box } from '@mui/material';

const MaintenanceList = () => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://propertymanagement-nf5c.onrender.com/api/tenant-requests/owners-and-tenants', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setMaintenanceData(response.data.maintenance);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Typography variant="h5" sx={{ marginTop: '100px', textAlign: 'center' }}>
        Maintenance list
      </Typography>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr. No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maintenanceData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((request, index) => (
                <TableRow key={request.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>{request.email}</TableCell>
                  <TableCell>{request.contact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={maintenanceData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </div>
  );
};

export default MaintenanceList;
