import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../config/ServiceApi";
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
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import axios from "axios";

const PropertyApprovedList = () => {
  const [approvedList, setApprovedList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRequests, setTotalRequests] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [searchTerm, setSearchTerm] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  useEffect(() => {
    const fetchApprovedList = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("No token found. Please log in again.");
          return;
        }

        const response = await axios.get(
          `${api.baseURL}${api.tenantpropertyapprovedbyowner}`,
          {
            params: {
              page: page + 1,
              limit: rowsPerPage,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response Data:", response.data);

        setApprovedList(response.data.approvedRequests);
        setFilteredList(response.data.approvedRequests);
        setTotalRequests(response.data.pagination.totalRequests);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedList();
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    filterList(event.target.value);
  };

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

  const handleModalOpen = (property) => {
    setSelectedProperty(property);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedProperty(null);
  };
  console.log("Current page:", page);
  console.log("Rows per page:", rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
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

      <div
        style={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}
      >
        <TextField
          label="Search by Property Name, Owner Name, or Address"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ width: "450px" }}
        />
      </div>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Property Name",
                "Address",
                "Owner Name",
                "Owner Email",
                "Lease Start",
                "Lease End",
                "Tenant Name",
                "Actions",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    border: "1px solid #ddd",
                    backgroundColor: "#f9f9f9",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredList.length > 0 ? (
              filteredList.map((property, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(119, 119, 119, 0.1)",
                    },
                  }}
                >
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {property.propertyName}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {property.propertyAddress}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {property.ownerName}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {property.ownerEmail}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {property.leaseStart}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {property.leaseEnd}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd" }}>
                    {property.tenantName || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      border: "1px solid #ddd",
                    }}
                  >
                    <IconButton onClick={() => handleModalOpen(property)}>
                      <VisibilityIcon sx={{ color: "green" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{ border: "1px solid #ddd" }}
                >
                  No properties found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalRequests}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal
        open={openModal}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: 4,
              boxShadow: 24,
              maxWidth: 600,
              width: "100%",
              borderRadius: 2,
              border: "1px solid #ddd",
            }}
          >
            {selectedProperty && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      marginBottom: 2,
                    }}
                  >
                    Approved Property Details
                  </Typography>
                </Grid>
                {[
                  {
                    label: "Property Name",
                    value: selectedProperty.propertyName,
                  },
                  { label: "Address", value: selectedProperty.propertyAddress },
                  { label: "Owner Name", value: selectedProperty.ownerName },
                  { label: "Owner Email", value: selectedProperty.ownerEmail },
                  { label: "Lease Start", value: selectedProperty.leaseStart },
                  { label: "Lease End", value: selectedProperty.leaseEnd },
                  {
                    label: "Tenant Name",
                    value: selectedProperty.tenantName || "N/A",
                  },
                ].map(({ label, value }) => (
                  <Grid
                    item
                    xs={12}
                    key={label}
                    sx={{
                      padding: 1.5,
                      borderRadius: 1,
                      backgroundColor: "#f9f9f9",
                      border: "1px solid #ddd",
                      marginBottom: 1,
                    }}
                  >
                    <Typography variant="body1">
                      <strong>{label}:</strong> {value}
                    </Typography>
                  </Grid>
                ))}
                <Grid item xs={12} mt={2}>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <button
                      style={{
                        color: "white",
                        backgroundColor: "blue",
                        border: "none",
                        fontSize: "15px",
                        width: "120px",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={handleModalClose}
                    >
                      Close
                    </button>
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
