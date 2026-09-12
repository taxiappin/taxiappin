import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Phone,
  MessageSquare,
  Send,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { ChatThread, Message } from "../../types";

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  info: any;
  userId: string;
  userProfile: any;
  chatThreads: ChatThread[];
  setChatThreads: React.Dispatch<React.SetStateAction<ChatThread[]>>;
  userPreferences?: any;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isOpen,
  onClose,
  info,
  userId,
  userProfile,
  chatThreads,
  setChatThreads,
  userPreferences = { allowCalls: true },
}) => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const thread = chatThreads.find(
    (t) =>
      t.id === info?.id ||
      t.otherUser === info?.name ||
      t.otherUser === info?.driverName ||
      t.id === info?.threadId
  );
  const messages = thread?.messages || [];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length, isOpen]);

  const send = () => {
    if (!input.trim() || !info) return;
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const threadId =
      info.id ||
      info.threadId ||
      `chat_${Math.random().toString(36).substr(2, 9)}`;

    const newMessage: Message = {
      id: Date.now().toString(),
      threadId: threadId,
      text: input,
      senderId: userId,
      senderName: userProfile.name,
      senderRole:
        userProfile?.role ||
        localStorage.getItem("ride-buddy-app-mode") ||
        "rider",
      timestamp,
    };

    setChatThreads((prev) => {
      const existing = prev.find((t) => t.id === threadId);
      if (existing) {
        return prev.map((t) =>
          t.id === threadId
            ? {
                ...t,
                messages: [...t.messages, newMessage],
                lastMessage: input,
                time: timestamp,
              }
            : t
        );
      } else {
        return [
          ...prev,
          {
            id: threadId,
            tripId: info.tripId || info.id || "general",
            userId: userId,
            otherUser: info.user || info.name || info.driverName || "Companion",
            messages: [newMessage],
            lastMessage: input,
            time: timestamp,
            user: info.user || info.name || info.driverName || "Other",
            avatar:
              info.avatar ||
              `https://picsum.photos/seed/${info.name || "user"}/100/100`,
          },
        ];
      }
    });

    fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    }).catch(console.error);

    setInput("");
    setTimeout(() => {
      setIsTyping(true);
    }, 400);
    setTimeout(() => {
      setIsTyping(false);
    }, 1800);
  };

  const companionName =
    info?.user || info?.name || info?.driverName || "Companion";
  const companionAvatar =
    info?.avatar ||
    info?.otherUserAvatar ||
    `https://picsum.photos/seed/${companionName}/100/100`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute top-0 left-0 right-0 bottom-0 bg-slate-50/95 backdrop-blur-md z-[10000] flex flex-col pointer-events-auto text-slate-800"
        >
          <div className="flex flex-col h-full relative">
            {/* Elegant Header */}
            <div className="bg-white py-3 px-4 border-b border-slate-100 shadow-3xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-1.5 -ml-1 hover:bg-slate-50 rounded-full transition-colors flex items-center justify-center text-slate-600 cursor-pointer"
                >
                  <ChevronLeft size={20} strokeWidth={2.5} />
                </button>
                <div className="relative w-9 h-9 rounded-full border border-slate-100 bg-slate-50 overflow-hidden shrink-0 shadow-3xs">
                  <img
                    src={companionAvatar}
                    alt={companionName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight italic leading-none mb-1">
                    {companionName}
                  </h4>
                  <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">
                    Online • Secure Session
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {userPreferences.allowCalls && (
                  <button
                    onClick={() => {
                      const targetPhone = info?.phone || "+91 88776 65544";
                      window.location.href = `tel:${targetPhone.replace(/\s+/g, "")}`;
                    }}
                    className="w-9 h-9 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center border border-slate-100 text-slate-600 active:scale-90 transition-all cursor-pointer"
                    title="Call"
                  >
                    <Phone size={15} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar bg-slate-50/50">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-45 mt-20">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-400 mb-4 shadow-3xs border border-slate-100">
                    <MessageSquare size={24} />
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-700 tracking-wider">
                    Secure Conversation
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 max-w-[200px] mt-1">
                    End-to-end simulated active coordination with {companionName}.
                  </p>
                </div>
              ) : (
                messages.map((m: any, i: number) => {
                  const isMe = m.senderId === userId;
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={m.id || i}
                      className={cn(
                        "flex w-full",
                        isMe ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs font-medium relative tracking-wide shadow-3xs leading-relaxed",
                          isMe
                            ? "bg-slate-800 text-white rounded-tr-none font-bold shadow-sm shadow-slate-800/10"
                            : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                        )}
                      >
                        <p className="pr-10 text-[11px] leading-relaxed">
                          {m.text}
                        </p>
                        <div className="absolute right-2 bottom-1 select-none text-[7px] font-bold tracking-wider uppercase shrink-0 opacity-60">
                          <span>{m.timestamp || "Just now"}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Typing Indicator */}
            {isTyping && (
              <div className="px-5 py-2 bg-slate-50/50 flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-slate-500">
                <div className="flex gap-1">
                  <div
                    className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
                <span>{companionName} is typing...</span>
              </div>
            )}

            {/* Input Footer Area */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    send();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-[11px] font-semibold text-slate-800 focus:outline-none focus:border-primary/50 focus:bg-white placeholder:text-slate-400"
              />
              <button
                onClick={send}
                disabled={!input.trim()}
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0",
                  input.trim()
                    ? "bg-primary hover:bg-primary-dark text-black hover:scale-105 active:scale-95 font-black cursor-pointer"
                    : "bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed"
                )}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
