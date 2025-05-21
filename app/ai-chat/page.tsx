"use client";

import { useState } from "react";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResponse(data.response || data.error);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        setResponse("Terjadi kesalahan: " + error.message);
      } else {
        console.error("Unknown error:", error);
        setResponse("Terjadi kesalahan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">AI Chat Assistant</h1>

      <textarea
        className="w-full border p-2 rounded"
        rows={4}
        placeholder="Tulis pertanyaanmu..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Mengirim..." : "Kirim"}
      </button>

      {response && (
        <div className="bg-gray-100 p-4 rounded border">
          <strong>Bot:</strong> {response}
        </div>
      )}
    </div>
  );
}
