import {
  FileText,
  Upload,
  Activity,
  Trash2,
  Database,
  ExternalLink,
  Info,
} from "lucide-react";

const mockDocs = [
  {
    id: "doc_01",
    name: "Menu_Kopi_Kenangan.pdf",
    size: "1.2 MB",
    status: "Ready",
    tenant: "Coffee Shop Bali",
    coverage: "98%",
  },
  {
    id: "doc_02",
    name: "Kamus_Layanan_Kamera.pdf",
    size: "4.5 MB",
    status: "Processing",
    tenant: "Rental Kamera XYZ",
    coverage: "0%",
  },
  {
    id: "doc_03",
    name: "SOP_Pengiriman_Butik.pdf",
    size: "890 KB",
    status: "Ready",
    tenant: "Butik Kebaya Modern",
    coverage: "100%",
  },
];

export default function KBOrchestratorPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Knowledge Base Orchestrator
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Centrally manage document ingestion for all tenants.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-foreground text-background px-3 py-1.5 text-xs font-semibold rounded-sm hover:opacity-90 transition-opacity">
            <Upload className="w-3.5 h-3.5" />
            Global Upload
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Vectors", value: "45,821", icon: Database },
          { label: "Storage Used", value: "158 MB", icon: FileText },
          { label: "Processing", value: "1", icon: Activity, active: true },
          { label: "Avg Retrieve", value: "312ms", icon: Info },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border p-4 rounded-sm bg-card flex items-center gap-4 group hover:border-accent/40 transition-colors"
          >
            <div
              className={`p-2 rounded-sm border ${stat.active ? "bg-accent/10 border-accent/20" : "bg-muted border-border"}`}
            >
              <stat.icon
                className={`w-4 h-4 ${stat.active ? "text-accent" : "text-muted-foreground"}`}
              />
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                {stat.label}
              </p>
              <p className="text-lg font-bold tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-sm bg-card overflow-hidden">
        <div className="p-4 border-b bg-muted/40">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/80">
            Document Registry
          </h3>
        </div>
        <div className="divide-y divide-border">
          {mockDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border flex items-center justify-center rounded-sm bg-muted/20">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{doc.name}</p>
                    <span className="text-[9px] font-mono bg-border px-1.5 py-0.5 rounded-sm uppercase tracking-tighter opacity-70">
                      {doc.size}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <span className="font-mono text-accent">{doc.tenant}</span>
                    <span className="opacity-30">•</span>
                    <span className="font-mono">{doc.id}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">
                    Status
                  </p>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-sm font-bold uppercase ${
                      doc.status === "Ready"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-blue-500/10 text-blue-500 animate-pulse"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
                <div className="text-right w-24">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase mb-1">
                    Coverage
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent"
                        style={{ width: doc.coverage }}
                      />
                    </div>
                    <span className="text-[10px] font-mono">
                      {doc.coverage}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-muted border rounded-sm transition-colors text-muted-foreground hover:text-foreground">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-sm transition-colors text-muted-foreground hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted/20 p-6 border rounded-sm flex items-start gap-4">
        <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-bold uppercase tracking-tight">
            Embedding Model Active: all-MiniLM-L6-v2
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The Knowledge Base uses local 384-dimensional embeddings for 100%
            cost-free ingestion. All documents are stored in the{" "}
            <code className="bg-muted px-1 rounded-sm text-accent">
              kembang_core_db
            </code>{" "}
            with pgvector indexing.
          </p>
        </div>
      </div>
    </div>
  );
}
