import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Grid,
  Snackbar,
  Button,
  TablePagination,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Box,
} from "@mui/material";
import { Alert } from "@mui/lab";
import { Delete, Visibility } from "@mui/icons-material";
import config from "../../config/ServiceApi";

const TenantRequests = () => {
  const [tenantRequests, setTenantRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchTenantRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("No token found. Please log in again.");
          return;
        }
        let url = `https://propertymanagement-nf5c.onrender.com/api${config.tenantrequest}`;
        const params = {
          page: page + 1,
          limit: rowsPerPage,
        };

        const response = await axios.get(url, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { tenantRequestsWithPropertyDetails, pagination } = response.data;

        setTenantRequests(tenantRequestsWithPropertyDetails);
        setTotalItems(pagination.totalItems);
      } catch (error) {
        setError("Error fetching tenant requests");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTenantRequests();
  }, [page, rowsPerPage]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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

  const filteredRequests = tenantRequests.filter((request) => {
    const tenantName = request.userId.fullname.toLowerCase();
    const tenantEmail = request.userId.email.toLowerCase();
    const searchTerm = searchQuery.toLowerCase();
    return tenantName.includes(searchTerm) || tenantEmail.includes(searchTerm);
  });

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedRequest(null);
  };

  const handleDeleteRequest = async () => {
    if (!selectedRequest) {
      toast.error("No request selected for deletion");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const response = await axios.delete(
        `${config.baseURL}${config.tenantrequest}/${selectedRequest._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          response.data.message || "Tenant request deleted successfully!"
        );
        setTenantRequests((prevRequests) =>
          prevRequests.filter((req) => req._id !== selectedRequest._id)
        );
      } else {
        toast.error("Failed to delete tenant request");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to delete tenant request"
      );
    } finally {
      setOpenDeleteDialog(false);
      setSelectedRequest(null);
    }
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ marginTop: "90px", alignItems: "center", display: "flow" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ display: "flex", justifyContent: "center" }}
      >
        Tenant Requests
      </Typography>

      {/* Search Bar */}
      <div
        style={{ display: "flex", justifyContent: "end", marginBottom: "20px" }}
      >
        <TextField
          label="Search by Tenant Name or Email"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          style={{ width: "450px" }}
        />
      </div>

      {error && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} md={10}>
          <TableContainer component={Paper}>
            <Table aria-label="tenant requests table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Tenant Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Email</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Contact No</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Property ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Lease Status</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Lease Start Date</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Lease End Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Area</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>{request.userId.fullname}</TableCell>
                      <TableCell>{request.userId.email}</TableCell>
                      <TableCell>
                        {request.userId.contactNumber || "N/A"}
                      </TableCell>
                      <TableCell>{request.propertyId}</TableCell>
                      <TableCell>{request.status}</TableCell>
                      <TableCell>{request.leaseStatus}</TableCell>
                      <TableCell>
                        {new Date(request.leaseStartDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(request.leaseEndDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(request.createdAt).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>{request.area}</TableCell>
                      <TableCell className="d-flex">
                        <Tooltip title="View Details">
                          <IconButton
                            onClick={() => handleViewDetails(request)}
                          >
                            <Visibility sx={{ color: "green" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Request">
                          <IconButton
                            onClick={() => {
                              setSelectedRequest(request);
                              setOpenDeleteDialog(true);
                            }}
                          >
                            <Delete sx={{ color: "red" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalItems} // Count the filtered data
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>

      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>
          Tenant Request Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedRequest ? (
            <Box
              style={{
                padding: "16px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#f9f9f9",
              }}
            >
              <Typography variant="body1" style={{ marginBottom: "5px" }}>
                <strong>Full Name:</strong>{" "}
                {selectedRequest?.userId?.fullname || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "5px" }}>
                <strong>Email:</strong>{" "}
                {selectedRequest?.userId?.email || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "5px" }}>
                <strong>Contact Number:</strong>{" "}
                {selectedRequest?.userId?.contactNumber || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "5px" }}>
                <strong>Property ID:</strong>{" "}
                {selectedRequest?.propertyId || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "5px" }}>
                <strong>Status:</strong> {selectedRequest?.status || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "5px" }}>
                <strong>Lease Status:</strong>{" "}
                {selectedRequest?.leaseStatus || "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "5px" }}>
                <strong>Lease Start Date:</strong>{" "}
                {selectedRequest?.leaseStartDate
                  ? new Date(
                      selectedRequest.leaseStartDate
                    ).toLocaleDateString()
                  : "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "5px" }}>
                <strong>Lease End Date:</strong>{" "}
                {selectedRequest?.leaseEndDate
                  ? new Date(selectedRequest.leaseEndDate).toLocaleDateString()
                  : "N/A"}
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "5px" }}>
                <strong>Area:</strong> {selectedRequest?.area || "N/A"}
              </Typography>
            </Box>
          ) : (
            <Typography>No data available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Are you sure you want to delete this tenant request?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteRequest} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TenantRequests;
