import React, { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

export const ChatMessage = ({ message, onFeedback, showFeedback = true }) => {
  const [hovering, setHovering] = useState(false);
  const isUser = message.sender === "user";

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex gap-3 mb-4 animate-fade-in">
      <img
        src={
          isUser
            ? "/src/assets/aloha.png"
            : "/src/assets/Soul AI.png"
        }
        alt={isUser ? "User" : "Soul AI"}
        className="w-12 h-12 rounded-full flex-shrink-0"
      />
      <div className="flex-1">
        <div className="font-bold text-sm mb-1">
          {isUser ? "You" : <span>Soul AI</span>}
        </div>
        {isUser ? (
          <div className="text-base">{message.text}</div>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <p className="text-base mb-1">{message.text}</p>
            {message.feedback && (
              <div className="flex items-center gap-1 mt-1 text-xs">
                {message.feedback === "like" ? (
                  <ThumbsUp size={14} className="text-blue-600" />
                ) : (
                  <ThumbsDown size={14} className="text-red-600" />
                )}
              </div>
            )}
            {showFeedback && hovering && (
              <div className="flex gap-2 mt-2 animate-fade-in">
                <button
                  onClick={() => onFeedback && onFeedback("like")}
                  className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                    message.feedback === "like" ? "text-blue-600" : "text-gray-500"
                  }`}
                  aria-label="Like"
                >
                  <ThumbsUp size={16} />
                </button>
                <button
                  onClick={() => onFeedback && onFeedback("dislike")}
                  className={`p-1 rounded hover:bg-gray-200 transition-colors ${
                    message.feedback === "dislike" ? "text-red-600" : "text-gray-500"
                  }`}
                  aria-label="Dislike"
                >
                  <ThumbsDown size={16} />
                </button>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-500 mt-1">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};
