import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import config from "../../config/ServiceApi";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import TablePagination from "@mui/material/TablePagination";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";

const PropertiesList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [deletePropertyId, setDeletePropertyId] = useState(null);
  const [viewProperty, setViewProperty] = useState(null);
  const [newProperty, setNewProperty] = useState({
    name: "",
    image: null,
    propertyAddress: "",
    rent: "",
    securityDeposit: "",
    squareFootage: "",
    totalIncome: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    propertyAddress: "",
    rent: "",
    securityDeposit: "",
    squareFootage: "",
    totalIncome: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPropertiesList = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("No token found. Please log in again.");
          return;
        }

        const response = await axios.get(
          `https://propertymanagement-nf5c.onrender.com/api/properties`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties list:", error);
        toast.error("Error fetching properties list: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertiesList();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditOpen = (property) => {
    setEditProperty(property);
    setOpenEditModal(true);
  };

  const handleEditClose = () => {
    setOpenEditModal(false);
    setEditProperty(null);
  };

  const validateForm = (property) => {
    const errors = {};
    if (!property.name) errors.name = "Property name is required";
    if (!property.propertyAddress)
      errors.propertyAddress = "Property address is required";
    if (!property.rent || isNaN(property.rent) || property.rent <= 0)
      errors.rent = "Valid rent is required";
    if (
      !property.securityDeposit ||
      isNaN(property.securityDeposit) ||
      property.securityDeposit <= 0
    )
      errors.securityDeposit = "Valid security deposit is required";
    if (
      !property.squareFootage ||
      isNaN(property.squareFootage) ||
      property.squareFootage <= 0
    )
      errors.squareFootage = "Valid square footage is required";
    if (
      !property.totalIncome ||
      isNaN(property.totalIncome) ||
      property.totalIncome <= 0
    )
      errors.totalIncome = "Valid total income is required";

    return errors;
  };

  const handleEditSubmit = async () => {
    const errors = validateForm(editProperty);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const updatedProperty = {
        name: editProperty.name,
        propertyAddress: editProperty.propertyAddress,
        status: editProperty.status,
        occupancy: editProperty.occupancy,
        totalIncome: editProperty.totalIncome,
        activeTenants: editProperty.activeTenants,
      };

      const response = await axios.put(
        `${config.baseURL}/properties/${editProperty._id}`,
        updatedProperty,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Property updated successfully");
        setProperties(
          properties.map((property) =>
            property._id === editProperty._id
              ? { ...property, ...updatedProperty }
              : property
          )
        );
        handleEditClose();
      } else {
        toast.error("Error updating property");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Error updating property: " + error.message);
    }
  };

  const handleDeleteOpen = (id) => {
    setDeletePropertyId(id);
    setOpenDeleteModal(true);
  };

  const handleDeleteClose = () => {
    setOpenDeleteModal(false);
    setDeletePropertyId(null);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const response = await axios.delete(
        `https://propertymanagement-nf5c.onrender.com/api/properties/${deletePropertyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success("Property deleted successfully");
        setProperties(
          properties.filter((property) => property._id !== deletePropertyId)
        );
        handleDeleteClose();
      } else {
        toast.error("Error deleting property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Error deleting property: " + error.message);
    }
  };

  const handleFileChange = (e) => {
    setNewProperty({ ...newProperty, image: e.target.files[0] });
  };

  const handleCreateSubmit = async () => {
    const errors = validateForm(newProperty);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const formData = new FormData();
      formData.append("name", newProperty.name);
      formData.append("image", newProperty.image);
      formData.append("propertyAddress", newProperty.propertyAddress);
      formData.append("rent", newProperty.rent);
      formData.append("securityDeposit", newProperty.securityDeposit);
      formData.append("squareFootage", newProperty.squareFootage);
      formData.append("totalIncome", newProperty.totalIncome);

      const response = await axios.post(
        `https://propertymanagement-nf5c.onrender.com/api/properties`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Property created successfully");
        setProperties([...properties, response.data]);
        setOpenCreateModal(false);
        setNewProperty({
          name: "",
          image: null,
          propertyAddress: "",
          rent: "",
          securityDeposit: "",
          squareFootage: "",
          totalIncome: "",
        });
        setFormErrors({});
      } else {
        toast.error("Error creating property");
      }
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error("Error creating property: " + error.message);
    }
  };

  const handleViewOpen = (property) => {
    setViewProperty(property);
    setOpenViewModal(true);
  };

  const handleViewClose = () => {
    setOpenViewModal(false);
    setViewProperty(null);
  };

  const filteredProperties = properties.filter(
    (property) =>
      (property.name &&
        property.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (property.propertyAddress &&
        property.propertyAddress
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ paddingTop: "80px" }}>
      <h2 style={{ display: "flex", justifyContent: "center" }}>Properties</h2>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreateModal(true)}
        startIcon={<AddIcon />}
        style={{ marginBottom: "20px" }}
      >
        Create Property
      </Button>

      <TextField
        label="Search by PropertyName,Address"
        variant="outlined"
        sx={{ width: "300px", position: "relative", left: "600px" }}
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.no</TableCell>
              <TableCell>Property ID</TableCell>
              <TableCell>Property Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Occupancy</TableCell>
              <TableCell>Total Income</TableCell>
              <TableCell>Owner Name</TableCell>
              <TableCell>Owner Email</TableCell>
              <TableCell>Owner Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProperties
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((property, index) => (
                <TableRow key={property._id}>
                  <TableCell>{index + 1 + page * rowsPerPage}</TableCell>
                  <TableCell>{property.propertyId}</TableCell>
                  <TableCell>{property.name}</TableCell>
                  <TableCell>{property.propertyAddress}</TableCell>
                  <TableCell>{property.status}</TableCell>
                  <TableCell>{property.occupancy}</TableCell>
                  <TableCell>{property.totalIncome}</TableCell>
                  <TableCell>{property.owner?.fullname || "N/A"}</TableCell>
                  <TableCell>{property.owner?.email || "N/A"}</TableCell>
                  <TableCell>{property.owner?.role || "N/A"}</TableCell>
                  <TableCell sx={{ display: "flex" }}>
                    <IconButton
                      onClick={() => handleViewOpen(property)}
                      sx={{ color: "green" }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEditOpen(property)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteOpen(property._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProperties.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <DialogTitle>Create Property</DialogTitle>
        <DialogContent>
          <TextField
            label="Property Name"
            fullWidth
            value={newProperty.name}
            onChange={(e) =>
              setNewProperty({ ...newProperty, name: e.target.value })
            }
            margin="normal"
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            label="Property Address"
            fullWidth
            value={newProperty.propertyAddress}
            onChange={(e) =>
              setNewProperty({
                ...newProperty,
                propertyAddress: e.target.value,
              })
            }
            margin="normal"
            error={!!formErrors.propertyAddress}
            helperText={formErrors.propertyAddress}
          />
          <TextField
            label="Rent"
            type="number"
            fullWidth
            value={newProperty.rent}
            onChange={(e) =>
              setNewProperty({ ...newProperty, rent: e.target.value })
            }
            margin="normal"
            error={!!formErrors.rent}
            helperText={formErrors.rent}
          />
          <TextField
            label="Security Deposit"
            type="number"
            fullWidth
            value={newProperty.securityDeposit}
            onChange={(e) =>
              setNewProperty({
                ...newProperty,
                securityDeposit: e.target.value,
              })
            }
            margin="normal"
            error={!!formErrors.securityDeposit}
            helperText={formErrors.securityDeposit}
          />
          <TextField
            label="Square Footage"
            type="number"
            fullWidth
            value={newProperty.squareFootage}
            onChange={(e) =>
              setNewProperty({ ...newProperty, squareFootage: e.target.value })
            }
            margin="normal"
            error={!!formErrors.squareFootage}
            helperText={formErrors.squareFootage}
          />
          <TextField
            label="Total Income"
            type="number"
            fullWidth
            value={newProperty.totalIncome}
            onChange={(e) =>
              setNewProperty({ ...newProperty, totalIncome: e.target.value })
            }
            margin="normal"
            error={!!formErrors.totalIncome}
            helperText={formErrors.totalIncome}
          />

          <div style={{ marginTop: "10px" }}>
            <input type="file" onChange={handleFileChange} />
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openViewModal} onClose={handleViewClose}>
        <DialogTitle>View Property</DialogTitle>
        <DialogContent>
          {/* Property Name */}
          <TextField
            label="Property Name"
            fullWidth
            value={viewProperty?.name || ""}
            InputProps={{ readOnly: true }}
            margin="normal"
          />

          <TextField
            label="Property Address"
            fullWidth
            value={viewProperty?.propertyAddress || ""}
            InputProps={{ readOnly: true }}
            margin="normal"
          />

          {/* Status */}
          <TextField
            label="Status"
            fullWidth
            value={viewProperty?.status || ""}
            InputProps={{ readOnly: true }}
            margin="normal"
          />

          {/* Occupancy */}
          <TextField
            label="Occupancy"
            type="number"
            fullWidth
            value={viewProperty?.occupancy || ""}
            InputProps={{ readOnly: true }}
            margin="normal"
          />

          {/* Total Income */}
          <TextField
            label="Total Income"
            type="number"
            fullWidth
            value={viewProperty?.totalIncome || ""}
            InputProps={{ readOnly: true }}
            margin="normal"
          />
          {/* Square Footage */}
          <TextField
            label="Square Footage"
            type="number"
            fullWidth
            value={viewProperty?.squareFootage || ""}
            InputProps={{ readOnly: true }}
            margin="normal"
          />

          {/* Rent */}
          <TextField
            label="Rent"
            type="number"
            fullWidth
            value={viewProperty?.rent || ""}
            InputProps={{ readOnly: true }}
            margin="normal"
          />

          {/* Security Deposit */}
          <TextField
            label="Security Deposit"
            type="number"
            fullWidth
            value={viewProperty?.securityDeposit || ""}
            InputProps={{ readOnly: true }}
            margin="normal"
          />

          {/* Total Requests */}
          <TextField
            label="Total Requests"
            type="number"
            fullWidth
            value={viewProperty?.totalRequests || ""}
            InputProps={{ readOnly: true }}
            margin="normal"
          />

          {/* Owner Info */}
          <TextField
            label="Owner Name"
            fullWidth
            value={viewProperty?.owner?.fullname || ""}
            InputProps={{ readOnly: true }}
            margin="normal"
          />
          <TextField
            label="Owner Email"
            fullWidth
            value={viewProperty?.owner?.email || ""}
            InputProps={{ readOnly: true }}
            margin="normal"
          />
          <TextField
            label="Owner Role"
            fullWidth
            value={viewProperty?.owner?.role || ""}
            InputProps={{ readOnly: true }}
            margin="normal"
          />

          {/* Property ID */}
          <TextField
            label="Property ID"
            fullWidth
            value={viewProperty?.propertyId || ""}
            InputProps={{ readOnly: true }}
            margin="normal"
          />

          {/* Created Date */}
          <TextField
            label="Created At"
            fullWidth
            value={
              viewProperty?.createdAt
                ? new Date(viewProperty?.createdAt).toLocaleString()
                : ""
            }
            InputProps={{ readOnly: true }}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditModal} onClose={handleEditClose}>
        <DialogTitle>Edit Property</DialogTitle>
        <DialogContent>
          <TextField
            label="Property Name"
            fullWidth
            value={editProperty?.name || ""}
            onChange={(e) =>
              setEditProperty({ ...editProperty, name: e.target.value })
            }
            margin="normal"
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            label="Property Address"
            fullWidth
            value={editProperty?.propertyAddress || ""}
            onChange={(e) =>
              setEditProperty({
                ...editProperty,
                propertyAddress: e.target.value,
              })
            }
            margin="normal"
            error={!!formErrors.propertyAddress}
            helperText={formErrors.propertyAddress}
          />
          <TextField
            label="Rent"
            type="number"
            fullWidth
            value={editProperty?.rent || ""}
            onChange={(e) =>
              setEditProperty({ ...editProperty, rent: e.target.value })
            }
            margin="normal"
            error={!!formErrors.rent}
            helperText={formErrors.rent}
          />
          <TextField
            label="Security Deposit"
            type="number"
            fullWidth
            value={editProperty?.securityDeposit || ""}
            onChange={(e) =>
              setEditProperty({
                ...editProperty,
                securityDeposit: e.target.value,
              })
            }
            margin="normal"
            error={!!formErrors.securityDeposit}
            helperText={formErrors.securityDeposit}
          />
          <TextField
            label="Square Footage"
            type="number"
            fullWidth
            value={editProperty?.squareFootage || ""}
            onChange={(e) =>
              setEditProperty({
                ...editProperty,
                squareFootage: e.target.value,
              })
            }
            margin="normal"
            error={!!formErrors.squareFootage}
            helperText={formErrors.squareFootage}
          />
          <TextField
            label="Total Income"
            type="number"
            fullWidth
            value={editProperty?.totalIncome || ""}
            onChange={(e) =>
              setEditProperty({ ...editProperty, totalIncome: e.target.value })
            }
            margin="normal"
            error={!!formErrors.totalIncome}
            helperText={formErrors.totalIncome}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Property Modal */}
      <Dialog open={openDeleteModal} onClose={handleDeleteClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this property?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PropertiesList;
