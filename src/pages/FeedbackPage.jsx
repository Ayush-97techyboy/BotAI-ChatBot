import React, { useState, useEffect } from "react";
import { useChatContext } from "../context/ChatContext";
import { Star, Filter } from "lucide-react";
import { Button } from "../components/UI/button";
import { Input } from "../components/UI/input";
import { ChatMessage } from "../components/ChatMessage";

export const FeedbackPage = () => {
  const { conversations } = useChatContext();
  const [filterRating, setFilterRating] = useState(0);

  // Collect all feedback points from all conversations
  const allFeedbacks = conversations
    .filter((conv) => conv.feedback)
    .map((conv) => ({
      id: conv.id,
      timestamp: conv.timestamp,
      feedback: conv.feedback,
      messages: conv.messages,
    }));

  const filteredFeedbacks = allFeedbacks.filter(
    (fb) => filterRating === 0 || fb.feedback.rating === filterRating
  );

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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[rgba(215,199,244,0.2)] to-[rgba(151,133,186,0.2)]">
      <div className="max-w-5xl mx-auto p-4 lg:p-8">
        <h1 className="text-3xl font-bold mb-8 text-center lg:text-left">
          Feedback Overview
        </h1>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={20} />
            <span className="font-medium">Filter by Rating:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterRating === 0 ? "default" : "outline"}
              onClick={() => setFilterRating(0)}
              className="px-4"
            >
              All
            </Button>
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={filterRating === rating ? "default" : "outline"}
                onClick={() => setFilterRating(rating)}
                className="px-4"
              >
                {rating} Star{rating > 1 ? "s" : ""}
              </Button>
            ))}
          </div>
        </div>

        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {filterRating === 0
                ? "No feedback submitted yet"
                : `No feedback with ${filterRating} star${filterRating > 1 ? "s" : ""}`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFeedbacks.map((fb) => (
              <div
                key={fb.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Rating:</span>
                    {renderStars(fb.feedback.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(fb.timestamp)}
                  </span>
                </div>
                {fb.feedback.feedback && (
                  <div className="mb-4">
                    <span className="font-semibold">Feedback:</span>{" "}
                    <p className="mt-1 text-gray-700">{fb.feedback.feedback}</p>
                  </div>
                )}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Conversation:</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {fb.messages.map((msg, idx) => (
                      <ChatMessage
                        key={idx}
                        message={msg}
                        showFeedback={false}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
