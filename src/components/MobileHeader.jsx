import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";
import { Menu, Edit, Clock } from "lucide-react";
import { Button } from "./UI/button";

export const MobileHeader = ({ onNewChat }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { conversations, loadConversation } = useChatContext();

  const handleNewChat = () => {
    onNewChat();
    navigate("/");
    setMenuOpen(false);
  };

  const handlePastConversations = () => {
    navigate("/history");
    setMenuOpen(false);
  };

  const handleLoadConversation = (id) => {
    loadConversation(id);
    navigate("/");
    setMenuOpen(false);
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
    <>
      <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 hover:bg-gray-100 rounded"
          aria-label="Menu"
        >
          <Menu size={24} className="text-[#9785ba]" />
        </button>
        <span className="text-xl font-bold text-[#9785ba]">Bot AI</span>
        <div className="w-8" />
      </header>

      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setMenuOpen(false)}>
          <div
            className="bg-white w-64 h-full p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-4 border-b border-[#d7c7f4]">
              <img
                src="https://c.animaapp.com/mh0r7phtvLzj3V/img/group-1000011095.png"
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

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <Button
                variant="ghost"
                onClick={handlePastConversations}
                className="w-full justify-start font-bold text-[#414146] hover:bg-[#d7c7f4]"
              >
                Past Conversations
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/feedback");
                  setMenuOpen(false);
                }}
                className="w-full justify-start font-bold text-[#414146] hover:bg-[#d7c7f4]"
              >
                Feedback Overview
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
