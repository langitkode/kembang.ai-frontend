import {
  Key,
  Plus,
  Copy,
  RotateCw,
  Trash2,
  ShieldCheck,
  Eye,
  Lock,
  Info,
} from "lucide-react";

const mockKeys = [
  {
    id: "key_01",
    name: "Main Production Key",
    key: "kw_live_4a8b...2z19",
    type: "Live",
    lastUsed: "2 mins ago",
  },
  {
    id: "key_02",
    name: "Development / Staging",
    key: "kw_test_99c3...ff88",
    type: "Test",
    lastUsed: "Yesterday",
  },
];

export default function ApiKeysPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            API Key Management
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Global access keys for the Kembang AI Engine.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-foreground text-background px-3 py-1.5 text-xs font-semibold rounded-sm hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Create Global Key
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="border rounded-sm bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-muted/40 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/80">
                ACTIVE_AUTH_KEYS
              </h3>
              <span className="text-[10px] font-mono opacity-40 font-bold uppercase">
                Count: 02_TOTAL
              </span>
            </div>
            <div className="divide-y divide-border/60">
              {mockKeys.map((key) => (
                <div
                  key={key.id}
                  className="p-6 space-y-4 hover:bg-muted/[0.02] transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-sm border flex items-center justify-center ${key.type === "Live" ? "bg-accent/10 border-accent/20" : "bg-muted/40 border-border"}`}
                      >
                        <Key
                          className={`w-5 h-5 ${key.type === "Live" ? "text-accent" : "text-muted-foreground"}`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold tracking-tight">
                          {key.name}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider font-bold">
                          {key.type}_ENV_DEPLOYMENT
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 border border-border/60 rounded-sm hover:bg-muted transition-colors">
                        <RotateCw className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button className="p-2 border border-border/60 rounded-sm hover:bg-red-500/10 hover:border-red-500/20 transition-colors group">
                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-red-500" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/40 border border-border/40 rounded-sm font-mono text-xs">
                    <Lock className="w-3 h-3 text-accent opacity-50" />
                    <span className="flex-1 truncate opacity-80">
                      {key.key}
                    </span>
                    <div className="flex gap-1">
                      <button
                        className="p-1.5 hover:bg-muted rounded-sm transition-colors border border-transparent hover:border-border/60"
                        title="Show Key"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-muted rounded-sm transition-colors border border-transparent hover:border-border/60"
                        title="Copy Key"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground font-bold uppercase tracking-tight">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-green-500" />
                      ACL_PERMISSION: FULL_ACCESS
                    </span>
                    <span className="opacity-60">LST_USED: {key.lastUsed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-500/5 border border-yellow-500/20 p-6 rounded-sm flex gap-4">
            <Info className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold uppercase tracking-tight text-yellow-600 dark:text-yellow-400">
                Security Warning
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Global Keys have unrestricted access to all tenants and
                knowledge bases. Do not share these keys or expose them in
                client-side code. For widget integrations, always use{" "}
                <span className="text-foreground underline">
                  Tenant-specific API Keys
                </span>{" "}
                found in the Tenant Registry.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border p-6 rounded-sm bg-card space-y-4 shadow-sm">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Key_Rotation_Policy
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-mono opacity-80">
              [SYSTEM_POLICY]: Keys should be rotated every 90 days. Next
              scheduled_maintenance:{" "}
              <span className="text-accent underline font-bold uppercase">
                2026-05-15
              </span>
              .
            </p>
            <div className="pt-2">
              <button className="w-full py-2 bg-muted/40 text-[10px] font-mono font-bold uppercase hover:bg-muted/60 transition-colors rounded-sm border border-border/60 tracking-widest">
                Configure Policy
              </button>
            </div>
          </div>

          <div className="border p-6 rounded-sm bg-card space-y-4 shadow-sm">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Permission_Scopes_ACL
            </h4>
            <div className="space-y-2.5">
              {[
                { label: "RAG_READ", access: true },
                { label: "RAG_WRITE", access: true },
                { label: "TENANT_ADMIN", access: true },
                { label: "LOG_VIEWER", access: false },
              ].map((scope) => (
                <div
                  key={scope.label}
                  className={`flex justify-between items-center font-mono text-[10px] uppercase font-bold tracking-tight ${scope.access ? "text-foreground" : "text-muted-foreground opacity-40"}`}
                >
                  <span>{scope.label}</span>
                  <div
                    className={`w-1.5 h-1.5 rounded-sm ${scope.access ? "bg-accent shadow-[0_0_4px_rgba(100,100,255,0.5)]" : "bg-muted"}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
