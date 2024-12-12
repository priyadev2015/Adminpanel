// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Button, Modal, TextField, Select, MenuItem, InputLabel, FormControl, TablePagination, CircularProgress } from '@mui/material';
// import { toast } from 'react-toastify'; 
// import 'react-toastify/dist/ReactToastify.css';
// import apiConfig from '../../config/ServiceApi'; 

// const UserManagement = () => {
//   const [users, setUsers] = useState([]); 
//   const [loading, setLoading] = useState(true); 
//   const [openModal, setOpenModal] = useState(false);
//   const [fullname, setFullname] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [contactNumber, setContactNumber] = useState('');
//   const [role, setRole] = useState('');
//   const [roles, setRoles] = useState([]); 
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5); 

//   // Fetch users and roles
//   useEffect(() => {
//     fetchUsers();
//     fetchRoles();
//   }, []);

//   const fetchUsers = () => {
//     const token = localStorage.getItem('authToken');
//     axios
//       .get(`${apiConfig.baseURL}${apiConfig.users}`, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       })
//       .then((response) => {
//         setUsers(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error('Error fetching users:', error);
//         toast.error('Error fetching users: ' + error.message);
//         setLoading(false);
//       });
//   };
  
//   const fetchRoles = () => {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       toast.error('Token is missing. Please log in again.');
//       return;
//     }
  
//     axios
//       .get(`${apiConfig.baseURL}${apiConfig.roles}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((response) => {
//         setRoles(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching roles:', error);
//         toast.error('Error fetching roles: ' + error.message);
//       });
//   };
  
//   const handleCreateUser = (e) => {
//     e.preventDefault();
  
//     const newUser = {
//       fullname,
//       email,
//       password,
//       contactNumber,
//       role,
//     };
  
//     const token = localStorage.getItem('authToken');
//     axios
//       .post(`${apiConfig.baseURL}${apiConfig.createUser}`, newUser, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       })
//       .then((response) => {
//         toast.success('User created successfully');
//         fetchUsers(); 
//         handleCloseModal();
//       })
//       .catch((error) => {
//         toast.error('Error creating user: ' + error.message);
//       });
//   };
//   const handleCloseModal = () => {
//     setOpenModal(false);
//     setFullname('');
//     setEmail('');
//     setPassword('');
//     setContactNumber('');
//     setRole('');
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const displayedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <div>
//       <Typography variant="h5" sx={{ textAlign: 'center', marginTop: 10 }}>
//         User Management
//       </Typography>

//       <Button variant="contained" sx={{ marginBottom: 2 }} onClick={() => setOpenModal(true)}>
//         Create User
//       </Button>

//       {/* Modal for creating user */}
//       <Modal open={openModal} onClose={handleCloseModal}>
//         <div style={{ padding: '20px', backgroundColor: 'white', margin: 'auto', marginTop: '100px', maxWidth: '400px', borderRadius: '8px' }}>
//           <Typography variant="h6">Create New User</Typography>
//           <form onSubmit={handleCreateUser}>
//             <TextField
//               label="Full Name"
//               variant="outlined"
//               fullWidth
//               value={fullname}
//               onChange={(e) => setFullname(e.target.value)}
//               margin="normal"
//             />
//             <TextField
//               label="Email"
//               variant="outlined"
//               fullWidth
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               margin="normal"
//             />
//             <TextField
//               label="Password"
//               variant="outlined"
//               fullWidth
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               margin="normal"
//               type="password"
//             />
//             <TextField
//               label="Contact Number"
//               variant="outlined"
//               fullWidth
//               value={contactNumber}
//               onChange={(e) => setContactNumber(e.target.value)}
//               margin="normal"
//             />
//            <FormControl fullWidth margin="normal">
//               <InputLabel>Role</InputLabel>
//               <Select
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 label="Role"
//               >
//                 {roles.length > 0 ? (
//                   roles.map((roleItem) => (
//                     <MenuItem key={roleItem._id} value={roleItem.name}>
//                       {roleItem.name}
//                     </MenuItem>
//                   ))
//                 ) : (
//                   <MenuItem value="" disabled>No roles available</MenuItem>
//                 )}
//               </Select>
//             </FormControl>

//             <Button variant="contained" type="submit" sx={{ marginTop: 2 }}>
//               Create User
//             </Button>
//             <Button variant="outlined" onClick={handleCloseModal} sx={{ marginTop: 2, marginLeft: 1 }}>
//               Cancel
//             </Button>
//           </form>
//         </div>
//       </Modal>

