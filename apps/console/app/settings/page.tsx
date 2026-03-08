import {
  Settings,
  Globe,
  ShieldAlert,
  Bell,
  BrainCircuit,
  Database,
  ArrowRight,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Global configuration for the Kembang AI ecosystem.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Core Configuration */}
        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">
              Core Engine
            </h3>
            <div className="divide-y border rounded-sm bg-card overflow-hidden">
              {[
                {
                  icon: BrainCircuit,
                  title: "Default LLM Provider",
                  desc: "Active: groq/llama-3.1-8b-instant",
                },
                {
                  icon: Database,
                  title: "Embedding Vector Cache",
                  desc: "TTL: 3600s, Max Size: 10k vectors",
                },
                {
                  icon: ShieldAlert,
                  title: "RAG Security Level",
                  desc: "Strict Tenant Isolation",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 flex items-center gap-4 hover:bg-muted/10 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 border border-border/60 rounded-sm flex items-center justify-center bg-muted/20">
                    <item.icon className="w-5 h-5 text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">
              Infrastructure Deployment
            </h3>
            <div className="p-4 border rounded-sm bg-card space-y-4 shadow-sm">
              <div className="flex justify-between items-center font-mono text-[10px]">
                <span className="text-muted-foreground uppercase opacity-50">
                  Environment_Mode
                </span>
                <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-sm font-bold tracking-widest border border-accent/20">
                  PRODUCTION
                </span>
              </div>
              <div className="flex justify-between items-center font-mono text-[10px]">
                <span className="text-muted-foreground uppercase opacity-50">
                  Instance_Serial
                </span>
                <span className="text-foreground font-bold">
                  kw_node_bali_primary_01
                </span>
              </div>
              <div className="flex justify-between items-center font-mono text-[10px]">
                <span className="text-muted-foreground uppercase opacity-50">
                  Release_Version
                </span>
                <span className="text-foreground opacity-80">
                  0.1.0-alpha.rev_4922
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Global Notifications & Integration */}
        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">
              Integration & Alerts
            </h3>
            <div className="divide-y border rounded-sm">
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border rounded-sm flex items-center justify-center bg-muted/20">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Base URL Override</p>
                    <p className="text-xs text-muted-foreground">
                      https://api.kembang.ai/v1
                    </p>
                  </div>
                </div>
                <input
                  type="text"
                  className="w-full bg-background border border-border px-3 py-1.5 text-xs rounded-sm font-mono"
                  placeholder="Enter custom base URL..."
                />
              </div>

              {[
                {
                  icon: Bell,
                  title: "Health Notifications",
                  desc: "Alert when latency exceeds 2.5s",
                },
                {
                  icon: Settings,
                  title: "Cleanup Routines",
                  desc: "Purge temp Knowledge Base files weekly",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-4 flex items-center gap-4 hover:bg-muted/10 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 border rounded-sm flex items-center justify-center bg-muted/20">
                    <item.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-sm space-y-4">
            <h4 className="text-[11px] font-bold text-red-500 uppercase tracking-widest">
              Danger Zone
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Reseting the system will wipe all{" "}
              <span className="text-foreground">global settings</span> and
              invalidate all <span className="text-foreground">API keys</span>.
              This action is irreversible.
            </p>
            <button className="w-full py-2 border border-red-500/30 text-[10px] font-mono font-bold uppercase text-red-500 hover:bg-red-500/10 transition-colors rounded-sm">
              Master Reset (Invalidate All)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
