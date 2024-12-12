import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { deepOrange } from "@mui/material/colors";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AvatarComponent({ userEmail }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getInitials = (email) => {
    if (!email) return email;
    const namePart = email.split("@")[0];
    return namePart[0]?.toUpperCase() || "U";
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("role");

    toast.success("You have been logged out successfully.", {
      position: "top-right",
      autoClose: 5000,
    });

    window.location.href = "/";
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = (confirm) => {
    setOpenDialog(false);
    if (confirm) {
      handleLogout();
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <Avatar
        sx={{ bgcolor: deepOrange[500], cursor: "pointer" }}
        onClick={handleMenuClick}
        alt="User Avatar"
      >
        {getInitials(userEmail)}
      </Avatar>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled>
          <AccountCircleIcon fontSize="small" style={{ marginRight: "10px" }} />
          {userEmail || "User Profile"}
        </MenuItem>
        <hr style={{ margin: "5px 0", border: "none", borderTop: "1px solid #ddd" }} />
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleDialogOpen();
          }}
        >
          <LogoutIcon fontSize="small" style={{ marginRight: "10px" }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => handleDialogClose(false)}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="error" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* ToastContainer to display toast notifications */}
      <ToastContainer />
    </Stack>
  );
}
