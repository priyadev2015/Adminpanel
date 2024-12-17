import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  TablePagination,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import api from '../../config/ServiceApi';
const LeaseTable = () => {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedLease, setSelectedLease] = useState(null);
  const [totalLeases, setTotalLeases] = useState(0);

  useEffect(() => {
    const fetchLeases = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("No token found. Please log in again.");
          return;
        }

        const response = await axios.get(
          `${api.baseURL}${api.leaseExpred}`,
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

        setLeases(response.data.leases);
        setTotalLeases(response.data.totalLeases);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leases:", error);
        toast.error("Error fetching lease data: " + error.message);
        setLoading(false);
      }
    };

    fetchLeases();
  }, [page, rowsPerPage]);

  const filteredLeases = leases.filter((lease) => {
    const tenantName = lease.tenantInformation?.fullname.toLowerCase() || "";
    const propertyName = lease.propertyDetails?.name.toLowerCase() || "";
    const searchTerm = searchQuery.toLowerCase();
    return tenantName.includes(searchTerm) || propertyName.includes(searchTerm);
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleOpenModal = (lease) => {
    setSelectedLease(lease);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedLease(null);
  };

  return (
    <div style={{ padding: "40px" }}>
      <Typography variant="h4" mt={3} align="center" gutterBottom>
        Lease Information
      </Typography>
      <div
        style={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}
      >
        <TextField
          label="Search by Tenant Name or Property Name"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ width: "500px" }}
        />
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Tenant Name</b>
                </TableCell>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell>
                  <b>Contact Number</b>
                </TableCell>
                <TableCell>
                  <b>Property Name</b>
                </TableCell>
                <TableCell>
                  <b>Property Address</b>
                </TableCell>
                <TableCell>
                  <b>Square Footage</b>
                </TableCell>
                <TableCell>
                  <b>Rent</b>
                </TableCell>
                <TableCell>
                  <b>Security Deposit</b>
                </TableCell>
                <TableCell>
                  <b>Payment Due Date</b>
                </TableCell>
                <TableCell>
                  <b>Landlord Contact</b>
                </TableCell>
                <TableCell>
                  <b>Lease Start Date</b>
                </TableCell>
                <TableCell>
                  <b>Lease End Date</b>
                </TableCell>
                <TableCell>
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeases.length > 0 ? (
                filteredLeases.map((lease, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {lease.tenantInformation?.fullname || "N/A"}
                    </TableCell>
                    <TableCell>
                      {lease.tenantInformation?.email || "N/A"}
                    </TableCell>
                    <TableCell>
                      {lease.tenantInformation?.contactNumber || "N/A"}
                    </TableCell>
                  
                    <TableCell>
                      {lease.propertyDetails?.name || "N/A"}
                    </TableCell>
                    <TableCell>
                      {lease.propertyDetails?.address || "N/A"}
                    </TableCell>
                    <TableCell>
                      {lease.propertyDetails?.squareFootage || "N/A"}
                    </TableCell>
                    <TableCell>
                      {lease.propertyDetails?.rent || "N/A"}
                    </TableCell>
                    <TableCell>
                      {lease.propertyDetails?.securityDeposit || "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(lease.paymentDueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {lease.landlordContactInformation || "N/A"}
                    </TableCell>
                    <TableCell>
                      {new Date(lease.leaseStartDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(lease.leaseEndDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenModal(lease)}>
                        <VisibilityIcon sx={{ color: "green" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={13} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box display="flex" justifyContent="end" alignItems="end" mt={2}>
      
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalLeases}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
       
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md">
        <DialogTitle>Lease Information</DialogTitle>
        <DialogContent dividers>
          {selectedLease ? (
            <div style={{ marginBottom: "20px" }}>
              {[
                {
                  label: "Tenant Name",
                  value: selectedLease.tenantInformation?.fullname || "N/A",
                },
                {
                  label: "Email",
                  value: selectedLease.tenantInformation?.email || "N/A",
                },
                {
                  label: "Contact Number",
                  value:
                    selectedLease.tenantInformation?.contactNumber || "N/A",
                },
               
                {
                  label: "Property Name",
                  value: selectedLease.propertyDetails?.name || "N/A",
                },
                {
                  label: "Property Address",
                  value: selectedLease.propertyDetails?.address || "N/A",
                },
                {
                  label: "Square Footage",
                  value: selectedLease.propertyDetails?.squareFootage || "N/A",
                },
                {
                  label: "Rent",
                  value: selectedLease.propertyDetails?.rent || "N/A",
                },
                {
                  label: "Security Deposit",
                  value:
                    selectedLease.propertyDetails?.securityDeposit || "N/A",
                },
                {
                  label: "Payment Due Date",
                  value: new Date(
                    selectedLease.paymentDueDate
                  ).toLocaleDateString(),
                },
                {
                  label: "Landlord Contact",
                  value: selectedLease.landlordContactInformation || "N/A",
                },
                {
                  label: "Lease Start Date",
                  value: new Date(
                    selectedLease.leaseStartDate
                  ).toLocaleDateString(),
                },
                {
                  label: "Lease End Date",
                  value: new Date(
                    selectedLease.leaseEndDate
                  ).toLocaleDateString(),
                },
              ].map((item, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  style={{ marginBottom: "10px" }}
                >
                  <strong>{item.label}: </strong>
                  {item.value}
                </Typography>
              ))}
            </div>
          ) : (
            <Typography>No lease details available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeaseTable;
