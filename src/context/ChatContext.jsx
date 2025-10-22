import React, { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem("conversations");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentConversation, setCurrentConversation] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  const addMessage = (message) => {
    setCurrentConversation((prev) => [...prev, message]);
  };

  const saveConversation = (feedback) => {
    if (currentConversation.length === 0) return;

    const newConversation = {
      id: conversationId || Date.now(),
      messages: currentConversation,
      timestamp: new Date().toISOString(),
      feedback: feedback || null,
    };

    setConversations((prev) => {
      const existingIndex = prev.findIndex((c) => c.id === newConversation.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newConversation;
        return updated;
      }
      return [...prev, newConversation];
    });

    return newConversation.id;
  };

  const startNewConversation = () => {
    setCurrentConversation([]);
    setConversationId(null);
  };

  const loadConversation = (id) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setCurrentConversation(conv.messages);
      setConversationId(conv.id);
    }
  };

  const updateFeedback = (id, feedback) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id ? { ...conv, feedback } : conv
      )
    );
  };

  const updateMessageFeedback = (messageIndex, feedbackType) => {
    setCurrentConversation((prev) =>
      prev.map((msg, idx) =>
        idx === messageIndex ? { ...msg, feedback: feedbackType } : msg
      )
    );
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        conversationId,
        addMessage,
        saveConversation,
        startNewConversation,
        loadConversation,
        updateFeedback,
        updateMessageFeedback,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
