import React from "react";
import { useChatContext } from "../context/ChatContext";
import { ChatMessage } from "../components/ChatMessage";
import { Star } from "lucide-react";

export const HistoryPage = () => {
  const { conversations } = useChatContext();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today's Chats";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday's Chats";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const groupedConversations = conversations.reduce((groups, conv) => {
    const dateLabel = formatDate(conv.timestamp);
    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(conv);
    return groups;
  }, {});

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[rgba(215,199,244,0.2)] to-[rgba(151,133,186,0.2)]">
      <div className="max-w-5xl mx-auto p-4 lg:p-8">
        <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">
          Conversation History
        </h1>

        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No conversations saved yet</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedConversations).map(([dateLabel, convs]) => (
              <div key={dateLabel}>
                <h2 className="text-xl font-semibold mb-4">{dateLabel}</h2>
                <div className="space-y-4">
                  {convs.map((conversation) => (
                    <div
                      key={conversation.id}
                      className="bg-[#d7c7f4] rounded-lg p-4 lg:p-6"
                    >
                      {conversation.messages.map((message, index) => (
                        <ChatMessage
                          key={index}
                          message={message}
                          showFeedback={false}
                        />
                      ))}
                      {conversation.feedback && (
                        <div className="mt-4 pt-4 border-t border-[#9785ba]/30">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">Rating:</span>
                            {renderStars(conversation.feedback.rating)}
                          </div>
                          {conversation.feedback.feedback && (
                            <div>
                              <span className="font-semibold">Feedback:</span>{" "}
                              {conversation.feedback.feedback}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
