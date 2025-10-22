import React, { useState, useRef, useEffect } from "react";
import { useChatContext } from "../context/ChatContext";
import { aiResponses, suggestionCards } from "../data/sampleData";
import { ChatMessage } from "../components/ChatMessage";
import { FeedbackDialog } from "../components/FeedbackDialog";
import { Button } from "../components/UI/button";
import { Input } from "../components/UI/input";
import { Card, CardContent } from "../components/UI/card";

export const ChatPage = () => {
  const {
    currentConversation,
    addMessage,
    saveConversation,
    updateMessageFeedback,
  } = useChatContext();
  const [input, setInput] = useState("");
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentConversation]);

  const getAIResponse = (question) => {
    const normalizedQuestion = question.toLowerCase().trim();
    // Check sampleData first
    if (aiResponses[normalizedQuestion]) {
      return aiResponses[normalizedQuestion];
    }
    // Fallback to data.json if needed, but since sampleData has more, use it
    return "Sorry, Did not understand your query!";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);

    setTimeout(() => {
      const aiResponse = getAIResponse(input);
      const aiMessage = {
        sender: "ai",
        text: aiResponse,
        timestamp: new Date().toISOString(),
        feedback: null,
      };
      addMessage(aiMessage);
    }, 500);

    setInput("");
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const handleSave = () => {
    if (currentConversation.length === 0) return;
    setShowFeedbackDialog(true);
  };

  const handleFeedbackSubmit = (feedback) => {
    saveConversation(feedback);
    setShowFeedbackDialog(false);
  };

  const handleMessageFeedback = (index, feedbackType) => {
    updateMessageFeedback(index, feedbackType);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-[rgba(215,199,244,0.2)] to-[rgba(151,133,186,0.2)]">
      <div className="hidden lg:block p-4">
        <h1 className="text-[28px] font-bold text-[#9785ba]">Bot AI</h1>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 lg:px-8 pb-4"
      >
        {currentConversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl lg:text-[28px] font-medium">
                How Can I Help You Today?
              </h2>
              <img
                src="/src/assets/Soul AI.png"
                alt="Bot AI"
                className="w-20 h-20 mx-auto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
              {suggestionCards.map((card, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] bg-white"
                  onClick={() => handleSuggestionClick(card.title)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto py-4">
            {currentConversation.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                onFeedback={
                  message.sender === "ai"
                    ? (type) => handleMessageFeedback(index, type)
                    : null
                }
              />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm p-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto flex gap-4 items-center"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Bot AI…"
            className="flex-1 bg-white border-gray-300"
          />
          <Button
            type="submit"
            className="bg-[#d7c7f4] text-black hover:bg-[#c5b3e8] px-6"
          >
            Ask
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-[#d7c7f4] text-black hover:bg-[#c5b3e8] px-6"
          >
            Save
          </Button>
        </form>
      </div>

      <FeedbackDialog
        open={showFeedbackDialog}
        onClose={() => setShowFeedbackDialog(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};
