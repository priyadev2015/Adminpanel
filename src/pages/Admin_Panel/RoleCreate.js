import React, { useState, useEffect } from "react";
import {
  Button,
  Modal as MUI_Modal,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  InputAdornment,
  TablePagination,
  TableContainer,
  Paper,
} from "@mui/material";
import { styled, css } from "@mui/system";
import axios from "axios";
import config from "../../config/ServiceApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader/Loader";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

const RoleCreate = () => {
  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roles, setRoles] = useState([]);
  const [editRole, setEditRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [roleNameError, setRoleNameError] = useState("");
  const [page, setPage] = useState(0); // Page index starts from 1
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRoles, setTotalRoles] = useState(0);

  useEffect(() => {
    fetchRoles();
  }, [page, rowsPerPage]);

  const fetchRoles = () => {
    const token = localStorage.getItem("authToken");
    setLoading(true);
    axios
      .get(
        `https://propertymanagement-nf5c.onrender.com/api${config.roleCreate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: page + 1, // +1 because page is zero-indexed
            limit: rowsPerPage,
          },
        }
      )
      .then((response) => {
        setRoles(response.data.roles);
        setTotalRoles(response.data.pagination.totalRoles);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        toast.error("Error fetching roles: " + error.message);
        setLoading(false);
      });
  };

  const handleOpen = (role) => {
    setOpen(true);
    if (!role) {
      setEditRole(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setRoleName("");
    setRoleNameError("");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setRoleName(value);
    if (roleNameError) {
      setRoleNameError("");
    }
    validateRoleName(value);
  };

  const validateRoleName = (value) => {
    if (!value) {
      setRoleNameError("Role name is required.");
      return false;
    }
    if (value.length < 4) {
      setRoleNameError("Role name must be at least 4 characters.");
      return false;
    }
    if (value.length > 13) {
      setRoleNameError("Role name must be less than 13 characters.");
      return false;
    }
    setRoleNameError("");
    return true;
  };

  const handleCreateRole = (e) => {
    e.preventDefault();

    if (validateRoleName(roleName)) {
      const url = `${config.baseURL}${config.roleCreate}`;
      const token = localStorage.getItem("authToken");

      axios({
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { name: roleName },
      })
        .then((response) => {
          fetchRoles();
          setRoleName("");
          handleClose();
          toast.success("Role created successfully", {
            autoClose: 2000,
          });
        })
        .catch((error) => {
          toast.error("Error saving role: " + error.message, {
            autoClose: 2000,
          });
        });
    }
  };

  const handleUpdateRole = (e) => {
    e.preventDefault();

    if (validateRoleName(roleName) && editRole) {
      const url = `${config.baseURL}${config.roleCreate}/${editRole._id}`;
      const token = localStorage.getItem("authToken");

      axios({
        method: "PUT",
        url: url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { name: roleName },
      })
        .then((response) => {
          fetchRoles();
          setRoleName("");
          handleClose();
          toast.success("Role updated successfully");
        })
        .catch((error) => {
          toast.error("Error updating role: " + error.message);
        });
    }
  };

  const handleEditRole = (role) => {
    setRoleName(role.name);
    setEditRole(role);
    handleOpen(role);
  };

  const handleDeleteRole = (roleId) => {
    setRoleToDelete(roleId);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    const token = localStorage.getItem("authToken");
    const url = `https://propertymanagement-nf5c.onrender.com/api/roles/${roleToDelete}`;

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRoles((prevRoles) =>
          prevRoles.filter((role) => role._id !== roleToDelete)
        );
        setDeleteOpen(false);
        toast.success("Role deleted successfully");
      })
      .catch((error) => {
        toast.error("Error deleting role: " + error.message);
        setDeleteOpen(false);
      });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="d-flow mt-5 " style={{ padding: "53px" }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            marginBottom: 0,
            position: "relative",
            top: "0px",
          }}
        >
          Roles
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            position: "relative",
            top: "25px",
          }}
        >
          <TextField
            label="Search by Role Name"
            variant="outlined"
            sx={{ width: "300px", position: "relative", right: "30px" }}
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
        <Button variant="contained" onClick={handleOpen} sx={{position:"relative", bottom:"10px"}}>
          Create
        </Button>

        <MUI_Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="create-role-modal"
          aria-describedby="create-role-modal-description"
        >
          <ModalContent sx={{ width: 400, position: "relative", top: "250px" }}>
            <Typography
              variant="h5"
              id="create-role-modal"
              className="modal-title"
            >
              {editRole ? "Edit Role" : "Create a New Role"}
            </Typography>
            <form onSubmit={editRole ? handleUpdateRole : handleCreateRole}>
              <TextField
                label="Role Name"
                variant="outlined"
                fullWidth
                value={roleName}
                onChange={handleInputChange}
                margin="normal"
                error={!!roleNameError}
                helperText={roleNameError}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "16px",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  sx={{ marginRight: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={!!roleNameError}
                >
                  {editRole ? "Update" : "Create "}
                </Button>
              </div>
            </form>
          </ModalContent>
        </MUI_Modal>

        <MUI_Modal open={deleteOpen} onClose={() => setDeleteOpen(false)}>
          <ModalContent sx={{ width: 400, position: "relative", top: "45%" }}>
            <Typography variant="h6">
              Are you sure you want to delete this role?
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "16px",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setDeleteOpen(false)}
                sx={{ marginRight: 1 }}
              >
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </ModalContent>
        </MUI_Modal>

        
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  {["Role Name", "Actions"].map((header) => (
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
                {filteredRoles.length > 0 ? (
                  filteredRoles.map((role) => (
                    <TableRow
                      key={role._id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.05)",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          textAlign: "center",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        {role.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "10px",
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <IconButton onClick={() => handleEditRole(role)}>
                          <EditIcon sx={{ color: "blue" }} />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteRole(role._id)}
                          color="error"
                        >
                          <DeleteIcon sx={{ color: "red" }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      align="center"
                      sx={{ border: "1px solid #e0e0e0" }}
                    >
                      No roles found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
       

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={totalRoles} 
          rowsPerPage={rowsPerPage} 
          page={page} 
          onPageChange={handleChangePage} 
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </>
  );
};

const ModalContent = styled("div")(css`
  background-color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: auto;
  width: 500px;
  margin: auto;
`);

export default RoleCreate;
