"use client";

import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import ChatButton from "./ChatButton";
import ChatModal from "./ChatModal";

export default function HotelChatbot({ hotelId, hotelName }) {
  const [open, setOpen] = useState(false);
  const { messages, loading, error, sendMessage, clearChat, messagesEndRef } = useChat(hotelId);

  return (
    <>
      {!open && <ChatButton onClick={() => setOpen(true)} />}
      <ChatModal
        open={open}
        onClose={() => setOpen(false)}
        messages={messages}
        loading={loading}
        error={error}
        sendMessage={sendMessage}
        clearChat={clearChat}
        messagesEndRef={messagesEndRef}
        name={hotelName}
      />
    </>
  );
}
