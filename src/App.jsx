import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatProvider, useChatContext } from "./context/ChatContext";
import { Sidebar } from "./components/Sidebar";
import { MobileHeader } from "./components/MobileHeader";
import { ChatPage } from "./pages/ChatPage";
import { HistoryPage } from "./pages/HistoryPage";
import { FeedbackPage } from "./pages/FeedbackPage";

const AppContent = () => {
  const { startNewConversation } = useChatContext();

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <div className="flex gap-0.5 h-[24px] items-center px-2 bg-white">
        <div className="bg-[#ff0000] w-[21px] h-[21px] rounded-full" />
        <div className="bg-[#ff9800] w-[21px] h-[21px] rounded-full" />
        <div className="bg-[#33ea05] w-[21px] h-[21px] rounded-full" />
      </div>

      <MobileHeader onNewChat={startNewConversation} />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex">
          <Sidebar onNewChat={startNewConversation} />
        </div>

        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;
