"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Terminal,
  Clock,
  AlertTriangle,
  Server,
  CheckCircle2,
  Loader2,
  Zap,
  Database,
  Cpu,
} from "lucide-react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface HealthResponse {
  status: "ok" | "degraded" | "down";
}

interface CircuitBreakerState {
  llm: { healthy: boolean; state: string; model?: string };
  embedding: { healthy: boolean; state: string; model?: string };
  database: { healthy: boolean; state: string };
}

interface MetricsResponse {
  total_requests: number;
  total_errors: number;
  avg_latency_ms: number;
  endpoints: Record<string, number>;
}

export default function InfrastructurePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [circuitBreakers, setCircuitBreakers] = useState<CircuitBreakerState | null>(null);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemHealth();
    fetchCircuitBreakers();
    fetchMetrics();
  }, []);

  async function fetchSystemHealth() {
    try {
      setLoading(true);
      const data = await api.getHealth();
      setHealth(data);
    } catch (error) {
      console.error("Failed to fetch system health:", error);
      toast.error("Failed to load system health");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCircuitBreakers() {
    try {
      const data = await api.getCircuitBreakers();
      setCircuitBreakers(data);
      
      // Show warnings for degraded services
      if (data && !data.embedding?.healthy) {
        toast.warning("Embedding service degraded - responses may be slower");
      }
      if (data && !data.llm?.healthy) {
        toast.error("LLM service unavailable");
      }
    } catch (error) {
      console.error("Failed to fetch circuit breakers:", error);
    }
  }

  async function fetchMetrics() {
    try {
      const data = await api.getSystemLogs();
      setMetrics(data);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
      toast.error("Failed to load metrics");
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex justify-between items-end border-b pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Infrastructure Monitoring
          </h2>
          <p className="text-muted-foreground text-sm">
            Real-time status of all system components and services.
          </p>
        </div>
        <Badge variant="outline" className={cn(
          "gap-2",
          health?.status === "ok" 
            ? "text-green-500 border-green-500/50" 
            : "text-yellow-500 border-yellow-500/50"
        )}>
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : health?.status === "ok" ? (
            <>
              <CheckCircle2 className="w-3 h-3" />
              All Systems Operational
            </>
          ) : (
            <>
              <AlertTriangle className="w-3 h-3" />
              Degraded Performance
            </>
          )}
        </Badge>
      </header>

      {/* Service Degradation Alert */}
      {circuitBreakers && !circuitBreakers.embedding?.healthy && (
        <Alert className="bg-yellow-500/5 border-yellow-500/20">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <AlertTitle className="text-yellow-600 dark:text-yellow-400">Embedding Service Degraded</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Document search may be slower than usual. LLM responses will continue normally.
          </AlertDescription>
        </Alert>
      )}

      {circuitBreakers && !circuitBreakers.llm?.healthy && (
        <Alert className="bg-red-500/5 border-red-500/20">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <AlertTitle className="text-red-600 dark:text-red-400">LLM Service Unavailable</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            AI responses are temporarily unavailable. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      {/* System Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* LLM Service */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <Cpu className="w-5 h-5 text-violet-500" />
              {loading || !circuitBreakers ? (
                <Skeleton className="h-5 w-16" />
              ) : circuitBreakers.llm?.healthy ? (
                <Badge variant="outline" className="text-green-500 border-green-500/50">
                  Operational
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-500 border-red-500/50">
                  Down
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading || !circuitBreakers ? (
              <>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    LLM Model
                  </p>
                  <p className="text-sm font-semibold">
                    {circuitBreakers.llm?.model || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={cn(
                    "font-semibold",
                    circuitBreakers.llm?.healthy ? "text-green-500" : "text-red-500"
                  )}>
                    {circuitBreakers.llm?.state || "Unknown"}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Embedding Service */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <Database className="w-5 h-5 text-blue-500" />
              {loading || !circuitBreakers ? (
                <Skeleton className="h-5 w-16" />
              ) : circuitBreakers.embedding?.healthy ? (
                <Badge variant="outline" className="text-green-500 border-green-500/50">
                  Operational
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-500 border-red-500/50">
                  Down
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading || !circuitBreakers ? (
              <>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Embedding Model
                  </p>
                  <p className="text-sm font-semibold">
                    {circuitBreakers.embedding?.model || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={cn(
                    "font-semibold",
                    circuitBreakers.embedding?.healthy ? "text-green-500" : "text-red-500"
                  )}>
                    {circuitBreakers.embedding?.state || "Unknown"}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Database */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <Server className="w-5 h-5 text-green-500" />
              {loading || !circuitBreakers ? (
                <Skeleton className="h-5 w-16" />
              ) : circuitBreakers.database?.healthy ? (
                <Badge variant="outline" className="text-green-500 border-green-500/50">
                  Operational
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-500 border-red-500/50">
                  Down
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading || !circuitBreakers ? (
              <>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Database
                  </p>
                  <p className="text-sm font-semibold">
                    PostgreSQL
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={cn(
                    "font-semibold",
                    circuitBreakers.database?.healthy ? "text-green-500" : "text-red-500"
                  )}>
                    {circuitBreakers.database?.state || "Unknown"}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* API Gateway */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <Zap className="w-5 h-5 text-amber-500" />
              {loading || !metrics ? (
                <Skeleton className="h-5 w-16" />
              ) : (
                <Badge variant="outline" className="text-blue-400 border-blue-400/50">
                  Live
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading || !metrics ? (
              <>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Total Requests
                  </p>
                  <p className="text-lg font-semibold">
                    {metrics.total_requests.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Avg Latency:</span>
                  <span className="font-mono text-amber-500">
                    {metrics.avg_latency_ms.toFixed(0)}ms
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Endpoint Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            <div>
              <CardTitle className="text-sm font-semibold">
                Endpoint Metrics
              </CardTitle>
              <CardDescription>
                Request count per API endpoint
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 rounded-md border p-4">
            {loading || !metrics ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Loading metrics...
              </div>
            ) : (
              <div className="space-y-2 font-mono text-xs">
                {Object.entries(metrics.endpoints)
                  .sort((a, b) => b[1] - a[1])
                  .map(([endpoint, count], index) => (
                    <div
                      key={endpoint}
                      className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0"
                    >
                      <span className="text-muted-foreground truncate max-w-[60%]">
                        {endpoint}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-mono",
                          count > 20
                            ? "text-green-500 border-green-500/50"
                            : count > 5
                            ? "text-blue-400 border-blue-400/50"
                            : "text-muted-foreground border-white/10"
                        )}
                      >
                        {count} requests
                      </Badge>
                    </div>
                  ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <div>
                <CardTitle className="text-sm font-semibold">
                  Active Alerts
                </CardTitle>
                <CardDescription>
                  Current warnings and issues
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert className="bg-green-500/5 border-green-500/20">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <AlertTitle className="text-green-600 dark:text-green-400 text-xs">
                No Active Alerts
              </AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                All systems are operating normally.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-muted-foreground" />
              <div>
                <CardTitle className="text-sm font-semibold">
                  System Information
                </CardTitle>
                <CardDescription>
                  Current deployment details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Version</span>
              <span className="font-mono">0.2.0</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Environment</span>
              <Badge variant="outline">Production</Badge>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Deployed</span>
              <span className="font-mono">2026-03-08</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
