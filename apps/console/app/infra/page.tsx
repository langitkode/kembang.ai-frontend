import {
  Activity,
  Cpu,
  Database,
  Globe,
  Zap,
  Terminal,
  Clock,
  AlertTriangle,
} from "lucide-react";

export default function InfrastructurePage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Infrastructure Monitoring
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time health and performance of the Kembang AI engine.
          </p>
        </div>
        <div className="flex gap-2 font-mono text-[10px] items-center text-green-500 bg-green-500/10 px-3 py-1 rounded-sm border border-green-500/20">
          <Activity className="w-3 h-3 animate-pulse" />
          SYSTEM LIVE
        </div>
      </header>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Groq Cloud API",
            value: "100%",
            sub: "rt_latency: 1.1s",
            icon: Zap,
            color: "text-amber-500",
          },
          {
            label: "Local Embedding",
            value: "Ready",
            sub: "model: all-MiniLM-L6",
            icon: Cpu,
            color: "text-blue-500/80",
          },
          {
            label: "Vector Store",
            value: "8/20 Cn",
            sub: "index: pg_ivfflat",
            icon: Database,
            color: "text-indigo-400",
          },
          {
            label: "Edge Gateway",
            value: "Active",
            sub: "3 platforms live",
            icon: Globe,
            color: "text-green-500/80",
          },
        ].map((res) => (
          <div
            key={res.label}
            className="border p-6 rounded-sm bg-card space-y-3 group hover:border-border/80 transition-colors"
          >
            <div className="flex justify-between items-start">
              <res.icon
                className={`w-5 h-5 ${res.color} opacity-80 group-hover:opacity-100 transition-opacity`}
              />
              <span className="text-[9px] font-mono text-muted-foreground opacity-40 uppercase tracking-tighter">
                TELEMETRY_ON
              </span>
            </div>
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-widest leading-none mb-1">
                {res.label}
              </p>
              <p className="text-xl font-bold tracking-tight">{res.value}</p>
              <p className="text-[9px] font-mono text-accent mt-2 uppercase font-bold tracking-tight">
                {res.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latency Chart Visual */}
        <div className="lg:col-span-2 border rounded-sm bg-card p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              Edge_Request_Latency (24H_HISTORY)
            </h3>
            <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded-sm border border-border/50 font-bold text-accent">
              NETWORK_AVG: 1201ms
            </span>
          </div>

          <div className="h-48 flex items-end gap-1.5 overflow-hidden font-mono px-2">
            {[
              40, 35, 60, 45, 30, 80, 50, 40, 35, 90, 45, 30, 40, 55, 65, 40,
              30, 25, 35, 45, 60, 50, 40, 35,
            ].map((h, i) => (
              <div
                key={i}
                className={`flex-1 min-w-[8px] bg-accent/10 border-t-2 border-accent transition-all hover:bg-accent/40 group relative`}
                style={{ height: `${h}%` }}
              >
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold">
                  {h * 20}ms
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] font-mono text-muted-foreground pt-4 border-t border-border/40 uppercase font-bold tracking-widest">
            <span>T_00:00</span>
            <span>T_06:00</span>
            <span>T_12:00</span>
            <span>T_18:00</span>
            <span>T_23:59</span>
          </div>
        </div>

        {/* System Warnings */}
        <div className="border rounded-sm bg-card p-6 space-y-6 shadow-sm border-yellow-500/10">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
            Infrastructure_Alerts_Stack
          </h3>
          <div className="space-y-4">
            <div className="p-3 border border-yellow-500/30 bg-yellow-500/[0.03] rounded-sm space-y-1.5 ">
              <p className="text-[11px] font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest flex justify-between">
                <span>Rate_Limit_Imminent</span>
                <span className="opacity-50 text-[9px]">CRIT_82%</span>
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                Groq API usage for Llama-3-8b is nearing the threshold of the
                current throughput tier.
              </p>
            </div>
            <div className="p-3 border border-indigo-500/30 bg-indigo-500/[0.03] rounded-sm space-y-1.5 opacity-60">
              <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest flex justify-between">
                <span>Memory_GC_Complete</span>
                <span className="opacity-50 text-[9px]">AUTO_RESOLVED</span>
              </p>
              <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                System_Orchestrator performed major garbage collection on local
                embedding cache.
              </p>
            </div>
          </div>
          <button className="w-full py-2 border border-border/60 text-[10px] font-mono font-bold uppercase hover:bg-muted transition-colors rounded-sm tracking-widest">
            METRIC_HISTORY_LOG
          </button>
        </div>
      </div>

      {/* Live Terminal */}
      <div className="border rounded-sm overflow-hidden bg-black font-mono">
        <div className="bg-muted/10 border-b border-border/20 px-4 py-2 flex items-center gap-2">
          <Terminal className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
            system_orchestrator@kembang-ai: ~
          </span>
        </div>
        <div className="p-6 text-[11px] space-y-1 h-64 overflow-y-auto scrollbar-hide">
          <p className="text-muted-foreground opacity-50">
            [2026-03-08 13:35:12] Initializing internal RAG loop...
          </p>
          <p className="text-green-500">
            [2026-03-08 13:35:13] SUCCESS: SentenceTransformer
            'all-MiniLM-L6-v2' loaded (Dim: 384)
          </p>
          <p className="text-blue-500">
            [2026-03-08 13:35:14] CONNECT: Worker listening on
            redis://localhost:6379/1
          </p>
          <p className="text-white">
            [2026-03-08 13:36:01] INCOMING: POST /api/v1/widget/chat [tenant_id:
            coffee_shop_bali]
          </p>
          <p className="text-muted-foreground opacity-50">
            &nbsp;&nbsp;&nbsp;→ Embedding query...
          </p>
          <p className="text-muted-foreground opacity-50">
            &nbsp;&nbsp;&nbsp;→ Retrieval from pgvector... (hits: 4)
          </p>
          <p className="text-muted-foreground opacity-50">
            &nbsp;&nbsp;&nbsp;→ Generating with groq/llama-3.1-8b-instant...
          </p>
          <p className="text-blue-400">
            [2026-03-08 13:36:03] COMPLETED: Request processed in 1.4s (Tokens:
            512 total)
          </p>
          <p className="text-white animate-pulse">_</p>
        </div>
      </div>
    </div>
  );
}