//       {loading ? (
//         <div style={{ textAlign: 'center', marginTop: '20px' }}>
//           <CircularProgress />
//         </div>
//       ) : (
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>S No.</TableCell>
//               <TableCell>Fullname</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Role</TableCell>
//               <TableCell>Contact Number</TableCell>
//               <TableCell>Date Time</TableCell>
//               <TableCell>Verified</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {displayedUsers.length > 0 ? (
//               displayedUsers.map((user, index) => (
//                 <TableRow key={user._id}>
//                   <TableCell>{page * rowsPerPage + index + 1}</TableCell>
//                   <TableCell>{user.fullname}</TableCell>
//                   <TableCell>{user.email}</TableCell>
//                   <TableCell>{user.role}</TableCell>
//                   <TableCell>{user.contactNumber}</TableCell>
//                   <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
//                   <TableCell>{user.isVerified ? 'Yes' : 'No'}</TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={7} sx={{ textAlign: 'center' }}>
//                   No users found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       )}

//       {/* Pagination */}
//       <TablePagination
//         component="div"
//         count={users.length}
//         page={page}
//         onPageChange={handleChangePage}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </div>
//   );
// };

// export default UserManagement;




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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from "@mui/icons-material/Delete"; 
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false); // State for view modal
  const [editUserId, setEditUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [formErrors, setFormErrors] = useState({
    fullname: "",
    contactNumber: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = () => {
    const token = localStorage.getItem("authToken");
    axios
      .get("https://propertymanagement-nf5c.onrender.com/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsers(response.data);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        toast.error("Error fetching roles: " + error.message);
      });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newUser = {
        fullname,
        email,
        password,
        contactNumber,
        role,
      };

      const token = localStorage.getItem("authToken");
      axios
        .post(
          "https://propertymanagement-nf5c.onrender.com/api/auth/register",
          newUser,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
    if (validateForm()) {
      const updatedUser = {
        fullname,
        contactNumber,
        role,
      };

      const token = localStorage.getItem("authToken");
      axios
        .put(`https://propertymanagement-nf5c.onrender.com/api/auth/users/${editUserId}`, updatedUser, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          toast.success("User updated successfully");
          fetchUsers();
          handleCloseModal();
        })
        .catch((error) => {
          toast.error("Error updating user: " + error.message);
        });
    }
  };

  const handleDeleteUser = (userId) => {
    const token = localStorage.getItem("authToken");
    axios
      .delete(`https://propertymanagement-nf5c.onrender.com/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
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

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditUserId(null);
    setFullname("");
    setEmail("");
    setPassword("");
    setContactNumber("");
    setRole("");
    setFormErrors({
      fullname: "",
      contactNumber: "",
      password: "",
      role: "",
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const validateForm = () => {
    const errors = {};

    if (fullname.length < 4 || fullname.length > 10) {
      errors.fullname = "Full name must be between 4 and 10 characters.";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contactNumber)) {
      errors.contactNumber = "Contact number must be 10 digits.";
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      errors.password =
        "Password must be at least 8 characters, including a letter, a number, and a special character.";
    }

    if (!role) {
      errors.role = "Role is required.";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const filteredUsers = users.filter((user) => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      user.fullname.toLowerCase().includes(lowercasedQuery) ||
      user.email.toLowerCase().includes(lowercasedQuery) ||
      user.role.toLowerCase().includes(lowercasedQuery)
    );
  });

  const displayedUsers = filteredUsers.filter((user) => !user.isDeleted);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setOpenViewModal(true);
  };

  return (
    <div>
      <Typography variant="h4" sx={{ textAlign: "center", marginTop: 10 }}>
        User Management
      </Typography>

      <div className="d-flex justify-content-between  mr-60">
        <Button
          variant="contained"
          sx={{ marginBottom: 2 }}
          onClick={() => setOpenModal(true)}
        >
          Create User
        </Button>
        <TextField
          label="Search by Name, Email, or Role"
          variant="outlined"
          sx={{ width: "300px", position: "relative", left:"650px" }}
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
          <Typography variant="h6">
            {editUserId ? "Edit User" : "Create New User"}
          </Typography>
          <form onSubmit={editUserId ? handleUpdateUser : handleCreateUser}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              margin="normal"
              error={!!formErrors.fullname}
              helperText={formErrors.fullname}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              disabled={!!editUserId}
            />
            {!editUserId && (
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                type="password"
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
            )}

            <TextField
              label="Contact Number"
              variant="outlined"
              fullWidth
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              margin="normal"
              error={!!formErrors.contactNumber}
              helperText={formErrors.contactNumber}
            />

            <FormControl fullWidth margin="normal" error={!!formErrors.role}>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Role"
              >
                {roles.length > 0 ? (
                  roles.map((roleItem) => (
                    <MenuItem key={roleItem._id} value={roleItem.name}>
                      {roleItem.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No roles available
                  </MenuItem>
                )}
              </Select>
              {formErrors.role && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {formErrors.role}
                </span>
              )}
            </FormControl>

            <Button variant="contained" type="submit" sx={{ marginTop: 2 }}>
              {editUserId ? "Update" : "Create User"}
            </Button>
            <Button
              variant="outlined"
              onClick={handleCloseModal}
              sx={{ marginTop: 2, marginLeft: 1 }}
            >
              Cancel
            </Button>
          </form>
        </div>
      </Modal>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <CircularProgress />
        </div>
      ) : (
        <Table>
  <TableHead>
    <TableRow className="user">
      <TableCell>S No.</TableCell>
      <TableCell>Fullname</TableCell>
      <TableCell>Email</TableCell>
      <TableCell>Role</TableCell>
      <TableCell>Contact Number</TableCell>
      <TableCell>Date</TableCell> 
      <TableCell>Time</TableCell>
      <TableCell>Verified</TableCell>
      <TableCell>Actions</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {displayedUsers.length > 0 ? (
      displayedUsers
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((user, index) => (
          <TableRow
            key={user._id}
            sx={{
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            <TableCell>{page * rowsPerPage + index + 1}</TableCell>
            <TableCell>{user.fullname}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{user.contactNumber}</TableCell>
            {/* Date - Displaying only the date part */}
            <TableCell>
              {new Date(user.createdAt).toLocaleDateString()} {/* Formats as "MM/DD/YYYY" */}
            </TableCell>
            {/* Time - Displaying only the time part */}
            <TableCell>
              {new Date(user.createdAt).toLocaleTimeString()} {/* Formats as "HH:MM:SS" */}
            </TableCell>
            <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
            <TableCell>
              <IconButton
                onClick={() => {
                  setEditUserId(user._id);
                  setFullname(user.fullname);
                  setEmail(user.email); 
                  setContactNumber(user.contactNumber);
                  setRole(user.role);
                  setOpenModal(true);
                }}
              >
                <BorderColorIcon sx={{ color: "blue" }} />
              </IconButton>
              <IconButton
                onClick={() => {
                  setEditUserId(user._id);
                  setOpenDeleteDialog(true);
                }}
                sx={{ marginLeft: 1 }}
              >
                <DeleteIcon sx={{ color: "red" }} />
              </IconButton>
              <IconButton
                onClick={() => handleViewUser(user)}
                sx={{ marginLeft: 1 }}
              >
                <VisibilityIcon sx={{ color: "green" }} />
              </IconButton>
            </TableCell>
          </TableRow>
        ))
    ) : (
      <TableRow>
        <TableCell colSpan={9} sx={{ textAlign: "center" }}>
          No users found
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>

      )}

      <TablePagination
        component="div"
        count={displayedUsers.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteUser(editUserId)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      padding: '20px',
    }}
  >
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        padding: '30px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}>
        User Details
      </Typography>

      {selectedUser && (
        <div>
          {/* Full Name */}
          <div
            style={{
              marginBottom: '15px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="body1">
              <strong>Full Name:</strong> {selectedUser.fullname}
            </Typography>
          </div>

          {/* Email */}
          <div
            style={{
              marginBottom: '15px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="body1">
              <strong>Email:</strong> {selectedUser.email}
            </Typography>
          </div>

          {/* Contact Number */}
          <div
            style={{
              marginBottom: '15px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="body1">
              <strong>Contact Number:</strong> {selectedUser.contactNumber}
            </Typography>
          </div>

          {/* Role */}
          <div
            style={{
              marginBottom: '15px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="body1">
              <strong>Role:</strong> {selectedUser.role}
            </Typography>
          </div>

          {/* Verified */}
          <div
            style={{
              marginBottom: '15px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="body1">
              <strong>Verified:</strong> {selectedUser.isVerified ? "Yes" : "No"}
            </Typography>
          </div>

          {/* Created At - Date */}
          <div
            style={{
              marginBottom: '15px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="body1">
              <strong>Date:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}
            </Typography>
          </div>

          {/* Created At - Time */}
          <div
            style={{
              marginBottom: '20px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="body1">
              <strong>Time:</strong> {new Date(selectedUser.createdAt).toLocaleTimeString()}
            </Typography>
          </div>
        </div>
      )}

      <Button
        variant="outlined"
        onClick={() => setOpenViewModal(false)}
        sx={{
          width: '100%',
          padding: '10px',
          borderRadius: '4px',
          fontWeight: 'bold',
          backgroundColor: '#f5f5f5',
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
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


