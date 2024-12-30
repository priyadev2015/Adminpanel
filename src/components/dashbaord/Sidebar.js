import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  CssBaseline,
  Toolbar,
  Tooltip,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useLocation } from "react-router-dom";
import Profile from "../profile/Profile";
import { getIconForText } from "../../config/Icons";
import logo1 from "../../config/image/logo1.png";
import logo2 from "../../config/image/logo2.png";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
 
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open
    ? {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      }
    : {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      }),
}));

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const activeStyle = {
    backgroundColor: "#1976d2",
    color: "white",
  };

  const defaultStyle = {
    backgroundColor: "white",
    color: theme.palette.text.primary,
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
           
          </Typography>
          <Profile />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Box sx={{ textAlign: "center", padding: open ? 1 : 0.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              gap: open ? 1 : 0, 
              transition: "gap 0.3s",
            }}
          >
        
            <img
              src={logo2}
              alt="Logo 1"
              style={{
                width: open ? "40%" : "0", 
                transition: "width 0.3s",
                opacity: open ? 1 : 0,
              }}
            />
          
            <img
              src={logo1}
              alt="Logo 2"
              style={{
                width: open ? "40%" : "100%",
                transition: "width 0.3s",
              }}
            />
          </Box>
        </Box>

        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: "block" }}>
            <Tooltip title={open ? "" : "Dashboard"} arrow>
              <ListItemButton
                component={Link}
                to="/dashboard"
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  ...(location.pathname === "/dashboard"
                    ? activeStyle
                    : defaultStyle),
                  "&:hover": {
                    backgroundColor:
                      location.pathname === "/dashboard" ? "black" : "#f5f5f5", 
                    color:
                      location.pathname === "/dashboard"
                        ? "white"
                        : theme.palette.text.primary,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <HomeIcon />
                </ListItemIcon>
                {open && <ListItemText primary="Dashboard" />}
              </ListItemButton>
            </Tooltip>
          </ListItem>

          {[
            { text: "Roles", path: "/role-create" },
            { text: "User management", path: "/user-management" },
            { text: "Message", path: "/message" },
            { text: "Properties", path: "/properties-list" },
            { text: "Property Alloted", path: "/property-alloted-list" },
            { text: "Lease", path: "/lease-expired" },
            { text: "Tenant Request", path: "/tenant-request" },
          ].map(({ text, path }) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <Tooltip title={open ? "" : text} arrow>
                <ListItemButton
                  component={Link}
                  to={path}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    ...(location.pathname === path
                      ? activeStyle
                      : defaultStyle),
                    "&:hover": {
                      backgroundColor:
                        location.pathname === path ? "black" : "#f5f5f5", 
                      color:
                        location.pathname === path
                          ? "white"
                          : theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {getIconForText(text)}
                  </ListItemIcon>
                  {open && <ListItemText primary={text} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: (theme) => theme.palette.background.default,
          padding: 3,
          marginTop: "64px",
        }}
      >
      
      </Box>
    </Box>
  );
}
