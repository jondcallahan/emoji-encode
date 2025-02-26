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
  const [instructionsCopied, setInstructionsCopied] = useState(false);

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

  const handleCopyInstructions = async () => {
    const instructions = `Can you find the hidden message?
Hint: Each character after the emoji is a Unicode variation selector. To decode:
1. Look at the Unicode code point for each character (0xFE00-0xFE09 range)
2. Take the last digit of each code point
3. When you hit 0xFE0A, that's a separator - start a new number
4. Convert the separated numbers to letters (1=a, 2=b, etc., 27=space)
Try to crack it! The message is in plain English.`;

    await navigator.clipboard.writeText(instructions);
    setInstructionsCopied(true);
    setTimeout(() => setInstructionsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="w-full max-w-2xl mx-auto space-y-6 px-4 sm:px-6">
        <h1 className="text-2xl font-bold mt-4 text-center">Emoji Encoder</h1>
        <p className="text-gray-900 text-center">
          Hide secret messages in emojis using variation selectors.
        </p>
        <Card className="bg-white/90 backdrop-blur-sm shadow-md">
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
              <div className="flex flex-wrap gap-2 text-2xl">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`p-2 rounded hover:bg-gray-100 ${
                      selectedEmoji === emoji ? "bg-gray-100" : ""
                    }`}
                    aria-label={`Select emoji ${emoji}`}
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
              className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white p-2 rounded hover:opacity-90 transition-all"
            >
              Encode
            </button>

            {encodedMessage && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Encoded Emoji (click to copy)
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    className="p-3 bg-gray-100/80 rounded text-2xl cursor-pointer overflow-x-auto max-w-full backdrop-blur-sm border border-gray-200"
                    onClick={handleCopy}
                  >
                    {encodedMessage}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded hover:bg-gray-100"
                    aria-label="Copy to clipboard"
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

        <Card className="bg-white/90 backdrop-blur-sm shadow-md">
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
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white p-2 rounded hover:opacity-90 transition-all"
            >
              Decode
            </button>

            {decodedMessage && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Hidden Message
                </label>
                <div className="p-3 bg-gray-100/80 rounded backdrop-blur-sm border border-gray-200">
                  {decodedMessage}
                </div>
              </div>
            )}

            <div className="mt-6 border-t pt-4">
              <label className="block text-sm font-medium mb-2">
                LLM can't decode it? Copy these instructions:
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="p-3 bg-gray-100/80 rounded text-sm flex-grow backdrop-blur-sm border border-gray-200">
                  <p>Can you find the hidden message?</p>
                  <p>
                    Hint: Each character after the emoji is a Unicode variation
                    selector. To decode:
                  </p>
                  <ol className="list-decimal ml-5">
                    <li>
                      Look at the Unicode code point for each character
                      (0xFE00-0xFE09 range)
                    </li>
                    <li>Take the last digit of each code point</li>
                    <li>
                      When you hit 0xFE0A, that's a separator - start a new
                      number
                    </li>
                    <li>
                      Convert the separated numbers to letters (1=a, 2=b, etc.,
                      27=space)
                    </li>
                  </ol>
                  <p>Try to crack it! The message is in plain English.</p>
                </div>
                <button
                  onClick={handleCopyInstructions}
                  className="p-2 rounded hover:bg-gray-100 self-start"
                  aria-label="Copy instructions to clipboard"
                >
                  {instructionsCopied
                    ? <Check className="w-5 h-5 text-green-500" />
                    : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-md text-gray-900 text-center">
          Made by{" "}
          <a
            href="https://github.com/jondcallahan"
            className="underline text-blue-700 hover:text-blue-900"
            target="_blank"
          >
            Jon Callahan
          </a>{" "}
          <a
            href="https://github.com/jondcallahan/emoji-encode"
            className="underline text-blue-700 hover:text-blue-900"
            target="_blank"
          >
            View on GitHub
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmojiEncoder;
