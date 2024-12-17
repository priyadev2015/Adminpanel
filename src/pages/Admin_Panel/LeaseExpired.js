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
import api from "../../config/ServiceApi";
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

        const response = await axios.get(`${api.baseURL}${api.leaseExpred}`, {
          params: {
            page: page + 1,
            limit: rowsPerPage,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
        // <TableContainer component={Paper}>
        //   <Table>
        //     <TableHead>
        //       <TableRow   sx={{
        //               backgroundColor:  '#f9f9f9'

        //             }}>
        //         <TableCell>
        //           <b>Tenant Name</b>
        //         </TableCell>
        //         <TableCell>
        //           <b>Email</b>
        //         </TableCell>
        //         <TableCell>
        //           <b>Contact Number</b>
        //         </TableCell>
        //         <TableCell>
        //           <b>Property Name</b>
        //         </TableCell>
        //         <TableCell>
        //           <b>Property Address</b>
        //         </TableCell>
        //         <TableCell>
        //           <b>Square Footage</b>
        //         </TableCell>
        //         <TableCell>
        //           <b>Rent</b>
        //         </TableCell>
        //         <TableCell>
        //           <b>Security Deposit</b>
        //         </TableCell>
        //         <TableCell>
        //           <b>Payment Due Date</b>
        //         </TableCell>
        //         <TableCell>
        //           <b>Landlord Contact</b>
        //         </TableCell>
        //         <TableCell>
        //           <b>Lease Start Date</b>
        //         </TableCell>
        //         <TableCell>
        //           <b>Lease End Date</b>
        //         </TableCell>
        //         <TableCell>
        //           <b>Action</b>
        //         </TableCell>
        //       </TableRow>
        //     </TableHead>
        //     <TableBody>
        //       {filteredLeases.length > 0 ? (
        //         filteredLeases.map((lease, index) => (
        //           <TableRow key={index}   sx={{
        //             backgroundColor: index % 0 === 0 ? '#f9f9f9' : '#fff',
        //             '&:hover': { backgroundColor: '#eaeaea' },
        //           }}>
        //             <TableCell>
        //               {lease.tenantInformation?.fullname || "N/A"}
        //             </TableCell>
        //             <TableCell>
        //               {lease.tenantInformation?.email || "N/A"}
        //             </TableCell>
        //             <TableCell>
        //               {lease.tenantInformation?.contactNumber || "N/A"}
        //             </TableCell>

        //             <TableCell>
        //               {lease.propertyDetails?.name || "N/A"}
        //             </TableCell>
        //             <TableCell>
        //               {lease.propertyDetails?.address || "N/A"}
        //             </TableCell>
        //             <TableCell>
        //               {lease.propertyDetails?.squareFootage || "N/A"}
        //             </TableCell>
        //             <TableCell>
        //               {lease.propertyDetails?.rent || "N/A"}
        //             </TableCell>
        //             <TableCell>
        //               {lease.propertyDetails?.securityDeposit || "N/A"}
        //             </TableCell>
        //             <TableCell>
        //               {new Date(lease.paymentDueDate).toLocaleDateString()}
        //             </TableCell>
        //             <TableCell>
        //               {lease.landlordContactInformation || "N/A"}
        //             </TableCell>
        //             <TableCell>
        //               {new Date(lease.leaseStartDate).toLocaleDateString()}
        //             </TableCell>
        //             <TableCell>
        //               {new Date(lease.leaseEndDate).toLocaleDateString()}
        //             </TableCell>
        //             <TableCell>
        //               <IconButton onClick={() => handleOpenModal(lease)}>
        //                 <VisibilityIcon sx={{ color: "green" }} />
        //               </IconButton>
        //             </TableCell>
        //           </TableRow>
        //         ))
        //       ) : (
        //         <TableRow>
        //           <TableCell colSpan={13} align="center">
        //             No data available
        //           </TableCell>
        //         </TableRow>
        //       )}
        //     </TableBody>
        //   </Table>
        // </TableContainer>
        <TableContainer component={Paper}>
          <Table
            sx={{
              border: "1px solid #ddd", // Outer border for the table
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#f9f9f9",
                  textTransform: "capitalize",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <TableCell
                  sx={{
                    border: "1px solid #ddd",
                  }}
                >
                  <b>Tenant Name</b>
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #ddd", textAlign: "center" }}
                >
                  <b>Email</b>
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  <b>Contact Number</b>
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  <b>Property Name</b>
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  <b>Property Address</b>
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  <b>Square Footage</b>
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  <b>Rent</b>
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  <b>Security Deposit</b>
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  <b>Payment Due Date</b>
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  <b>Landlord Contact</b>
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  <b>Lease Start Date</b>
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  <b>Lease End Date</b>
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd" }}>
                  <b>Action</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeases.length > 0 ? (
                filteredLeases.map((lease, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": { backgroundColor: "#eaeaea" },
                    }}
                  >
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      {lease.tenantInformation?.fullname || "N/A"}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      {lease.tenantInformation?.email || "N/A"}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      {lease.tenantInformation?.contactNumber || "N/A"}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      {lease.propertyDetails?.name || "N/A"}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      {lease.propertyDetails?.address || "N/A"}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      {lease.propertyDetails?.squareFootage || "N/A"}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      {lease.propertyDetails?.rent || "N/A"}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      {lease.propertyDetails?.securityDeposit || "N/A"}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      {new Date(lease.paymentDueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      {lease.landlordContactInformation || "N/A"}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      {new Date(lease.leaseStartDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      {new Date(lease.leaseEndDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      <IconButton onClick={() => handleOpenModal(lease)}>
                        <VisibilityIcon sx={{ color: "green" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={13}
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
<Dialog open={openModal} onClose={handleCloseModal} fullWidth>
  <DialogTitle style={{ fontWeight: "bold", textAlign: "center" }}>
    Lease Information
  </DialogTitle>
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
            value: selectedLease.tenantInformation?.contactNumber || "N/A",
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
            value: selectedLease.propertyDetails?.securityDeposit || "N/A",
          },
          {
            label: "Payment Due Date",
            value: selectedLease.paymentDueDate
              ? new Date(selectedLease.paymentDueDate).toLocaleDateString()
              : "N/A",
          },
          {
            label: "Landlord Contact",
            value: selectedLease.landlordContactInformation || "N/A",
          },
          {
            label: "Lease Start Date",
            value: selectedLease.leaseStartDate
              ? new Date(selectedLease.leaseStartDate).toLocaleDateString()
              : "N/A",
          },
          {
            label: "Lease End Date",
            value: selectedLease.leaseEndDate
              ? new Date(selectedLease.leaseEndDate).toLocaleDateString()
              : "N/A",
          },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              padding: "10px 15px",
              backgroundColor: index % 0=== 0 ? "#f9f9f9":"#f9f9f9",
              borderRadius: "4px",
              marginBottom: "8px", 
            }}
          >
            <Typography
              variant="body1"
              style={{ fontWeight: "bold", color: "#000" }}
            >
              {item.label}:
            </Typography>
            <Typography
              variant="body1"
              style={{
                color: "#333",
                textAlign: "right",
                fontWeight: "500",
              }}
            >
              {item.value}
            </Typography>
          </div>
        ))}
      </div>
    ) : (
      <Typography>No lease details available</Typography>
    )}
  </DialogContent>
  <DialogActions style={{ justifyContent: "center", paddingBottom: "16px" }}>
    <Button
      onClick={handleCloseModal}
      variant="contained"
      color="primary"
      size="small"
      style={{ textTransform: "capitalize", padding: "6px 20px", fontSize:"15px", width:"120px"}}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>


    </div>
  );
};

export default LeaseTable;
