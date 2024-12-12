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
  CircularProgress,
  Typography,
  TablePagination,
} from "@mui/material";

const OwnerList = () => {
  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    axios
      .get("https://propertymanagement-nf5c.onrender.com/api/auth/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        console.log("API Response Data:", response.data);
        setOwners(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Error fetching data");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (Array.isArray(owners)) {
      const validRoles = ["owner"];
      const validOwners = owners.filter((user) => {
        const role = user?.role ? user.role.toLowerCase() : "";
        return validRoles.includes(role);
      });
      setFilteredOwners(validOwners);
    } else {
      setError("Invalid data structure");
      setLoading(false);
    }
  }, [owners]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <Typography variant="h5" gutterBottom>
        Owner List
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="owner list">
          <TableHead>
            <TableRow>
              <TableCell>Sr. No.</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact No.</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOwners.length > 0 ? (
              filteredOwners
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((owner, index) => (
                  <TableRow key={owner._id}>
                    <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                    <TableCell>{owner.fullname}</TableCell>
                    <TableCell>{owner.email}</TableCell>
                    <TableCell>{owner.contactNumber || "N/A"}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No valid owners found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOwners.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default OwnerList;
