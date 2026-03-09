"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/store/auth";
import {
  Bot,
  BookOpen,
  ArrowRight,
  Activity,
  Users,
  MessageSquare,
  Database,
  Server,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't fetch until we have a token
    if (!token) {
      console.log("Dashboard: Waiting for auth token...");
      return;
    }

    console.log("Dashboard: Fetching with token:", token.substring(0, 20) + "...");
    
    async function fetchData() {
      try {
        const [platformStats, globalUsage] = await Promise.all([
          api.getPlatformStats(),
          api.getGlobalUsage(),
        ]);
        setStats(platformStats);
        setUsage(globalUsage);
      } catch (error: any) {
        console.error("Failed to fetch platform data:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        // Fallback to per-tenant usage if superadmin fails
        try {
          const fallback = await api.getUsageStats();
          setUsage(fallback);
        } catch {}
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  const quickActions = [
    {
      label: "Manage Tenants",
      desc: "Create and manage chatbot instances for clients.",
      href: "/tenants",
      icon: Bot,
      color: "from-violet-500/20 to-violet-600/5",
      border: "border-violet-500/20 hover:border-violet-500/40",
      iconColor: "text-violet-400",
    },
    {
      label: "Global Users",
      desc: "Manage platform-wide user access and roles.",
      href: "/users",
      icon: Users,
      color: "from-blue-500/20 to-blue-600/5",
      border: "border-blue-500/20 hover:border-blue-500/40",
      iconColor: "text-blue-400",
    },
    {
      label: "Knowledge Base",
      desc: "Centralized document management for all tenants.",
      href: "/kb",
      icon: Database,
      color: "from-emerald-500/20 to-emerald-600/5",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      iconColor: "text-emerald-400",
    },
    {
      label: "Infrastructure",
      desc: "Monitor system health and performance metrics.",
      href: "/infra",
      icon: Server,
      color: "from-amber-500/20 to-amber-600/5",
      border: "border-amber-500/20 hover:border-amber-500/40",
      iconColor: "text-amber-400",
    },
  ];

  const platformMetrics = [
    {
      label: "Total Tenants",
      value: loading ? "—" : stats?.total_tenants?.toString() || "0",
      icon: Users,
      iconColor: "text-violet-400",
    },
    {
      label: "Total Documents",
      value: loading ? "—" : stats?.total_documents?.toString() || "0",
      icon: BookOpen,
      iconColor: "text-blue-400",
    },
    {
      label: "Total Conversations",
      value: loading ? "—" : stats?.total_conversations?.toString() || "0",
      icon: MessageSquare,
      iconColor: "text-green-400",
    },
    {
      label: "Total Requests",
      value: loading
        ? "—"
        : stats?.total_requests?.toLocaleString() ||
          usage?.requests?.toLocaleString() ||
          "0",
      icon: Activity,
      iconColor: "text-amber-400",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Platform Overview</h2>
        <p className="text-muted-foreground text-sm">
          Superadmin view — managing all tenants, chatbots, and platform health.
        </p>
      </header>

      {/* Platform Stats Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Platform Health
          </h3>
          <Badge variant="secondary" className="text-[10px] font-mono">
            Live Metrics
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {platformMetrics.map((m) => (
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

      {/* Quick Actions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Platform Management
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground opacity-50">
            Superadmin controls
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
                <action.icon className={`w-5 h-5 ${action.iconColor}`} />
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

      {/* Usage Stats Row */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Global Usage
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
                      (usage?.total_input_tokens || 0) +
                      (usage?.total_output_tokens || 0)
                    ).toLocaleString()}
              </p>
              <p className="text-[10px] font-mono text-accent uppercase font-bold tracking-tight">
                In: {((usage?.total_input_tokens || 0) / 1000).toFixed(1)}k | Out:{" "}
                {((usage?.total_output_tokens || 0) / 1000).toFixed(1)}k
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
                  : `$${(usage?.estimated_cost || stats?.total_estimated_cost || 0).toFixed(4)}`}
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
                  : (
                      usage?.requests ||
                      stats?.total_requests ||
                      0
                    ).toLocaleString()}
              </p>
              <p className="text-[10px] font-mono text-accent uppercase font-bold tracking-tight">
                Across all tenants
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* System Log */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-green-500" />
            Engine Log Feed
          </h3>
          <Link
            href="/infra"
            className="text-[10px] font-mono text-accent uppercase hover:underline tracking-widest"
          >
            Full Monitoring →
          </Link>
        </div>
        <Card className="bg-[#070709] border-border/60 overflow-hidden font-mono text-[11px]">
          <div className="px-4 py-2.5 border-b border-border/30 flex justify-between items-center bg-white/[0.02]">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">
              system_events.log
            </span>
            <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-green-500/30 text-green-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            </Badge>
          </div>
          <CardContent className="p-4 space-y-1.5">
            <p className="text-green-500/90 flex gap-2">
              <span className="opacity-40">
                [{new Date().toISOString().slice(0, 19).replace("T", " ")}]
              </span>
              <span>
                INFO: Backend connected —{" "}
                {process.env.NEXT_PUBLIC_API_BASE_URL || "localhost"}
              </span>
            </p>
            <p className="text-blue-400/90 flex gap-2">
              <span className="opacity-40">
                [{new Date().toISOString().slice(0, 19).replace("T", " ")}]
              </span>
              <span>EVENT: Superadmin console session initialized.</span>
            </p>
            <p className="text-white/30 flex gap-2">
              <span className="opacity-40">
                [{new Date().toISOString().slice(0, 19).replace("T", " ")}]
              </span>
              <span>
                SYSTEM: Platform monitoring — {stats?.total_tenants || 0}{" "}
                tenants registered.
              </span>
            </p>
            <p className="text-white/20 animate-pulse">_</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
