
import React, { useEffect, useState, useRef } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const MessageApp = ({ selectedUser }) => {
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null); 

  
  const getCurrentUserId = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.userId; // Assuming the userId is stored in the token payload
      } catch (error) {
        console.error("Error decoding token", error);
        return null;
      }
    }
    return null;
  };

  const currentUserId = getCurrentUserId(); // Get the current user ID from the token

  // Fetch messages when the selected user changes
  useEffect(() => {
    if (selectedUser && currentUserId) {
      setLoading(true);
      axios
        .get(
          `http://localhost:5000/api/messages/conversation/${currentUserId}/${selectedUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        )
        .then((res) => {
          setAllMessages(res.data.data);
          setLoading(false);
        })
        .catch((error) => {
          toast.error("Error fetching messages.");
          setLoading(false);
        });
      setMessage(""); // Clear message input on user change
    }
  }, [selectedUser, currentUserId]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      toast.error("Authentication token not found.");
      return;
    }

    if (!message.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }

    const newMessage = {
      senderId: currentUserId,
      recipientId: selectedUser.id,
      content: message,
      status: "sent", 
      timestamp: new Date(),
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/messages/send`,
        newMessage,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Update the state: If the current user sends the message, remove the "sent" status from the last message
      setAllMessages((prev) => {
        let updatedMessages = [...prev];

        // If the current user sends a new message, remove "sent" status from the last message they sent
        if (currentUserId === newMessage.senderId) {
          updatedMessages = updatedMessages.map((msg, index) => {
            if (index === updatedMessages.length - 1 && msg.senderId === currentUserId) {
              return { ...msg, status: null }; // Remove the "sent" status
            }
            return msg;
          });
        }

        // Add the new message with the "sent" status
        updatedMessages.push(response.data.data);
        return updatedMessages;
      });

      setMessage("");

      // Optionally, send the message to the WebSocket server
      if (socket) {
        socket.send(JSON.stringify(response.data.data));
      }
    } catch (error) {
      toast.error("Failed to send message.");
      console.error("Error sending message:", error);
    }
  };

  // Render messages with dynamic status
  const renderMessages = () => {
    return allMessages.map((msg) => {
      const isCurrentUserSender = msg.senderId === currentUserId;
      const isSelectedUserSender = msg.senderId === selectedUser.id;

      // Determine the status to display for the message
      const status =
        isCurrentUserSender
          ? "sent"
          : isSelectedUserSender
          ? "seen"
          : msg.status; // Use msg.status as a fallback

      return (
        <Box
          key={msg._id}
          style={{
            alignSelf: isCurrentUserSender ? "flex-end" : "flex-start",
            backgroundColor: isCurrentUserSender ? "#007bff" : "#f0f0f0",
            color: isCurrentUserSender ? "#fff" : "#000",
            borderRadius: 10,
            padding: 10,
            marginBottom: 5,
            maxWidth: "60%",
          }}
        >
          <Typography variant="body2">{msg.content}</Typography>
          {msg.status && (
            <Typography
              variant="caption"
              style={{ fontStyle: "italic", marginTop: 5 }}
            >
              {status}
            </Typography>
          )}
        </Box>
      );
    });
  };

  return (
    <Box>
      <Typography variant="h6" style={{ marginTop: 50 }}>
        Chat with {selectedUser.name || "User"}
      </Typography>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          marginTop: 20,
          height: "400px", // Fixed height for the scrollable container
          overflowY: "auto", // Enable vertical scrolling
          border: "1px solid #ddd", // Optional: Add border
          padding: "10px", // Optional: Add padding
          borderRadius: "5px", // Optional: Rounded corners
          backgroundColor: "#f9f9f9", // Optional: Background color
        }}
      >
        {loading ? (
          <Typography>Loading messages...</Typography>
        ) : (
          renderMessages()
        )}
        <Box ref={messagesEndRef} style={{ height: 1 }}></Box>
      </Box>
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
        Send
      </Button>
    </Box>
  );
};

export default MessageApp;






