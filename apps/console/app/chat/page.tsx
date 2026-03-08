import {
  MessageSquare,
  Search,
  Filter,
  ChevronRight,
  Clock,
  User,
  ShieldCheck,
  Download,
} from "lucide-react";

const mockChats = [
  {
    id: "c_98x1",
    tenant: "Coffee Shop Bali",
    user: "whatsapp:+62812...",
    lastMsg: "Berapa harga Cappuccino?",
    time: "2 mins ago",
    platform: "WhatsApp",
  },
  {
    id: "c_22y9",
    tenant: "Rental Kamera XYZ",
    user: "user_9921",
    lastMsg: "Sony A7IV ready besok?",
    time: "14 mins ago",
    platform: "Web Widget",
  },
  {
    id: "c_01z4",
    tenant: "Coffee Shop Bali",
    user: "whatsapp:+62877...",
    lastMsg: "Buka jam berapa ya?",
    time: "1 hour ago",
    platform: "WhatsApp",
  },
  {
    id: "c_44k2",
    tenant: "Butik Kebaya Modern",
    user: "user_4431",
    lastMsg: "Ada ukuran XL untuk kebaya merah?",
    time: "3 hours ago",
    platform: "Web Widget",
  },
  {
    id: "c_77m1",
    tenant: "Coffee Shop Bali",
    user: "telegram:559218",
    lastMsg: "Terima kasih informasinya!",
    time: "Yesterday",
    platform: "Telegram",
  },
];

export default function ChatHistoryPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-end border-b pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Conversation Auditor
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Global chat logs and quality assurance tools.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-border px-3 py-1.5 text-xs font-semibold rounded-sm hover:bg-muted/50 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export Logs
          </button>
        </div>
      </header>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search within messages or identifiers..."
            className="w-full bg-muted/20 border border-border rounded-sm py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent font-mono"
          />
        </div>
        <button className="flex items-center gap-2 border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-muted/50 transition-colors">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat List */}
        <div className="lg:col-span-1 border rounded-sm bg-background divide-y divide-border h-[calc(100vh-280px)] overflow-y-auto">
          <div className="p-4 bg-muted/30 border-b">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-tighter text-muted-foreground">
              Active Sessions
            </h4>
          </div>
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              className="p-4 hover:bg-muted/10 cursor-pointer transition-colors group relative"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-mono text-accent font-bold">
                  {chat.tenant}
                </span>
                <span className="text-[9px] font-mono text-muted-foreground opacity-60">
                  {chat.time}
                </span>
              </div>
              <p className="text-sm font-semibold truncate pr-4">
                {chat.lastMsg}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[9px] font-mono text-muted-foreground bg-border px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">
                  {chat.platform}
                </span>
                <span className="text-[9px] font-mono text-muted-foreground truncate opacity-70">
                  {chat.user}
                </span>
              </div>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Auditor Detail Viewer */}
        <div className="lg:col-span-2 border rounded-sm bg-background flex flex-col h-[calc(100vh-280px)]">
          <div className="p-4 border-b bg-muted/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-center">
                <User className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold">whatsapp:+6281211223344</p>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  SESSION: kw_sess_9921_abc
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center text-[10px] font-mono text-muted-foreground">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              VERIFIED TENANT
            </div>
          </div>

          <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-muted/[0.01]">
            <div className="space-y-2 max-w-[85%]">
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-tight">
                <Clock className="w-3 h-3" /> 13:36:01 • USER_IDENTIFIER
              </div>
              <div className="bg-card/50 p-3 border border-border/60 rounded-sm text-sm leading-relaxed">
                Berapa harga Cappuccino dan apakah ada promo hari ini?
              </div>
            </div>

            <div className="space-y-2 max-w-[85%] ml-auto text-right">
              <div className="flex items-center justify-end gap-2 text-[10px] font-mono text-accent uppercase tracking-tight font-bold">
                ENGINE_ASSISTANT • 13:36:02 <Clock className="w-3 h-3" />
              </div>
              <div className="bg-foreground text-background p-4 border rounded-sm text-sm text-left shadow-lg">
                Harga Cappuccino kami Rp 35.000. Untuk promo hari ini: "Tuesday
                Treats", diskon 20% khusus untuk pembelian lewat aplikasi atau
                widget web kami!
                <div className="mt-3 pt-2 border-t border-background/20 space-y-2">
                  <p className="text-[9px] font-mono opacity-60 uppercase font-bold">
                    RAG_SOURCES_FOUND:
                  </p>
                  <div className="flex gap-2">
                    <p className="text-[9px] font-mono bg-background/10 inline-block px-1.5 py-0.5 rounded-sm hover:bg-background/20 cursor-pointer border border-background/10 transition-colors">
                      Menu_Kopi_Bali.pdf
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 max-w-[85%]">
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-tight">
                <Clock className="w-3 h-3" /> 13:37:15 • USER_IDENTIFIER
              </div>
              <div className="bg-card/50 p-3 border border-border/60 rounded-sm text-sm leading-relaxed">
                Terima kasih! Bisa pakai QRIS?
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-muted/20">
            <div className="flex items-center gap-2 px-3 py-1.5 border border-yellow-500/30 bg-yellow-500/5 rounded-sm">
              <ShieldCheck className="w-3 h-3 text-yellow-500" />
              <p className="text-[10px] font-mono text-yellow-600 dark:text-yellow-400">
                READ-ONLY MODE: Conversation auditing is active.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
