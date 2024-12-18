import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  IconButton,
  TableContainer,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isRolesLoading, setIsRolesLoading] = useState(true);
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
    password: "",
    contactNumber: "",
    role: "",
  });
  const [formErrors, setFormErrors] = useState({
    fullname: "",
    contactNumber: "",
    password: "",
    role: "",
    email: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [page, rowsPerPage]);

  const fetchUsers = () => {
    const token = localStorage.getItem("authToken");
    axios
      .get("https://propertymanagement-nf5c.onrender.com/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: page + 1,
          limit: rowsPerPage,
        },
      })
      .then((response) => {
        setTotalUsers(response.data.pagination.totalUsers);
        setUsers(response.data.users);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users: " + error.message);
        setLoading(false);
      });
  };

  const fetchRoles = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Token is missing. Please log in again.");
      return;
    }
    axios
      .get("https://propertymanagement-nf5c.onrender.com/api/roles", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setRoles(response.data.roles);
        setIsRolesLoading(false);
        console.log("Fetched Roles:", response.data.roles);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        toast.error("Error fetching roles: " + error.message);
        setIsRolesLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateForm();
  };

  const handleCreateUser = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const token = localStorage.getItem("authToken");
      axios
        .post(
          "https://propertymanagement-nf5c.onrender.com/api/auth/register",
          userData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          toast.success("User created successfully");
          fetchUsers();
          handleCloseModal();
        })
        .catch((error) => {
          toast.error("Error creating user: " + error.message);
        });
    }
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();

    console.log("handleUpdateUser called");
    console.log("User Data before validation:", userData);

    if (validateForm()) {
      const updatedUser = {
        fullname: userData.fullname,
        contactNumber: userData.contactNumber,
        role: userData.role,
      };

      console.log("Updated User object:", updatedUser);

      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        toast.error("Token is missing. Please log in again.");
        return;
      }

      axios
        .put(
          `https://propertymanagement-nf5c.onrender.com/api/auth/users/${editUserId}`,
          updatedUser,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          console.log("Response from server:", response);
          toast.success("User updated successfully");
          fetchUsers();
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Error updating user:", error);
          toast.error("Error updating user: " + error.message);
        });
    } else {
      console.log("Form validation failed. Errors:", formErrors);
    }
  };

  const handleDeleteUser = (userId) => {
    const token = localStorage.getItem("authToken");
    axios
      .delete(
        `https://propertymanagement-nf5c.onrender.com/api/auth/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        toast.success("User deleted successfully");
        fetchUsers();
        setOpenDeleteDialog(false);
      })
      .catch((error) => {
        toast.error("Error deleting user: " + error.message);
        setOpenDeleteDialog(false);
      });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    filterList(event.target.value);
  };

  const filterList = (query) => {
    const lowercasedTerm = query.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.fullname.toLowerCase().includes(lowercasedTerm) ||
        user.email.toLowerCase().includes(lowercasedTerm) ||
        user.role.toLowerCase().includes(lowercasedTerm)
    );

    setFilteredUsers(filtered);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const validateForm = () => {
    console.log("Validating form...");
    const errors = {};

    if (!userData.fullname) {
      errors.fullname = "Full name is required.";
    } else if (userData.fullname.length < 4 || userData.fullname.length > 10) {
      errors.fullname = "Full name must be between 4 and 10 characters.";
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!userData.email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(userData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!userData.contactNumber) {
      errors.contactNumber = "Contact number is required.";
    } else if (userData.contactNumber.length !== 10) {
      errors.contactNumber = "Contact number must be exactly 10 digits.";
    } else if (!phoneRegex.test(userData.contactNumber)) {
      errors.contactNumber = "Contact number must only contain numbers.";
    }

    if (!userData.role) {
      errors.role = "Role is required.";
    }

    if (!editUserId) {
      if (!userData.password) {
        errors.password = "Password is required.";
      } else if (userData.password.length < 8) {
        errors.password = "Password must be at least 8 characters.";
      } else {
        const passwordRegex =
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(userData.password)) {
          errors.password =
            "Password must be at least 8 characters, including a letter, a number, and a special character.";
        }
      }
    }
    setFormErrors(errors);
    console.log("Form errors:", errors);

    return Object.keys(errors).length === 0;
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setUserData({
      fullname: "",
      email: "",
      password: "",
      contactNumber: "",
      role: "",
    });
    setFormErrors({});
  };
  const handleRoleChange = (e) => {
    setUserData({
      ...userData,
      role: e.target.value,
    });
  };
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setOpenViewModal(true);
  };

  const handleEditUser = (user) => {
    setEditUserId(user._id);
    setUserData({
      fullname: user.fullname,
      email: user.email,
      contactNumber: user.contactNumber,
      role: user.role,
    });
    setOpenModal(true);
  };

  const handleDeleteDialogOpen = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };
  return (
    <div>
      <Typography variant="h4" sx={{ textAlign: "center", marginTop: 10 }}>
        User Management
      </Typography>

      <div className="d-flex justify-content-between">
        <Button
          variant="contained"
          sx={{ marginBottom: 2 }}
          onClick={() => {
            setEditUserId(null);
            setOpenModal(true);
          }}
        >
          Create
        </Button>
        <TextField
          label="Search by Name, Email, or Role"
          variant="outlined"
          sx={{
            width: "300px",
            position: "relative",
            left: "650px",
            bottom: "10px",
          }}
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            padding: "20px",
            backgroundColor: "white",
            margin: "auto",
            marginTop: "100px",
            maxWidth: "400px",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {editUserId ? "Edit User" : "Create New User"}
          </Typography>
          <form onSubmit={editUserId ? handleUpdateUser : handleCreateUser}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              value={userData.fullname}
              onChange={handleInputChange}
              margin="normal"
              error={!!formErrors.fullname}
              helperText={formErrors.fullname}
              name="fullname"
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={userData.email}
              onChange={handleInputChange}
              margin="normal"
              disabled={!!editUserId}
              name="email"
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            {!editUserId && (
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                value={userData.password}
                onChange={handleInputChange}
                margin="normal"
                type="password"
                error={!!formErrors.password}
                helperText={formErrors.password}
                name="password"
              />
            )}

            <TextField
              label="Contact Number"
              variant="outlined"
              fullWidth
              value={userData.contactNumber}
              onChange={handleInputChange}
              margin="normal"
              error={!!formErrors.contactNumber}
              helperText={formErrors.contactNumber}
              name="contactNumber"
            />

            <FormControl fullWidth margin="normal" error={!!formErrors.role}>
              <InputLabel>Role</InputLabel>
              <Select
                value={userData.role}
                onChange={handleRoleChange}
                label="Role"
                name="role"
              >
                {isRolesLoading ? (
                  <MenuItem value="">
                    <CircularProgress size={24} /> Loading Roles...
                  </MenuItem>
                ) : roles.length > 0 ? (
                  roles.map((roleItem) => (
                    <MenuItem key={roleItem._id} value={roleItem.name}>
                      {roleItem.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No Roles Available</MenuItem>
                )}
              </Select>
              <Typography variant="body2" color="error">
                {formErrors.role}
              </Typography>
            </FormControl>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                position: "relative",
                top: "10px",
              }}
            >
              <Button variant="outlined" fullWidth onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ padding: "10px" }}
              >
                {editUserId ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Full Name",
                "Email",
                "Role",
                "Contact Number",
                "Date",
                "Time",
                "Actions",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    backgroundColor: "#f9f9f9",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ border: "1px solid #e0e0e0" }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (filteredUsers.length > 0 ? filteredUsers : users).length >
              0 ? (
              (filteredUsers.length > 0 ? filteredUsers : users).map((user) => (
                <TableRow
                  key={user._id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <TableCell
                    sx={{ textAlign: "center", border: "1px solid #e0e0e0" }}
                  >
                    {user.fullname}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", border: "1px solid #e0e0e0" }}
                  >
                    {user.email}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", border: "1px solid #e0e0e0" }}
                  >
                    {user.role}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", border: "1px solid #e0e0e0" }}
                  >
                    {user.contactNumber || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", border: "1px solid #e0e0e0" }}
                  >
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    sx={{ textAlign: "center", border: "1px solid #e0e0e0" }}
                  >
                    {new Date(user.createdAt).toLocaleTimeString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "10px",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <IconButton onClick={() => handleViewUser(user)}>
                      <VisibilityIcon sx={{ color: "green" }} />
                    </IconButton>
                    <IconButton onClick={() => handleEditUser(user)}>
                      <BorderColorIcon sx={{ color: "blue" }} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteDialogOpen(user)}>
                      <DeleteIcon sx={{ color: "red" }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ border: "1px solid #e0e0e0" }}
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalUsers}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={() => handleDeleteUser(selectedUser._id)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              maxWidth: "500px",
              width: "100%",
              padding: "30px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "600",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              User Details
            </Typography>

            {selectedUser && (
              <div>
                <div
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="body1">
                    <strong>Full Name:</strong> {selectedUser.fullname}
                  </Typography>
                </div>

                <div
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="body1">
                    <strong>Email:</strong> {selectedUser.email}
                  </Typography>
                </div>

                <div
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="body1">
                    <strong>Contact Number:</strong>{" "}
                    {selectedUser.contactNumber}
                  </Typography>
                </div>

                <div
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="body1">
                    <strong>Role:</strong> {selectedUser.role}
                  </Typography>
                </div>

                <div
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="body1">
                    <strong>Verified:</strong>{" "}
                    {selectedUser.isVerified ? "Yes" : "No"}
                  </Typography>
                </div>

                <div
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="body1">
                    <strong>Date:</strong>{" "}
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </Typography>
                </div>

                <div
                  style={{
                    marginBottom: "20px",
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="body1">
                    <strong>Time:</strong>{" "}
                    {new Date(selectedUser.createdAt).toLocaleTimeString()}
                  </Typography>
                </div>
              </div>
            )}

            <Button
              variant="outlined"
              onClick={() => setOpenViewModal(false)}
              sx={{
                width: "30%",
                padding: "10px",
                borderRadius: "4px",
                fontWeight: "bold",
                backgroundColor: "blue",
                color: "white",
                position: "relative",
                left: "10rem",
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
