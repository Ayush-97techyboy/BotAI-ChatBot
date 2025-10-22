import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import { Button } from "./UI/button";
import { Edit, MessageSquare, Clock } from "lucide-react";

export const Sidebar = ({ onNewChat }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { conversations, loadConversation } = useChatContext();

  const handleNewChat = () => {
    onNewChat();
    navigate("/");
  };

  const handlePastConversations = () => {
    navigate("/history");
  };

  const handleFeedback = () => {
    navigate("/feedback");
  };

  const handleLoadConversation = (id) => {
    loadConversation(id);
    navigate("/");
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getConversationPreview = (messages) => {
    const lastUserMessage = messages
      .filter((msg) => msg.sender === "user")
      .pop();
    return lastUserMessage ? lastUserMessage.text.slice(0, 30) + "..." : "New Chat";
  };

  return (
    <aside className="w-52 h-full bg-white border-r border-gray-200 flex-shrink-0 flex flex-col hidden md:flex">
      <nav className="p-4 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-[#d7c7f4]">
          <img
            src="/src/assets/Soul AI.png"
            alt="Bot AI Logo"
            className="w-10 h-10"
          />
          <span className="text-xl font-normal">New Chat</span>
          <button
            onClick={handleNewChat}
            className="ml-auto p-1 hover:bg-gray-100 rounded"
            aria-label="New Chat"
          >
            <Edit size={20} />
          </button>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="space-y-2">
          {conversations.slice(0, 10).map((conv) => (
            <button
              key={conv.id}
              onClick={() => handleLoadConversation(conv.id)}
              className="w-full text-left p-3 rounded-lg hover:bg-[#d7c7f4]/50 transition-colors border border-transparent hover:border-[#d7c7f4]"
            >
              <div className="flex items-start gap-2">
                <Clock size={14} className="mt-0.5 text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getConversationPreview(conv.messages)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(conv.timestamp)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          onClick={handlePastConversations}
          className={`w-full justify-start font-bold text-[#414146] hover:bg-[#d7c7f4] ${
            location.pathname === "/history" ? "bg-[#d7c7f4]" : ""
          }`}
        >
          <Clock size={16} className="mr-2" />
          Past Conversations
        </Button>
        <Button
          variant="ghost"
          onClick={handleFeedback}
          className={`w-full justify-start font-bold text-[#414146] hover:bg-[#d7c7f4] ${
            location.pathname === "/feedback" ? "bg-[#d7c7f4]" : ""
          }`}
        >
          <MessageSquare size={16} className="mr-2" />
          Feedback
        </Button>
      </div>
    </aside>
  );
};
