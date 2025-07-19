"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pdfText, setPdfText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    script.onload = () => {
      // @ts-ignore
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
    };
    document.body.appendChild(script);
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedFileName(file.name);
      const reader = new FileReader();

      reader.onload = async () => {
        // @ts-ignore
        const typedArray = new Uint8Array(reader.result);
        // @ts-ignore
        const pdf = await window.pdfjsLib.getDocument(typedArray).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          fullText += strings.join(" ") + "\n";
        }

        console.log("✅ PDF Contents:\n", fullText);
        setPdfText(fullText);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: pdfText ? `${pdfText}\n\n${input}` : input,
        }),
      });

      const data = await response.json();

      const aiText =
        data?.message ?? "Something went wrong. Try again.";

      setMessages((prev) => [...prev, { role: "model", text: aiText }]);
    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Error fetching response." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8 font-sans">
      <main className="max-w-2xl mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center text-black dark:text-white">
          My Aichatbot
        </h1>

        {/* Chat Messages */}
        <div className="flex flex-col space-y-4 mb-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg max-w-[75%] ${
                msg.role === "user"
                  ? "bg-blue-100 dark:bg-blue-900 self-end text-right"
                  : "bg-gray-200 dark:bg-gray-800 self-start text-left"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          ))}

          {isTyping && (
            <div className="italic text-sm text-gray-500 dark:text-gray-400 self-start">
              AI is typing...
            </div>
          )}
        </div>

        {/* Input and Send */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg dark:bg-gray-900 dark:text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Send
          </button>
        </div>

        {/* PDF Upload */}
        <div className="flex justify-between items-center mt-4">
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="text-sm text-gray-600 dark:text-gray-300"
          />
          {uploadedFileName && (
            <span className="text-sm text-green-700 dark:text-green-400">
              ✅ Uploaded: {uploadedFileName}
            </span>
          )}
        </div>
      </main>
    </div>
  );
}
