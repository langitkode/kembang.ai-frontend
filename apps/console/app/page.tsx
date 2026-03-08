export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Developer Console
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Global overview of your RAG ecosystem.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-foreground text-background px-3 py-1.5 text-xs font-semibold rounded-sm hover:opacity-90 transition-opacity">
            New Tenant
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards */}
        {[
          { label: "Total Tenants", value: "12", sub: "active_sessions: 4" },
          {
            label: "Total Tokens (24h)",
            value: "842,109",
            sub: "cost_saved: $12.4",
          },
          { label: "Avg Latency", value: "1.2s", sub: "rag_retrieval: 450ms" },
        ].map((m) => (
          <div
            key={m.label}
            className="card-sharp hover:border-accent/40 transition-colors space-y-2 group"
          >
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest group-hover:text-foreground transition-colors">
              {m.label}
            </p>
            <p className="text-3xl font-bold tracking-tighter">{m.value}</p>
            <p className="text-[10px] font-mono text-accent uppercase font-bold tracking-tight">
              {m.sub}
            </p>
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2">
          Infrastructure Log Feed
        </h3>
        <div className="border rounded-sm overflow-hidden bg-card font-mono text-[11px] shadow-sm">
          <div className="bg-muted/40 border-b px-4 py-2.5 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
              system_events.log
            </span>
            <span className="text-accent text-[10px] font-bold uppercase tracking-widest hover:underline cursor-pointer">
              Access Full Logs
            </span>
          </div>
          <div className="p-4 space-y-1.5 ">
            <p className="text-green-500/90 flex gap-2">
              <span className="opacity-40">[2026-03-08 13:25:01]</span>
              <span>
                INFO: Local embedding successful for tenant_id: coffee_shop_bali
              </span>
            </p>
            <p className="text-blue-500/90 flex gap-2">
              <span className="opacity-40">[2026-03-08 13:24:45]</span>
              <span>EVENT: Webhook message received (platform: whatsapp)</span>
            </p>
            <p className="text-yellow-500/90 flex gap-2">
              <span className="opacity-40">[2026-03-08 13:24:12]</span>
              <span>
                WARN: Higher latency detected in Groq API (latency: 2.1s)
              </span>
            </p>
            <p className="text-muted-foreground flex gap-2">
              <span className="opacity-40">[2026-03-08 13:23:55]</span>
              <span>DEBUG: Session persistence check passed</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
