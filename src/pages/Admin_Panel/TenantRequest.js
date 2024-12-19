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
  Box,
  TableSortLabel,
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
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("fullname");

  useEffect(() => {
    const fetchTenantRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("No token found. Please log in again.");
          return;
        }
        let url = `${config.baseURL}${config.tenantrequest}`;
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

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (array) => {
    const comparator = (a, b) => {
      if (orderBy === "fullname") {
        return (
          (a.userId.fullname > b.userId.fullname ? 1 : -1) *
          (order === "asc" ? 1 : -1)
        );
      }
      if (orderBy === "email") {
        return (
          (a.userId.email > b.userId.email ? 1 : -1) *
          (order === "asc" ? 1 : -1)
        );
      }
      if (orderBy === "createdAt") {
        return (
          (new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1) *
          (order === "asc" ? 1 : -1)
        );
      }
      return 0;
    };
    return array.sort(comparator);
  };

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

  const sortedRequests = sortData(filteredRequests);

  return (
    <div style={{ marginTop: "90px", alignItems: "center", display: "flow" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ display: "flex", justifyContent: "center" }}
      >
        Tenant Requests
      </Typography>

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
                  {[
                    { label: "Tenant Name", field: "fullname" },
                    { label: "Email", field: "email" },
                    { label: "Contact No", field: "contactNumber" },
                    { label: "Property ID", field: "propertyId" },
                    { label: "Status", field: "status" },
                    { label: "Lease Status", field: "leaseStatus" },
                    { label: "Lease Start Date", field: "leaseStartDate" },
                    { label: "Lease End Date", field: "leaseEndDate" },
                    { label: "Date", field: "createdAt" },
                    { label: "Time", field: "createdAt" },
                    { label: "Area", field: "area" },
                  ].map(({ label, field }) => (
                    <TableCell
                      key={label}
                      sx={{
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                        border: "1px solid #ddd",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === field}
                        direction={orderBy === field ? order : "asc"}
                        onClick={() => handleSortRequest(field)}
                      >
                        {label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRequests.length > 0 ? (
                  sortedRequests.map((request) => (
                    <TableRow
                      key={request._id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(119, 119, 119, 0.1)",
                          boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.2)",
                        },
                      }}
                    >
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        {request.userId.fullname}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        {request.userId.email}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        {request.userId.contactNumber || "N/A"}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        {request.propertyId}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        {request.status}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        {request.leaseStatus}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        {new Date(request.leaseStartDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        {new Date(request.leaseEndDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        {new Date(request.createdAt).toLocaleTimeString()}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        {request.area}
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd" }}>
                        <div style={{ display: "flex" }}>
                          <IconButton
                            onClick={() => handleViewDetails(request)}
                          >
                            <Visibility sx={{ color: "green" }} />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setSelectedRequest(request);
                              setOpenDeleteDialog(true);
                            }}
                          >
                            <Delete sx={{ color: "red" }} />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      align="center"
                      sx={{ border: "1px solid #ddd" }}
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} fullWidth>
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}
        >
          Tenant Request Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedRequest ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                {
                  label: "Tenant Name",
                  value: selectedRequest.userId?.fullname,
                },
                { label: "Email", value: selectedRequest.userId?.email },
                {
                  label: "Contact No",
                  value: selectedRequest.userId?.contactNumber || "N/A",
                },
                {
                  label: "Property ID",
                  value: selectedRequest.propertyId || "N/A",
                },
                { label: "Status", value: selectedRequest.status || "N/A" },
                {
                  label: "Lease Status",
                  value: selectedRequest.leaseStatus || "N/A",
                },
                {
                  label: "Lease Start Date",
                  value: selectedRequest.leaseStartDate
                    ? new Date(
                        selectedRequest.leaseStartDate
                      ).toLocaleDateString()
                    : "N/A",
                },
                {
                  label: "Lease End Date",
                  value: selectedRequest.leaseEndDate
                    ? new Date(
                        selectedRequest.leaseEndDate
                      ).toLocaleDateString()
                    : "N/A",
                },
                {
                  label: "Date",
                  value: selectedRequest.createdAt
                    ? new Date(selectedRequest.createdAt).toLocaleDateString()
                    : "N/A",
                },
                {
                  label: "Time",
                  value: selectedRequest.createdAt
                    ? new Date(selectedRequest.createdAt).toLocaleTimeString()
                    : "N/A",
                },
                { label: "Area", value: selectedRequest.area || "N/A" },
              ].map(({ label, value }) => (
                <Box
                  key={label}
                  sx={{
                    padding: 1.5,
                    borderRadius: 1,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="body1" component="div">
                    <strong>{label}:</strong> {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography>No data available.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ position: "relative", right: "40%" }}>
          <Button
            onClick={handleCloseViewDialog}
            sx={{
              color: "white",
              border: "2px solid ",
              backgroundColor: "blue",
              textTransform: "capitalize",
              fontSize: "15px",
              width: "120px",
            }}
          >
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
