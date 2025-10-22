import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Rating,
  TextField,
  Button,
} from "@mui/material";
import styles from "./Feedback.module.css";

const Feedback = () => {
  const [conversations, setConversations] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [filter, setFilter] = useState(0);

  useEffect(() => {
    const savedConversations =
      JSON.parse(localStorage.getItem("conversations")) || [];
    setConversations(savedConversations);
  }, []);

  const handleRatingChange = (id, newRating) => {
    setRatings({ ...ratings, [id]: newRating });
  };

  const handleCommentChange = (id, newComment) => {
    setComments({ ...comments, [id]: newComment });
  };

  const handleSubmitFeedback = (id) => {
    const updatedConversations = conversations.map((conv) =>
      conv.id === id
        ? {
            ...conv,
            feedback: {
              ...conv.feedback,
              rating: ratings[id],
              comment: comments[id],
            },
          }
        : conv
    );
    setConversations(updatedConversations);
    localStorage.setItem("conversations", JSON.stringify(updatedConversations));
  };

  const filteredConversations = conversations.filter(
    (conv) => filter === 0 || conv.feedback.rating === filter
  );

  return (
    <div className={styles.feedbackContainer}>
      <TextField
        label="Filter by Rating"
        type="number"
        value={filter}
        onChange={(e) => setFilter(Number(e.target.value))}
        InputProps={{ inputProps: { min: 0, max: 5 } }}
        fullWidth
        className={styles.filterInput}
      />
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Response</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Submit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredConversations.map((conv) => (
              <TableRow key={conv.id}>
                <TableCell>{conv.question}</TableCell>
                <TableCell>{conv.response}</TableCell>
                <TableCell className={styles.ratingCell}>
                  <Rating
                    value={ratings[conv.id] || conv.feedback.rating || 0}
                    onChange={(e, newValue) =>
                      handleRatingChange(conv.id, newValue)
                    }
                  />
                </TableCell>
                <TableCell className={styles.commentCell}>
                  <TextField
                    value={comments[conv.id] || conv.feedback.comment || ""}
                    onChange={(e) =>
                      handleCommentChange(conv.id, e.target.value)
                    }
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleSubmitFeedback(conv.id)}
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Feedback;
