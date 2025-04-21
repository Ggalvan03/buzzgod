"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        alert("Message sent!");
        setMessage("");
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="bg-[#0e0e10] text-white min-h-screen flex flex-col items-center justify-start py-10 px-4 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Welcome to Buzzgod’s Stream</h1>

      <div className="w-full max-w-md bg-[#1f1f23] rounded-lg p-6 flex flex-col gap-4">
        <p className="text-lg font-semibold text-white">Send a message</p>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-3 rounded bg-[#2b2b30] text-white border border-[#3a3a3d] focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Send Message
        </button>
      </div>
    </div>
  );
}
