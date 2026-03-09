"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useAuth } from "@/store/auth";
import api from "@/lib/api";
import {
  Send,
  Sparkles,
  Trash2,
  Loader2,
  MessageSquare,
  BookOpen,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface Source {
  document_name: string;
  content: string;
  relevance_score?: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  timestamp: string;
}

export default function PlaygroundPage() {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<number, boolean>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate unique user identifier for playground (per authenticated user)
  const userIdentifier = useMemo(() => {
    return user?.email ? `playground_${user.email}` : `playground_anonymous`;
  }, [user?.email]);

  // Load saved conversation from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedConvId = localStorage.getItem("playground_conversation_id");
      const savedMessages = localStorage.getItem("playground_messages");
      
      if (savedConvId) {
        setConversationId(savedConvId);
      }
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch (e) {
          console.error("Failed to load saved messages:", e);
        }
      }
    }
  }, []);

  // Save conversation to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (conversationId) {
        localStorage.setItem("playground_conversation_id", conversationId);
      }
      if (messages.length > 0) {
        localStorage.setItem("playground_messages", JSON.stringify(messages));
      }
    }
  }, [conversationId, messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await api.sendChatMessage({
        message: userMessage.content,
        user_identifier: userIdentifier,
        conversation_id: conversationId || undefined,
      });

      console.log("[Playground] API Response:", data);
      console.log("[Playground] Sources:", data.sources);

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
        sources: data.sources?.map((s: any) => ({
          document_name: s.document_name || s.source || "Unknown",
          content: s.content || s.text || "",
          relevance_score: s.relevance_score || s.score,
        })),
        timestamp: new Date().toISOString(),
      };

      console.log("[Playground] Assistant Message:", assistantMessage);

      setMessages((prev) => [...prev, assistantMessage]);

      if (!conversationId && data.conversation_id) {
        setConversationId(data.conversation_id);
      }
    } catch (error: any) {
      console.error("Playground error:", error);
      toast.error(
        error.response?.status === 401
          ? "Authentication failed. Please login again."
          : "Failed to get response from chatbot. Please try again."
      );

      // Remove user message if error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
    setExpandedSources({});
    localStorage.removeItem("playground_conversation_id");
    localStorage.removeItem("playground_messages");
    toast.success("Chat cleared. New conversation started.");
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success("Response copied!");
  };

  const toggleSources = (index: number) => {
    setExpandedSources((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <TooltipProvider>
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-start border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold tracking-tight">Playground</h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent 
                  className="max-w-md bg-black text-white border-white/10"
                  side="bottom"
                  sideOffset={8}
                >
                  <p className="text-xs text-white/80">
                    The playground uses your uploaded Knowledge Base documents to generate responses.
                    Each answer includes source references showing which documents were used.
                    Conversations are automatically saved and restored.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-muted-foreground text-sm">
              Test your chatbot quality before deployment. Ask questions and see how the AI responds with sources.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={clearChat}
            disabled={messages.length === 0 || loading}
            className="gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Chat
          </Button>
        </header>

      {/* Chat Area */}
      <Card className="flex flex-col h-[calc(100vh-200px)]">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              <div>
                <CardTitle className="text-sm font-semibold">
                  {conversationId ? "Active Conversation" : "New Conversation"}
                </CardTitle>
                <CardDescription className="text-xs">
                  {conversationId
                    ? `ID: ${conversationId.substring(0, 8)}...`
                    : "Start typing to begin testing"}
                </CardDescription>
              </div>
            </div>
            {conversationId && (
              <Badge variant="outline" className="text-green-500 border-green-500/50">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                Active
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-1 overflow-hidden">
          <ScrollArea ref={scrollRef} className="h-full p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-accent" />
                </div>
                <div className="space-y-1 max-w-md">
                  <p className="text-sm font-semibold text-foreground/70">
                    Start Testing Your Chatbot
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Ask questions about your knowledge base to see how the AI responds. 
                    The chatbot will use uploaded documents to provide accurate answers with sources.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                  {[
                    { icon: BookOpen, text: "What products do you offer?" },
                    { icon: Sparkles, text: "What are your business hours?" },
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(suggestion.text);
                        inputRef.current?.focus();
                      }}
                      className="flex items-center gap-2 p-3 text-xs border rounded-lg hover:bg-accent/5 hover:border-accent/30 transition-colors text-left"
                    >
                      <suggestion.icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground/70">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.role === "user"
                          ? "bg-accent text-accent-foreground"
                          : "bg-card border"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {msg.role === "assistant" ? (
                          <Sparkles className="w-3.5 h-3.5 text-accent" />
                        ) : (
                          <MessageSquare className="w-3.5 h-3.5" />
                        )}
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          {msg.role === "assistant" ? "Assistant" : "You"}
                        </span>
                      </div>

                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>

                      {msg.role === "assistant" && msg.sources && msg.sources.length > 0 && (
                        <>
                          <Separator className="my-3" />

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <BookOpen className="w-3 h-3" />
                                Sources
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleSources(index)}
                                className="h-6 text-xs"
                              >
                                {expandedSources[index] ? (
                                  <>
                                    <ChevronUp className="w-3 h-3 mr-1" />
                                    Hide
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3 h-3 mr-1" />
                                    Show
                                  </>
                                )}
                              </Button>
                            </div>

                            {expandedSources[index] && (
                              <div className="space-y-2">
                                {msg.sources.map((source, sourceIndex) => (
                                  <div
                                    key={sourceIndex}
                                    className="bg-background/50 rounded-md p-3 border text-xs space-y-1.5"
                                  >
                                    <div className="flex items-center justify-between">
                                      <Badge
                                        variant="outline"
                                        className="text-[9px] font-mono"
                                      >
                                        {source.document_name}
                                      </Badge>
                                      {source.relevance_score && (
                                        <span className="text-[9px] font-mono text-muted-foreground">
                                          {(source.relevance_score * 100).toFixed(0)}% relevance
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-muted-foreground/70 line-clamp-3">
                                      {source.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex justify-end mt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(msg.content, index)}
                              className="h-7 text-xs gap-1.5"
                            >
                              {copiedIndex === index ? (
                                <>
                                  <Check className="w-3 h-3 text-green-500" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-4 bg-card border">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Assistant is thinking...
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-accent animate-spin" />
                        <p className="text-sm text-muted-foreground">
                          Searching knowledge base...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>

        {/* Input Area */}
        <div className="p-4 border-t bg-muted/20">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your knowledge base..."
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Send
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground/50 mt-2 text-center">
            Press Enter to send • Responses are generated from your uploaded documents
          </p>
        </div>
      </Card>
    </div>
    </TooltipProvider>
  );
}
