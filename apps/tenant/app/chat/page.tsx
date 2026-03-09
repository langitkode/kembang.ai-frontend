"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import {
  MessageSquare,
  Search,
  Filter,
  ChevronRight,
  Clock,
  User,
  ShieldCheck,
  Download,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface Conversation {
  id: string;
  user_identifier: string;
  created_at: string;
  updated_at: string;
  summary: string | null;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatHistoryPage() {
  const [sessions, setSessions] = useState<Conversation[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [history, setHistory] = useState<Message[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    fetchSessions();
  }, [token]);

  async function fetchSessions() {
    try {
      setLoadingSessions(true);
      const data = await api.getChatSessions();
      setSessions(data.conversations || []);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoadingSessions(false);
    }
  }

  async function selectSession(id: string) {
    setSelectedSessionId(id);
    try {
      setLoadingHistory(true);
      const data = await api.getChatHistory(id);
      setHistory(data.messages || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoadingHistory(false);
    }
  }

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-end border-b pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Conversation Auditor
          </h2>
          <p className="text-muted-foreground text-sm">
            Global chat logs and quality assurance tools.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-3.5 h-3.5" />
            Export Logs
          </Button>
        </div>
      </header>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search within messages or identifiers..."
            className="pl-10 font-mono"
          />
        </div>
        <Button variant="outline" className="gap-2 uppercase tracking-widest">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <Card className="lg:col-span-1 shadow-sm h-[calc(100vh-280px)] flex flex-col">
          <CardHeader className="p-4 bg-muted/30 border-b">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-tighter text-muted-foreground flex justify-between">
              <span>Active Sessions</span>
              <span>{sessions.length} TOTAL</span>
            </h4>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              {loadingSessions ? (
                <div className="p-8 flex flex-col items-center justify-center text-center text-muted-foreground font-mono text-xs gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-accent" />
                  Loading sessions...
                </div>
              ) : sessions.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground font-mono text-xs">
                  No active conversations found.
                </div>
              ) : (
                <div className="divide-y">
                  {sessions.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => selectSession(chat.id)}
                      className={`p-4 cursor-pointer transition-colors group relative border-l-2 ${selectedSessionId === chat.id ? "bg-muted/10 border-accent" : "hover:bg-muted/5 border-transparent"}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-mono text-accent font-bold truncate pr-4">
                          {chat.user_identifier}
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground opacity-60 whitespace-nowrap">
                          {new Date(chat.updated_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm font-semibold truncate pr-4 text-foreground/80">
                        {chat.summary || "No summary available"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="secondary"
                          className="text-[9px] uppercase"
                        >
                          Widget Integration
                        </Badge>
                        <span className="text-[9px] font-mono text-muted-foreground truncate opacity-70">
                          ID: {chat.id.split("-")[0]}
                        </span>
                      </div>
                      <ChevronRight
                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-opacity ${selectedSessionId === chat.id ? "text-accent opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-50"}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Auditor Detail Viewer */}
        <Card className="lg:col-span-2 shadow-sm flex flex-col h-[calc(100vh-200px)]">
          {selectedSession ? (
            <>
              <div className="p-4 border-b bg-muted/10 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      {selectedSession.user_identifier}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                      SESSION: {selectedSession.id}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center text-[10px] font-mono text-muted-foreground">
                  <ShieldCheck className="w-3 h-3 text-green-500" />
                  VERIFIED INTERACTION
                </div>
              </div>

              <ScrollArea className="flex-1 p-6 bg-muted/[0.01]">
                <div className="space-y-6">
                  {loadingHistory ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground font-mono text-xs flex-col gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-accent" />
                      Fetching transcript...
                    </div>
                  ) : history.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-muted-foreground font-mono text-xs">
                      No messages in this conversation.
                    </div>
                  ) : (
                    history.map((msg, i) =>
                      msg.role === "user" ? (
                        <div key={i} className="space-y-2 max-w-[85%]">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-tight">
                            <User className="w-3 h-3" /> USER_INPUT
                          </div>
                          <div className="bg-card p-3 border rounded-sm text-sm leading-relaxed">
                            {msg.content}
                          </div>
                        </div>
                      ) : (
                        <div
                          key={i}
                          className="space-y-2 max-w-[85%] ml-auto text-right"
                        >
                          <div className="flex items-center justify-end gap-2 text-[10px] font-mono text-accent uppercase tracking-tight font-bold">
                            ENGINE_ASSISTANT{" "}
                            <MessageSquare className="w-3 h-3" />
                          </div>
                          <div className="bg-accent/10 border border-accent/20 p-4 rounded-sm text-left shadow-md">
                            <p className="text-foreground leading-relaxed">
                              {msg.content}
                            </p>
                          </div>
                        </div>
                      ),
                    )
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t bg-muted/20">
                <div className="flex items-center gap-2 px-3 py-1.5 border border-yellow-500/30 bg-yellow-500/5 rounded-sm">
                  <ShieldCheck className="w-3 h-3 text-yellow-500 shrink-0" />
                  <p className="text-[10px] font-mono text-yellow-600 dark:text-yellow-400">
                    READ-ONLY MODE: Conversation auditing is active. You cannot
                    intervene in live chats from this interface.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground space-y-4 p-8">
              <div className="w-20 h-20 rounded-full bg-muted/20 border flex items-center justify-center">
                <MessageSquare className="w-10 h-10 opacity-30" />
              </div>
              <div className="text-center space-y-2 max-w-md">
                <p className="text-base font-bold text-foreground/70">
                  No Conversation Selected
                </p>
                <p className="text-sm text-muted-foreground/60">
                  Select a conversation from the sidebar to view its full transcript and message history.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/50 bg-muted/10 px-4 py-2 rounded-md border">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>All conversations are encrypted and stored securely</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
