
import React, { useEffect, useState, useMemo } from "react";
import { Grid, List, ListItem, ListItemText, Typography, Divider } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import MessageApp from "./Message"; // Message Component
import Loader from "../../../components/Loader/Loader"; // Loader Component
import apiconfig from "../../../config/ServiceApi"; // API Config

const AllUserList = () => {
  const [users, setUsers] = useState({ owners: [], tenants: [], maintenance: [] });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${apiconfig.baseURL}${apiconfig.messageList}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        setUsers(userData);

        // Automatically select the first tenant if available, else maintenance, then owners
        const firstUser =
          userData.tenants[0] || userData.maintenance[0] || userData.owners[0] || null;
        if (firstUser) {
          setSelectedUser(firstUser);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const userRoles = useMemo(() => ["tenants", "maintenance", "owners"], []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={2} style={{ height: "100vh" }}>
      {/* User List Section */}
      <Grid
        item
        xs={4}
        style={{
          borderRight: "1px solid #ccc",
          overflowY: "auto",
          maxHeight: "100vh",
          padding: "20px",
          backgroundColor: "#fff", // Set background to white
        }}
      >
        <Typography variant="h6" style={{ marginBottom: 10 }}>
          Users
        </Typography>
        <List style={{ maxHeight: "80vh", overflowY: "auto" }}>
          {/* Displaying Tenants first, followed by Maintenance and Owners */}
          {userRoles.map((role) => (
            <React.Fragment key={role}>
              <Typography variant="subtitle1" style={{ marginTop: 10, fontWeight: "bold" }}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Typography>
              <Divider style={{ margin: "10px 0" }} />
              {users[role]?.length > 0 ? (
                users[role].map((user) => (
                  <ListItem
                    button
                    key={user.id || user.tenantId}
                    onClick={() => setSelectedUser(user)}
                    style={{
                      padding: "10px",
                      borderRadius: "5px",
                      marginBottom: "5px",
                      transition: "background-color 0.3s", // Smooth transition
                    }}
                  >
                    <ListItemText primary={user.name || user.tenantName || "No Name"} />
                  </ListItem>
                ))
              ) : (
                <Typography>No {role} available.</Typography>
              )}
            </React.Fragment>
          ))}
        </List>
      </Grid>

      <Grid item xs={8}>
        {selectedUser ? (
          <MessageApp selectedUser={selectedUser} />
        ) : (
          <Typography variant="h6" style={{ marginTop: 60 }}>
            Please select a user to view messages.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default AllUserList;
