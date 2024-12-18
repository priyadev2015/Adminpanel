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
  Typography,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
  const [totalProperties, setTotalProperties] = useState(0);
  
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
         `${config.baseURL}${config.propertiesList}`,
          {
            params: {
              page: page + 1,
              limit: rowsPerPage,
            },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data && Array.isArray(response.data.properties)) {
          setProperties(response.data.properties);
          setTotalProperties(response.data.totalProperties);
        } else {
          toast.error(
            "Invalid response format. Expected 'properties' to be an array."
          );
          setProperties([]);
        }
      } catch (error) {
        console.error("Error fetching properties list:", error);
        toast.error("Error fetching properties list: " + error.message);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertiesList();
  }, [page, rowsPerPage]);

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

    if (!property.name) {
      errors.name = "Property name is required";
    } else if (property.name.length < 4 || property.name.length > 15) {
      errors.name = "Property name must be between 4 and 15 characters";
    }

    if (!property.propertyAddress) {
      errors.propertyAddress = "Property address is required";
    } else if (
      property.propertyAddress.length < 5 ||
      property.propertyAddress.length > 50
    ) {
      errors.propertyAddress =
        "Property address must be between 5 and 50 characters";
    }

    if (!property.rent) {
      errors.rent = "Rent is required";
    } else if (
      isNaN(property.rent) ||
      property.rent < 100 ||
      property.rent > 100000
    ) {
      errors.rent = "Rent must be between 100 and 100000";
    }

   
    if (!property.securityDeposit) {
      errors.securityDeposit = "Security deposit is required";
    } else if (
      isNaN(property.securityDeposit) ||
      property.securityDeposit < 100 ||
      property.securityDeposit > 100000
    ) {
      errors.securityDeposit =
        "Security deposit must be between 100 and 100000";
    }

  
    if (!property.squareFootage) {
      errors.squareFootage = "Square footage is required";
    } else if (
      isNaN(property.squareFootage) ||
      property.squareFootage < 100 ||
      property.squareFootage > 100000
    ) {
      errors.squareFootage = "Square footage must be between 100 and 100000";
    }

    if (!property.totalIncome) {
      errors.totalIncome = "Total income is required";
    } else if (
      isNaN(property.totalIncome) ||
      property.totalIncome < 100 ||
      property.totalIncome > 1000000
    ) {
      errors.totalIncome = "Total income must be between 100 and 1000000";
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewProperty((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    const validationErrors = validateForm({
      ...newProperty,
      [name]: value,
    });

    setFormErrors(validationErrors);
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
        `${config.baseURL}${config.propertiesList}${editProperty._id}`,
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
        `${config.baseURL}${config.propertiesList}${deletePropertyId}`,
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
`${config.baseURL}${config.propertiesList}`,
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
    <div >
<Typography variant="h4" sx={{ textAlign: "center", marginTop: 10 }}>
Properties
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreateModal(true)}
        style={{ marginBottom: "20px" }}
      >
        Create
      </Button>

      <TextField
        label="Search by PropertyName,Address"
        variant="outlined"
        sx={{ width: "300px", position: "relative", left: "650px", bottom:"20px" }}
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

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Property ID",
                "Property Name",
                "Address",
                "Occupancy",
                "Total Income",
                "Owner Name",
                "Owner Email",
                "Owner Role",
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
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <TableRow
                  key={property._id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                    {property.propertyId}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                    {property.name}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                    {property.propertyAddress}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                    {property.occupancy}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                    {property.totalIncome}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                    {property.owner?.fullname || "N/A"}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                    {property.owner?.email || "N/A"}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                    {property.owner?.role || "N/A"}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                    {new Date(property.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #e0e0e0" }}>
                    {new Date(property.createdAt).toLocaleTimeString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                      border: "1px solid #e0e0e0",
                    }}
                  >
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={11}
                  align="center"
                  sx={{ border: "1px solid #e0e0e0" }}
                >
                  No properties found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalProperties}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <div
          style={{
            padding: "20px",
            backgroundColor: "white",
            margin: "auto",
            marginTop: "0px",
            maxWidth: "400px",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            Create Property
          </Typography>
          <form onSubmit={handleCreateSubmit}>
            <TextField
              label="Property Name"
              fullWidth
              value={newProperty.name}
              onChange={handleInputChange}
              name="name"
              margin="normal"
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              label="Property Address"
              fullWidth
              value={newProperty.propertyAddress}
              onChange={handleInputChange}
              name="propertyAddress"
              margin="normal"
              error={!!formErrors.propertyAddress}
              helperText={formErrors.propertyAddress}
            />
            <TextField
              label="Rent"
              type="number"
              fullWidth
              value={newProperty.rent}
              onChange={handleInputChange}
              name="rent"
              margin="normal"
              error={!!formErrors.rent}
              helperText={formErrors.rent}
            />
            <TextField
              label="Security Deposit"
              type="number"
              fullWidth
              value={newProperty.securityDeposit}
              onChange={handleInputChange}
              name="securityDeposit"
              margin="normal"
              error={!!formErrors.securityDeposit}
              helperText={formErrors.securityDeposit}
            />
            <TextField
              label="Square Footage"
              type="number"
              fullWidth
              value={newProperty.squareFootage}
              onChange={handleInputChange}
              name="squareFootage"
              margin="normal"
              error={!!formErrors.squareFootage}
              helperText={formErrors.squareFootage}
            />
            <TextField
              label="Total Income"
              type="number"
              fullWidth
              value={newProperty.totalIncome}
              onChange={handleInputChange}
              name="totalIncome"
              margin="normal"
              error={!!formErrors.totalIncome}
              helperText={formErrors.totalIncome}
            />

            <div style={{ marginTop: "10px" }}>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setOpenCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateSubmit}
                variant="contained"
                fullWidth
                sx={{ padding: "10px" }}
              >
                Create
              </Button>
            </div>
          </form>
        </div>
      </Dialog>

      <Dialog open={openViewModal} onClose={handleViewClose} fullWidth>
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}
        >
          Property Details
        </DialogTitle>
        <DialogContent dividers>
          {viewProperty ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { label: "Property Name", value: viewProperty?.name || "N/A" },
                {
                  label: "Property Address",
                  value: viewProperty?.propertyAddress || "N/A",
                },
                { label: "Occupancy", value: viewProperty?.occupancy || "N/A" },
                {
                  label: "Total Income",
                  value: viewProperty?.totalIncome || "N/A",
                },
                {
                  label: "Square Footage",
                  value: viewProperty?.squareFootage || "N/A",
                },
                { label: "Rent", value: viewProperty?.rent || "N/A" },
                {
                  label: "Security Deposit",
                  value: viewProperty?.securityDeposit || "N/A",
                },
                {
                  label: "Total Requests",
                  value: viewProperty?.totalRequests || "N/A",
                },
                {
                  label: "Owner Name",
                  value: viewProperty?.owner?.fullname || "N/A",
                },
                {
                  label: "Owner Email",
                  value: viewProperty?.owner?.email || "N/A",
                },
                {
                  label: "Owner Role",
                  value: viewProperty?.owner?.role || "N/A",
                },
                {
                  label: "Property ID",
                  value: viewProperty?.propertyId || "N/A",
                },
                {
                  label: "Date",
                  value: viewProperty?.createdAt
                    ? new Date(viewProperty?.createdAt).toLocaleDateString()
                    : "N/A",
                },
                {
                  label: "Time",
                  value: viewProperty?.createdAt
                    ? new Date(viewProperty?.createdAt).toLocaleTimeString()
                    : "N/A",
                },
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
            onClick={handleViewClose}
            sx={{
              color: "white",
              border: "2px solid",
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

      <Dialog open={openEditModal} onClose={handleEditClose}>
        <div
          style={{
            padding: "20px",
            backgroundColor: "white",
            margin: "auto",
            maxWidth: "400px",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            Edit Property
          </Typography>
          <form onSubmit={handleEditSubmit}>
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
                setEditProperty({
                  ...editProperty,
                  totalIncome: e.target.value,
                })
              }
              margin="normal"
              error={!!formErrors.totalIncome}
              helperText={formErrors.totalIncome}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <Button variant="outlined" fullWidth onClick={handleEditClose}>
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                variant="contained"
                fullWidth
                sx={{ padding: "10px" }}
              >
                Update
              </Button>
            </div>
          </form>
        </div>
      </Dialog>

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
