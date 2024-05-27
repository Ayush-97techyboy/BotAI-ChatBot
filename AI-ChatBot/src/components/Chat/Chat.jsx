import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import data from "../../data.json";
import styles from "./Chat.module.css";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    const savedConversations =
      JSON.parse(localStorage.getItem("conversations")) || [];
    setConversations(savedConversations);
  }, []);

  const handleInputChange = (e) => setCurrentInput(e.target.value);

  const handleSend = () => {
    const response = data.find(
      (item) => item.question.toLowerCase() === currentInput.toLowerCase()
    );
    const newConversation = {
      id: uuidv4(),
      question: currentInput,
      response: response
        ? response.response
        : "I'm not sure how to answer that.",
      feedback: {},
    };
    const updatedConversations = [...conversations, newConversation];
    setConversations(updatedConversations);
    localStorage.setItem("conversations", JSON.stringify(updatedConversations));
    setCurrentInput("");
  };

  const handleFeedback = (id, type) => {
    const updatedConversations = conversations.map((conv) =>
      conv.id === id
        ? {
            ...conv,
            feedback: { ...conv.feedback, [type]: !conv.feedback[type] },
          }
        : conv
    );
    setConversations(updatedConversations);
    localStorage.setItem("conversations", JSON.stringify(updatedConversations));
  };

  return (
    <div className={styles.chatContainer}>
      <List className={styles.messageList}>
        {conversations.map((conv) => (
          <ListItem key={conv.id} className={styles.messageItem}>
            <ListItemText
              primary={`Q: ${conv.question}`}
              secondary={`A: ${conv.response}`}
            />
            <div>
              <IconButton onClick={() => handleFeedback(conv.id, "like")}>
                <ThumbUpIcon
                  color={conv.feedback.like ? "primary" : "inherit"}
                />
              </IconButton>
              <IconButton onClick={() => handleFeedback(conv.id, "dislike")}>
                <ThumbDownIcon
                  color={conv.feedback.dislike ? "secondary" : "inherit"}
                />
              </IconButton>
            </div>
          </ListItem>
        ))}
      </List>
      <div className={styles.inputContainer}>
        <TextField
          value={currentInput}
          onChange={handleInputChange}
          label="Type your question..."
          fullWidth
        />
        <Button onClick={handleSend} variant="contained" color="primary">
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
