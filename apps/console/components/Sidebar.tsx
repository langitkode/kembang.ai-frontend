"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Activity,
  Settings,
  ShieldCheck,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Tenant Registry", href: "/tenants", icon: Users },
  { label: "Knowledge Base", href: "/kb", icon: FileText },
  { label: "Conversations", href: "/chat", icon: MessageSquare },
  { label: "Infrastructure", href: "/infra", icon: Activity },
];

const secondaryItems = [
  { label: "API Keys", href: "/settings/keys", icon: ShieldCheck },
  { label: "Packages", href: "/settings/packages", icon: Package },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-[hsl(var(--sidebar-background))] h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 bg-accent rounded-sm flex items-center justify-center group-hover:bg-accent/80 transition-colors">
            <span className="text-[10px] font-bold text-white">KB</span>
          </div>
          <h1 className="text-sm font-bold tracking-tight uppercase">
            Kembang AI
          </h1>
        </Link>
        <p className="text-[9px] font-mono text-muted-foreground mt-2 tracking-widest opacity-80 uppercase">
          Developer Console
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="px-2 py-2">
          <p className="text-[10px] font-mono font-bold text-foreground/40 uppercase tracking-widest">
            Management
          </p>
        </div>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm transition-all rounded-sm",
              pathname === item.href
                ? "bg-muted/40 text-foreground font-semibold border border-border/50 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/20",
            )}
          >
            <item.icon
              className={cn(
                "w-4 h-4",
                pathname === item.href ? "text-accent" : "opacity-70",
              )}
            />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <div className="px-2 py-2">
          <p className="text-[10px] font-mono font-bold text-foreground/40 uppercase tracking-widest">
            Preferences
          </p>
        </div>
        {secondaryItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm transition-all rounded-sm",
              pathname === item.href
                ? "bg-muted/40 text-foreground font-semibold border border-border/50 shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/20",
            )}
          >
            <item.icon
              className={cn(
                "w-4 h-4",
                pathname === item.href ? "text-accent" : "opacity-70",
              )}
            />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-border bg-muted/5">
        <div className="flex items-center gap-3 px-2">
          <div className="w-6 h-6 rounded-full bg-border flex items-center justify-center">
            <span className="text-[10px] font-bold">JD</span>
          </div>
          <div className="flex-1 overflow-hidden text-ellipsis">
            <p className="text-xs font-semibold leading-none">Joe Dev</p>
            <p className="text-[10px] text-muted-foreground font-mono truncate">
              joe@kembang.ai
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
