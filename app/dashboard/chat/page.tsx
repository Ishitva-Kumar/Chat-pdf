"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleGenAI } from "@google/genai";

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export default function FileChat() {
  const searchParams = useSearchParams();
  const fileUrl = searchParams.get("fileUrl");
  const fileName = searchParams.get("fileName");

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !fileUrl) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key not configured.");

      // Fetch PDF and convert to base64 (browser-safe)
      const pdfResp = await fetch(fileUrl).then((r) => r.arrayBuffer());
      const base64Pdf = arrayBufferToBase64(pdfResp);

      const ai = new GoogleGenAI({ apiKey });
      const contents = [
        { text: input },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64Pdf,
          },
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents,
      });

      setMessages((prev) => [...prev, { role: "ai", content: response.text || "No response" }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: `Error: ${err.message || "Unknown error"}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--background)", color: "var(--foreground)", minHeight: "100svh" }} className="flex flex-col h-screen p-6">
      <h2 className="text-xl font-bold mb-2" style={{ color: "var(--primary)" }}>{fileName ? `Chat about: ${fileName}` : "Chat"}</h2>
      <div style={{ background: "var(--card)", color: "var(--card-foreground)", border: "1px solid var(--border)", borderRadius: 8 }} className="flex-1 overflow-y-auto p-2 mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
            style={{ color: msg.role === "user" ? "var(--primary)" : "var(--primary)" }}>
            <span style={{ fontWeight: 600 }}>
              {msg.role === "user" ? "You" : "ChatPDF"}:
            </span>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type your question..."
          disabled={isLoading}
          style={{ background: "var(--input)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: 4 }}
        />
        <button
          className="ml-2 px-4 py-1"
          onClick={handleSend}
          disabled={isLoading}
          style={{ background: "var(--primary)", color: "var(--primary-foreground)", border: "none", borderRadius: 4, marginLeft: 8, padding: "6px 16px", cursor: isLoading ? "not-allowed" : "pointer" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}