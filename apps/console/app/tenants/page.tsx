import {
  Users,
  Plus,
  Search,
  MoreVertical,
  ExternalLink,
  ShieldAlert,
  Calendar,
} from "lucide-react";

const mockTenants = [
  {
    id: "t_89231",
    name: "Coffee Shop Bali",
    apiKey: "kw_live_...4a2b",
    status: "Active",
    created: "2026-02-15",
  },
  {
    id: "t_12344",
    name: "Warung Nasi Padang",
    apiKey: "kw_live_...9f1z",
    status: "Trial",
    created: "2026-03-01",
  },
  {
    id: "t_55621",
    name: "Rental Kamera XYZ",
    apiKey: "kw_live_...11x9",
    status: "Paused",
    created: "2026-01-20",
  },
  {
    id: "t_77812",
    name: "Butik Kebaya Modern",
    apiKey: "kw_live_...cc3e",
    status: "Active",
    created: "2026-03-05",
  },
];

export default function TenantRegistryPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tenant Registry</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your UMKM clients and their secure credentials.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-border px-3 py-1.5 text-xs font-semibold rounded-sm hover:bg-muted/50 transition-colors">
            <Search className="w-3.5 h-3.5" />
            Find Tenant
          </button>
          <button className="flex items-center gap-2 bg-foreground text-background px-3 py-1.5 text-xs font-semibold rounded-sm hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Onboard New UMKM
          </button>
        </div>
      </header>

      <div className="border rounded-sm overflow-hidden bg-card shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/40 border-b border-border text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              <th className="px-6 py-3.5 font-bold">Tenant Identity</th>
              <th className="px-6 py-3.5 font-bold">
                Access Key Identification
              </th>
              <th className="px-6 py-3.5 font-bold">Operational Status</th>
              <th className="px-6 py-3.5 font-bold">Registry Date</th>
              <th className="px-6 py-3.5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockTenants.map((tenant) => (
              <tr
                key={tenant.id}
                className="hover:bg-muted/10 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-sm flex items-center justify-center font-mono text-[10px]">
                      {tenant.id.split("_")[1]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{tenant.name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        {tenant.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 font-mono text-xs text-accent">
                    <ShieldAlert className="w-3 h-3 opacity-50" />
                    {tenant.apiKey}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-sm font-mono font-bold uppercase ${
                      tenant.status === "Active"
                        ? "bg-green-500/10 text-green-500"
                        : tenant.status === "Trial"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-yellow-500/10 text-yellow-500"
                    }`}
                  >
                    {tenant.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <Calendar className="w-3 h-3" />
                    {tenant.created}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 hover:bg-muted rounded-sm transition-colors text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-muted/20 border-t border-border flex justify-between items-center text-[10px] font-mono text-muted-foreground">
          <p className="opacity-60">Showing 4 of 12 registered tenants</p>
          <div className="flex gap-6 uppercase font-bold tracking-widest">
            <span className="cursor-pointer hover:text-foreground transition-colors">
              [Prev]
            </span>
            <span className="cursor-pointer hover:text-foreground transition-colors">
              {" "}
              [Next]
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-6 rounded-sm bg-card space-y-4 hover:border-accent/20 transition-colors">
          <h4 className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-accent" />
            Security Protocol Warning
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            API Keys are shared at the tenant level. Ensure your clients are
            aware that exposing their API key allows unauthorized interaction
            with their Knowledge Base.
          </p>
          <button className="text-[10px] font-mono font-bold text-accent uppercase hover:underline">
            Review security protocols
          </button>
        </div>
        <div className="border p-6 rounded-sm bg-card space-y-4 hover:border-green-500/20 transition-colors">
          <h4 className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-green-500/80">
            <ExternalLink className="w-4 h-4" />
            Integration Quick Access
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Directly test the Widget SDK for any tenant by passing their unique
            API Key in the initialization parameters.
          </p>
          <button className="text-[10px] font-mono font-bold text-green-500/80 uppercase hover:underline">
            Execute SDK Playground
          </button>
        </div>
      </div>
    </div>
  );
}
