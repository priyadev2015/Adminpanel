// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import api from '../../config/ServiceApi'; // Import your config file
// import {
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableContainer,
//   Paper,
//   Typography,
//   Box,
//   CircularProgress,
//   TablePagination,
// } from '@mui/material';

// const PropertyApprovedList = () => {
//   const [approvedList, setApprovedList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Pagination state
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

//   useEffect(() => {
//     const fetchApprovedList = async () => {
//       try {
//         const token = localStorage.getItem('authToken');
//         if (!token) {
//           toast.error('No token found. Please log in again.');
//           return;
//         }

//         const response = await fetch(
//           `${api.baseURL}${api.tenantpropertyapprovedbyowner}`,
//           {
//             method: 'GET',
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           throw new Error('Failed to fetch approved property list');
//         }

//         const data = await response.json();
//         setApprovedList(data.approvedRequests); // Assuming API returns data with approvedRequests key
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApprovedList();
//   }, []);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0); // Reset to the first page
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ textAlign: 'center', marginTop: 4 }}>
//         <Typography variant="h6" color="error">
//           Error: {error}
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ padding: 6 }}>
//       <Typography variant="h4" align="center" mt={2} gutterBottom>
//         Approved Property List
//       </Typography>
//       <TableContainer component={Paper} elevation={3}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell><strong>Property Name</strong></TableCell>
//               <TableCell><strong>Address</strong></TableCell>
//               <TableCell><strong>Owner Name</strong></TableCell>
//               <TableCell><strong>Owner Email</strong></TableCell>
//               <TableCell><strong>Lease Start</strong></TableCell>
//               <TableCell><strong>Lease End</strong></TableCell>
//               <TableCell><strong>Status</strong></TableCell>
//               <TableCell><strong>Tenant Name</strong></TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {approvedList
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Paginate rows
//               .map((property, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{property.propertyName}</TableCell>
//                   <TableCell>{property.propertyAddress}</TableCell>
//                   <TableCell>{property.ownerName}</TableCell>
//                   <TableCell>{property.ownerEmail}</TableCell>
//                   <TableCell>{property.leaseStart}</TableCell>
//                   <TableCell>{property.leaseEnd}</TableCell>
//                   <TableCell>{property.status}</TableCell>
//                   <TableCell>{property.tenantName || 'N/A'}</TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[5, 10, 15]}
//         component="div"
//         count={approvedList.length} // Total number of rows
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Box>
//   );
// };

// export default PropertyApprovedList;





import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../config/ServiceApi'; // Import your config file
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Box,
  CircularProgress,
  TablePagination,
  TextField,
  IconButton,
  Modal,
  Fade,
  Backdrop,
  Grid,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

const PropertyApprovedList = () => {
  const [approvedList, setApprovedList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const fetchApprovedList = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          toast.error('No token found. Please log in again.');
          return;
        }

        const response = await fetch(
          `${api.baseURL}${api.tenantpropertyapprovedbyowner}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch approved property list');
        }

        const data = await response.json();
        setApprovedList(data.approvedRequests); // Assuming API returns data with approvedRequests key
        setFilteredList(data.approvedRequests);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedList();
  }, []);

  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    filterList(event.target.value);
  };

  // Filter list based on search term
  const filterList = (term) => {
    const lowercasedTerm = term.toLowerCase();
    const filtered = approvedList.filter(
      (property) =>
        property.propertyName.toLowerCase().includes(lowercasedTerm) ||
        property.ownerName.toLowerCase().includes(lowercasedTerm) ||
        property.propertyAddress.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredList(filtered);
  };

  // Handle modal open and close
  const handleModalOpen = (property) => {
    setSelectedProperty(property);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedProperty(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
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
    <Box sx={{ padding: 6 }}>
      <Typography variant="h4" align="center" mt={2} gutterBottom>
        Approved Property 
      </Typography>
      
      {/* Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '20px' }}>
      <TextField
        label="Search by Property Name, Owner Name, or Address"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ width:"450px",}}
      />
      </div>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Property Name</strong></TableCell>
              <TableCell><strong>Address</strong></TableCell>
              <TableCell><strong>Owner Name</strong></TableCell>
              <TableCell><strong>Owner Email</strong></TableCell>
              <TableCell><strong>Lease Start</strong></TableCell>
              <TableCell><strong>Lease End</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Tenant Name</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell> {/* Action Column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((property, index) => (
                <TableRow key={index}>
                  <TableCell>{property.propertyName}</TableCell>
                  <TableCell>{property.propertyAddress}</TableCell>
                  <TableCell>{property.ownerName}</TableCell>
                  <TableCell>{property.ownerEmail}</TableCell>
                  <TableCell>{property.leaseStart}</TableCell>
                  <TableCell>{property.leaseEnd}</TableCell>
                  <TableCell>{property.status}</TableCell>
                  <TableCell>{property.tenantName || 'N/A'}</TableCell>
                  <TableCell>
                    {/* Action Button to View */}
                    <IconButton onClick={() => handleModalOpen(property)}>
                      <VisibilityIcon sx={{color:"green"}} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal for Property Details */}
      <Modal
        open={openModal}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openModal}>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            backgroundColor: 'white', 
            padding: 4, 
            boxShadow: 24,
            maxWidth: 500, 
            width: '100%'
          }}>
            {selectedProperty && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6">Property Details</Typography>
                </Grid>
                <Grid item xs={12}><strong>Property Name:</strong> {selectedProperty.propertyName}</Grid>
                <Grid item xs={12}><strong>Address:</strong> {selectedProperty.propertyAddress}</Grid>
                <Grid item xs={12}><strong>Owner Name:</strong> {selectedProperty.ownerName}</Grid>
                <Grid item xs={12}><strong>Owner Email:</strong> {selectedProperty.ownerEmail}</Grid>
                <Grid item xs={12}><strong>Lease Start:</strong> {selectedProperty.leaseStart}</Grid>
                <Grid item xs={12}><strong>Lease End:</strong> {selectedProperty.leaseEnd}</Grid>
                <Grid item xs={12}><strong>Status:</strong> {selectedProperty.status}</Grid>
                <Grid item xs={12}><strong>Tenant Name:</strong> {selectedProperty.tenantName || 'N/A'}</Grid>
                <Grid item xs={12} mt={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button style={{color:"red"}} onClick={handleModalClose}>Close</button>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default PropertyApprovedList;
