import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Copy, Lock, Unlock } from "lucide-react";

const EmojiEncoder = () => {
  const [inputText, setInputText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("😀");
  const [encodedMessage, setEncodedMessage] = useState("");
  const [decodedMessage, setDecodedMessage] = useState("");
  const [decodeInput, setDecodeInput] = useState("");
  const [copied, setCopied] = useState(false);

  const emojis = ["😀", "😊", "🌟", "🎈", "🌸", "🐱", "🚀", "🎨", "🎭", "🎮"];

  // Use variation selectors for encoding
  const digitToVS = (digit: any) =>
    String.fromCodePoint(0xFE00 + parseInt(digit));
  const DOT = String.fromCodePoint(0xFE0A); // Special separator

  const vsToDigit = (vs: any) => {
    const code = vs.codePointAt(0);
    if (code >= 0xFE00 && code <= 0xFE09) {
      return (code - 0xFE00).toString();
    }
    return null;
  };

  const handleEncode = () => {
    // Convert each character to its position number (a=1, b=2, etc)
    const numbers = inputText
      .toLowerCase()
      .split("")
      .map((char) => {
        if (char === " ") return "27";
        const code = char.charCodeAt(0) - 96;
        return code >= 1 && code <= 26 ? code.toString() : "";
      })
      .filter((x) => x)
      .join(".");

    // Convert each digit and dot to variation selectors
    const encoded = numbers
      .split("")
      .map((char) => char === "." ? DOT : digitToVS(char))
      .join("");

    setEncodedMessage(`${selectedEmoji}${encoded}`);
  };

  const handleDecode = () => {
    try {
      // Remove the emoji and get variation selectors
      const chars = Array.from(decodeInput.slice(1));

      // Convert back to numbers and dots
      let numbers = "";
      for (const char of chars) {
        const digit = vsToDigit(char);
        if (digit !== null) {
          numbers += digit;
        } else if (char === DOT) {
          numbers += ".";
        }
      }

      // Convert numbers back to letters
      const decoded = numbers
        .split(".")
        .map((num) => {
          const code = parseInt(num);
          if (code === 27) return " ";
          return code >= 1 && code <= 26 ? String.fromCharCode(code + 96) : "";
        })
        .join("");

      setDecodedMessage(decoded || "Invalid message");
    } catch (error) {
      setDecodedMessage("Invalid message");
    }
  };

  const handleCopy = async () => {
    if (encodedMessage) {
      await navigator.clipboard.writeText(encodedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mt-4">Emoji Encoder</h1>
      <p className=" text-gray-900">
        Hide secret messages in emojis using variation selectors.
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Hide Message in Emoji
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 m-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Emoji
            </label>
            <div className="flex gap-2 text-2xl">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`p-2 rounded hover:bg-gray-100 ${
                    selectedEmoji === emoji ? "bg-gray-100" : ""
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Enter Message
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Type your message..."
            />
          </div>

          <button
            onClick={handleEncode}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Encode
          </button>

          {encodedMessage && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Encoded Emoji (click to copy)
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="p-3 bg-gray-100 rounded text-2xl cursor-pointer"
                  onClick={handleCopy}
                >
                  {encodedMessage}
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  {copied
                    ? <Check className="w-5 h-5 text-green-500" />
                    : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Unlock className="w-5 h-5" />
            Reveal Hidden Message
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 m-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter Emoji with Hidden Message
            </label>
            <input
              type="text"
              value={decodeInput}
              onChange={(e) => setDecodeInput(e.target.value)}
              className="w-full p-2 border rounded text-2xl"
              placeholder="Paste emoji here..."
            />
          </div>

          <button
            onClick={handleDecode}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Decode
          </button>

          {decodedMessage && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Hidden Message
              </label>
              <div className="p-3 bg-gray-100 rounded">
                {decodedMessage}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmojiEncoder;
