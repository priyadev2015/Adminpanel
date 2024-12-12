import React, { useEffect, useState } from "react";
import { Grid, List, ListItem, ListItemText, Typography, Divider } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import MessageApp from "./Message"; 
import Loader from "../../../components/Loader/Loader"; 
import apiconfig from "../../../config/ServiceApi"; 

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

        // Set the default selected user (first user found in the list)
        const firstUser =
          userData.owners[0] || userData.tenants[0] || userData.maintenance[0] || null;
        setSelectedUser(firstUser);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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
        }}
      >
        <Typography variant="h6" style={{ marginBottom: 10 }}>
          Users
        </Typography>
        <List style={{ maxHeight: "80vh", overflowY: "auto" }}>
          {["owners", "tenants", "maintenance"].map((role) => (
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
                      backgroundColor: selectedUser?.id === user.id || selectedUser?.tenantId === user.tenantId ? "#f0f0f0" : "transparent",
                      padding: "10px",
                      borderRadius: "5px",
                      marginBottom: "5px",
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

      {/* Message App Section */}
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
