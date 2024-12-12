
import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import apiconfig from "../../../config/ServiceApi"; // Import Service API configuration
import Loader from "../../../components/Loader/Loader"; // Import Loader component

const MessageApp = ({ selectedUser }) => {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]); // Combined messages state
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    if (!selectedUser) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      // Fetch sent messages
      const sentMessagesResponse = await axios.get(
        `${apiconfig.baseURL}${apiconfig.sentMessages}/${selectedUser.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const sentMessages = sentMessagesResponse.data.data || [];

      // Fetch received messages
      const receivedMessagesResponse = await axios.get(
        `https://propertymanagement-nf5c.onrender.com/api/messages/received/${selectedUser.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const receivedMessages = receivedMessagesResponse.data.data || [];

      // Combine and sort messages by createdAt
      const combinedMessages = [
        ...sentMessages.map((msg) => ({ ...msg, type: "sent" })),
        ...receivedMessages.map((msg) => ({ ...msg, type: "received" })),
      ].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      setAllMessages(combinedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to fetch messages.");
    } finally {
      setLoading(false); // Stop loading after fetching
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedUser]);

  const handleSendMessage = async () => {
    if (!selectedUser || !message.trim()) {
      toast.error("Please select a user and type a message.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${apiconfig.baseURL}/messages/send`,
        {
          recipientId: selectedUser.id,
          message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Message sent successfully!");
      setMessage("");
      fetchMessages(); // Refresh messages after sending
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message.");
    }
  };

  return (
    <Box>
      <Typography variant="h6" style={{ marginTop: 60 }}>
        Message Box
      </Typography>

      {/* Loader component */}
      {loading ? (
        <Loader />
      ) : (
        <Box
          style={{
            border: "1px solid #ccc",
            borderRadius: 5,
            padding: 10,
            maxHeight: 400,
            overflowY: "auto",
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* Display Messages in Interleaved Order */}
          {allMessages.map((msg, index) => (
            <Box
              key={index}
              style={{
                alignSelf: msg.type === "sent" ? "flex-end" : "flex-start",
                backgroundColor: msg.type === "sent" ? "#007bff" : "#f0f0f0",
                color: msg.type === "sent" ? "#fff" : "#000",
                borderRadius: 10,
                padding: 10,
              }}
            >
              <Typography variant="body2">
                {msg.type === "sent" ? (
                  <strong>You:</strong>
                ) : (
                  <strong>{msg.sender.fullname}:</strong>
                )}{" "}
                {msg.message}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ marginTop: 20 }}
      />
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: 20 }}
        onClick={handleSendMessage}
      >
        Send Message
      </Button>
    </Box>
  );
};

export default MessageApp;



