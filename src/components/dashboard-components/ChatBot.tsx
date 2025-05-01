"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ArrowUp, Plus } from "lucide-react";
import { Wallet, ChartLine, Clock } from "@phosphor-icons/react";

type Message = {
  type: "user" | "ai";
  content: string;
  platform?: string;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [displayedAiMessage, setDisplayedAiMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message immediately
    const userMessage: Message = {
      type: "user",
      content: inputValue,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsWaitingForResponse(true);

    // Simulate API response delay
    setTimeout(() => {
      // Add dummy AI response
      const aiMessage: Message = {
        type: "ai",
        content:
          "I've analyzed the available liquidity pools on Solana Network. Here are the top pools, ranked by liquidity:\n\n1. zBTC-SOL 0.05%\nLiquidity: $841,373.82\nFee: 0.05%\nTrading Volume: $284,350.14\nPool ID: B5Kcm...bwcYK\n\n2. zBTC-WBTC 0.01%\nLiquidity: $873,478.01\nFee: 0.01%\nTrading Volume: $27,214.90\nPool ID: 2qmTG...5UwA3\n\n3. zBTC-cbBTC 0.01%\nLiquidity: $46,164.71\nFee: 0.01%\nTrading Volume: $55,493.03\nPool ID: AmwBE...ZmfDm",
        platform: "demo",
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsWaitingForResponse(false);
    }, 1500); // 1.5 second delay to simulate response time
  };

  // Handle keydown event in textarea to send message on Enter press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter press, but not when Shift+Enter is pressed (for new line)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  // Typing effect for the latest AI message
  useEffect(() => {
    // Find the last AI message
    const lastAiIndex = [...messages]
      .reverse()
      .findIndex((m) => m.type === "ai");
    if (lastAiIndex === -1) {
      setDisplayedAiMessage("");
      setIsTyping(false);
      return;
    }
    const aiIndex = messages.length - 1 - lastAiIndex;
    const aiMessage = messages[aiIndex];

    // Only animate if this is the last message and it's AI, 20 for 20 milliseconds
    if (aiIndex === messages.length - 1 && aiMessage.type === "ai") {
      setDisplayedAiMessage("");
      setIsTyping(true);
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayedAiMessage(aiMessage.content.slice(0, i));
        i++;
        if (i > aiMessage.content.length) {
          clearInterval(intervalId);
          setIsTyping(false);
        }
      }, 20);
      return () => clearInterval(intervalId);
    } else {
      setDisplayedAiMessage("");
      setIsTyping(false);
    }
  }, [messages]);

  return (
    <div className="h-full relative max-w-4xl mx-auto">
      <div className="h-[calc(100vh-240px)] overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {messages.length === 0 ? (
          <div className="flex justify-center mt-16 h-full mx-auto">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-center">
                Welcome to Hypebiscus
              </h1>
              <p className="text-center mb-4 ">
                Hypebiscus is a smart assistant for exploring BTC liquidity in
                the Solana DeFi ecosystem.
              </p>
              <div className="flex flex-col gap-2">
                <p className="flex items-center gap-2 text-sub-text"><Clock className="w-4 h-4 text-primary" />Real-time discovery of BTC and zBTC liquidity pools on Solana.</p>
                <p className="flex items-center gap-2 text-sub-text"><Plus className="w-4 h-4 text-primary" />Instant “Add Position” capability</p>
                <p className="flex items-center gap-2 text-sub-text"><ChartLine className="w-4 h-4 text-primary" />Live pool analytics, including TVL, APR, and recent liquidity changes.</p>
                <p className="flex items-center gap-2 text-sub-text"><Wallet className="w-4 h-4 text-primary" />Secure, non-custodial wallet integration for direct on-chain transactions</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Chat Messages User and AI */}
            {messages.map((message, index) => {
              const isLastAi =
                index === messages.length - 1 && message.type == "ai";

              if (message.type === "user") {
                return (
                  <div key={index} className="flex mt-6 justify-end">
                    <div className="bg-[#161616] rounded-full px-4 py-2 border border-border">
                      <p className="whitespace-pre-line">{message.content}</p>
                    </div>
                  </div>
                );
              } else {
                // Process AI message content to identify and format liquidity pools
                const content =
                  isLastAi && isTyping ? displayedAiMessage : message.content;

                // Check if the message contains liquidity pool information
                const hasPoolInfo =
                  content.includes("Liquidity:") &&
                  content.includes("Pool ID:");

                if (!hasPoolInfo) {
                  return (
                    <div key={index} className="flex mt-6 justify-start">
                      <div className="max-w-[100%] mt-6">
                        <p className="whitespace-pre-line">{content}</p>
                      </div>
                    </div>
                  );
                }

                // Parse pool information and format
                const lines = content.split("\n\n");
                const intro = lines[0];
                const pools = lines.slice(1);

                return (
                  <div key={index} className="flex mt-6 mb-16 justify-start w-full">
                    <div className="max-w-full text-white">
                      <p className="mb-4">{intro}</p>

                      {pools.map((pool, poolIndex) => {
                        const poolLines = pool.split("\n");
                        const title = poolLines[0];
                        const details = poolLines.slice(1);

                        return (
                          <div key={poolIndex} className="mb-4">
                            <p className="text-primary font-bold">{title}</p>
                            {details.map((detail, detailIndex) => {
                              const [label, value] = detail.split(": ");
                              return (
                                <p
                                  key={detailIndex}
                                  className={
                                    label === "Liquidity" ? "text-primary" : ""
                                  }
                                >
                                  <span
                                    className={`${
                                      label.includes("Liquidity") ||
                                      label.includes("Fee") ||
                                      label.includes("Trading Volume") ||
                                      label.includes("Pool ID")
                                        ? "text-primary font-bold"
                                        : ""
                                    } ${
                                      label === "Pool ID" ? "" : "font-bold"
                                    }`}
                                  >
                                    {label}:
                                  </span>{" "}
                                  <span
                                    className={
                                      label !== "Pool ID" ? "text-white" : ""
                                    }
                                  >
                                    {value}
                                  </span>
                                </p>
                              );
                            })}
                            <Button
                              variant="default"
                              size="secondary"
                              className="mt-2 rounded-full"
                            >
                              <Plus className="w-4 h-4" /> Add Position
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
            })}

            {/* AI Response Loading */}
            {isWaitingForResponse && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-box-background">
                  <div className="flex gap-2">
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Input */}
        <div className="absolute bg-background bottom-4 left-0 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="secondary" size="secondary">
              <ChartLine className="w-4 h-4" /> Add Position
            </Button>
            <Button variant="secondary" size="secondary">
              <Wallet className="w-4 h-4" />
              My Positions
            </Button>
          </div>
          <form
            onSubmit={handleSendMessage}
            className="h-max border border-border rounded-2xl"
          >
            {/* Textarea for user input */}
            <Textarea
              name="post-prompt"
              id="post-prompt"
              className="w-full p-3 min-h-[50px] resize-none bg-transparent border-none"
              placeholder="Ask me anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            ></Textarea>
            {/* Dropdown menu for platform selection */}
            <div className="flex justify-end items-center p-3">
              {/* Send button */}
              <Button
                variant="secondary"
                type="submit"
                className="rounded-full text-primary w-[24px] h-[24px] border-none"
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
