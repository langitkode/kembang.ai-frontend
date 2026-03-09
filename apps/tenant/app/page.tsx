"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/store/auth";
import {
  BookOpen,
  Key,
  Zap,
  ArrowRight,
  MessageSquare,
  Users,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function TenantDashboardPage() {
  const { token, user } = useAuth();
  const [usage, setUsage] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      console.log("Dashboard: No token available");
      return;
    }

    console.log("Dashboard: Fetching with token:", token.substring(0, 20) + "...");
    console.log("Dashboard: User tenant_id:", user?.tenant_id);

    async function fetchData() {
      try {
        console.log("Dashboard: Fetching usage and stats...");
        
        // Fetch usage stats (tokens, requests, cost)
        const usageData = await api.getUsageStats();
        console.log("Dashboard: Usage data received:", usageData);
        
        // Fetch documents count
        const docsData = await api.getDocuments();
        console.log("Dashboard: Documents data received:", docsData);
        
        // Fetch conversations count
        const chatData = await api.getChatSessions();
        console.log("Dashboard: Chat data received:", chatData);
        
        // Fetch team members count
        const usersData = await api.listTeamUsers();
        console.log("Dashboard: Users data received:", usersData);
        
        // Combine all data
        const combinedStats = {
          ...usageData,
          documents: docsData.documents?.length || 0,
          conversations: chatData.conversations?.length || 0,
          users: usersData.users?.length || 0,
        };
        
        console.log("Dashboard: Combined stats:", combinedStats);
        setStats(combinedStats);
        setUsage(usageData);
      } catch (error: any) {
        console.error("Failed to fetch tenant data:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        toast.error(
          error.response?.status === 401
            ? "Authentication failed. Please login again."
            : error.response?.status === 403
            ? "Access denied. Please check your permissions."
            : "Failed to load usage stats. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token, user]);

  const quickActions = [
    {
      step: "01",
      label: "Manage Knowledge Base",
      desc: "Upload and manage documents for your chatbot.",
      href: "/kb",
      icon: BookOpen,
      color: "from-blue-500/20 to-blue-600/5",
      border: "border-blue-500/20 hover:border-blue-500/40",
      iconColor: "text-blue-400",
    },
    {
      step: "02",
      label: "Get API Key",
      desc: "Generate your API key for widget integration.",
      href: "/settings/keys",
      icon: Key,
      color: "from-emerald-500/20 to-emerald-600/5",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      iconColor: "text-emerald-400",
    },
    {
      step: "03",
      label: "Embed Widget",
      desc: "Copy the integration code for your website.",
      href: "/settings/packages",
      icon: Zap,
      color: "from-amber-500/20 to-amber-600/5",
      border: "border-amber-500/20 hover:border-amber-500/40",
      iconColor: "text-amber-400",
    },
    {
      step: "04",
      label: "View Conversations",
      desc: "Monitor chat history and user interactions.",
      href: "/chat",
      icon: MessageSquare,
      color: "from-violet-500/20 to-violet-600/5",
      border: "border-violet-500/20 hover:border-violet-500/40",
      iconColor: "text-violet-400",
    },
  ];

  const metrics = [
    {
      label: "Documents",
      value: loading ? "—" : stats?.documents?.toString() || "0",
      icon: FileText,
      iconColor: "text-blue-400",
    },
    {
      label: "Conversations",
      value: loading ? "—" : stats?.conversations?.toLocaleString() || "0",
      icon: MessageSquare,
      iconColor: "text-green-400",
    },
    {
      label: "API Requests",
      value: loading ? "—" : stats?.requests?.toLocaleString() || "0",
      icon: Zap,
      iconColor: "text-amber-400",
    },
    {
      label: "Team Members",
      value: loading ? "—" : stats?.users?.toString() || "0",
      icon: Users,
      iconColor: "text-violet-400",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Tenant Dashboard</h2>
        <p className="text-muted-foreground text-sm">
          Manage your chatbot instance, knowledge base, and integrations.
        </p>
      </header>

      {/* Metrics Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Your Instance
          </h3>
          <Badge variant="secondary" className="text-[10px] font-mono">
            Live
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <Card key={m.label} className="bg-card/50 border-border/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {m.label}
                </CardTitle>
                <m.icon className={`w-4 h-4 ${m.iconColor}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tighter">{m.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Usage Stats */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Usage Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Tokens Used
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold tracking-tighter">
                {loading
                  ? "—"
                  : (
                      (stats?.total_input_tokens || 0) +
                      (stats?.total_output_tokens || 0)
                    ).toLocaleString()}
              </p>
              <p className="text-[10px] font-mono text-accent uppercase font-bold tracking-tight">
                In: {((stats?.total_input_tokens || 0) / 1000).toFixed(1)}k | Out:{" "}
                {((stats?.total_output_tokens || 0) / 1000).toFixed(1)}k
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Est. Cost
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold tracking-tighter">
                {loading
                  ? "—"
                  : `$${(stats?.estimated_cost || 0).toFixed(4)}`}
              </p>
              <p className="text-[10px] font-mono text-accent uppercase font-bold tracking-tight">
                USD via Groq/LiteLLM
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                API Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-bold tracking-tighter">
                {loading
                  ? "—"
                  : (stats?.requests || 0).toLocaleString()}
              </p>
              <p className="text-[10px] font-mono text-accent uppercase font-bold tracking-tight">
                This billing cycle
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Quick Actions
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground opacity-50">
            Manage your chatbot
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`group border rounded-lg p-5 bg-gradient-to-br ${action.color} ${action.border} transition-all duration-200 block hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-3">
                <action.icon className="w-5 h-5 ${action.iconColor}" />
                <span className="text-[10px] font-mono text-muted-foreground/60 font-bold">
                  {action.step}
                </span>
              </div>
              <h4 className="text-sm font-bold mb-1.5">{action.label}</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {action.desc}
              </p>
              <div className="flex items-center gap-1 mt-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 group-hover:text-foreground/70 transition-colors">
                <span>Go</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* System Status */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          System Status
        </h3>
        <Card className="bg-[#070709] border-border/60 overflow-hidden font-mono text-[11px]">
          <div className="px-4 py-2.5 border-b border-border/30 flex justify-between items-center bg-white/[0.02]">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
              tenant_status.log
            </span>
            <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-green-500/30 text-green-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Active
              </span>
            </Badge>
          </div>
          <CardContent className="p-4 space-y-1.5">
            <p className="text-green-500/90 flex gap-2">
              <span className="opacity-40">
                [{new Date().toISOString().slice(0, 19).replace("T", " ")}]
              </span>
              <span>
                INFO: Tenant instance connected — API ready
              </span>
            </p>
            <p className="text-blue-400/90 flex gap-2">
              <span className="opacity-40">
                [{new Date().toISOString().slice(0, 19).replace("T", " ")}]
              </span>
              <span>EVENT: Dashboard session initialized.</span>
            </p>
            <p className="text-white/30 flex gap-2">
              <span className="opacity-40">
                [{new Date().toISOString().slice(0, 19).replace("T", " ")}]
              </span>
              <span>
                SYSTEM: Knowledge Base ready — {stats?.documents || 0} documents indexed.
              </span>
            </p>
            <p className="text-white/20 animate-pulse">_</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
