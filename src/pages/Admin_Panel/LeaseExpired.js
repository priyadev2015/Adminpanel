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
} from "@mui/material";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import config from "../../config/ServiceApi";
import { Button } from "@mui/material";

const LeaseTable = () => {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false); // State for opening modal
  const [selectedLease, setSelectedLease] = useState(null); // State for selected lease information

  // Fetch data
  useEffect(() => {
    const fetchLeases = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("No token found. Please log in again.");
          return;
        }

        const response = await axios.get(
          `${config.baseURL}${config.leaseExpred}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setLeases(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leases:", error);
        toast.error("Error fetching lease data: " + error.message);
        setLoading(false);
      }
    };

    fetchLeases();
  }, []);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter leases based on the search query for tenant name and property name
  const filteredLeases = leases.filter((lease) => {
    const tenantName = lease.tenantInformation?.fullname.toLowerCase() || "";
    const propertyName = lease.propertyDetails?.name.toLowerCase() || "";
    const searchTerm = searchQuery.toLowerCase();
    return tenantName.includes(searchTerm) || propertyName.includes(searchTerm);
  });

  // Get the data for the current page
  const currentLeases = filteredLeases.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle modal open and close
  const handleOpenModal = (lease) => {
    setSelectedLease(lease); // Set the selected lease data
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
                  <b>Lease Start Date</b>
                </TableCell>
                <TableCell>
                  <b>Lease End Date</b>
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
                  <b>Action</b>
                </TableCell>{" "}
                {/* New Action column */}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentLeases.length > 0 ? (
                currentLeases.map((lease, index) => (
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
                      {new Date(lease.leaseStartDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(lease.leaseEndDate).toLocaleDateString()}
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

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredLeases.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal for viewing lease information */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md">
        <DialogTitle>Lease Information</DialogTitle>
        <DialogContent dividers>
          {selectedLease ? (
            <div style={{ marginBottom: "20px" }}>
              <Typography variant="h6">
                Tenant Name:{" "}
                {selectedLease.tenantInformation?.fullname || "N/A"}
              </Typography>
              <Typography>
                Email: {selectedLease.tenantInformation?.email || "N/A"}
              </Typography>
              <Typography>
                Contact Number:{" "}
                {selectedLease.tenantInformation?.contactNumber || "N/A"}
              </Typography>
              <Typography>
                Lease Start Date:{" "}
                {new Date(selectedLease.leaseStartDate).toLocaleDateString()}
              </Typography>
              <Typography>
                Lease End Date:{" "}
                {new Date(selectedLease.leaseEndDate).toLocaleDateString()}
              </Typography>
              <Typography>
                Property Name: {selectedLease.propertyDetails?.name || "N/A"}
              </Typography>
              <Typography>
                Property Address:{" "}
                {selectedLease.propertyDetails?.address || "N/A"}
              </Typography>
              <Typography>
                Square Footage:{" "}
                {selectedLease.propertyDetails?.squareFootage || "N/A"}
              </Typography>
              <Typography>
                Rent: {selectedLease.propertyDetails?.rent || "N/A"}
              </Typography>
              <Typography>
                Security Deposit:{" "}
                {selectedLease.propertyDetails?.securityDeposit || "N/A"}
              </Typography>
              <Typography>
                Payment Due Date:{" "}
                {new Date(selectedLease.paymentDueDate).toLocaleDateString()}
              </Typography>
              <Typography>
                Landlord Contact:{" "}
                {selectedLease.landlordContactInformation || "N/A"}
              </Typography>
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
