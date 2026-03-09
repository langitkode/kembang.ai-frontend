"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Settings,
  Key,
  Zap,
  LogOut,
  Users as UsersIcon,
  Sparkles,
  HelpCircle,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth";

function NavGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-0.5">
      <p className="px-3 py-1.5 text-[9px] font-mono font-bold text-white/40 uppercase tracking-[0.15em]">
        {label}
      </p>
      {children}
    </div>
  );
}

function NavItem({ item, pathname }: { item: any; pathname: string }) {
  const isActive = pathname === item.href;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm transition-all relative group",
        isActive
          ? "text-white font-semibold"
          : "text-white/75 hover:text-white",
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-full" />
      )}
      <item.icon
        className={cn(
          "w-4 h-4 shrink-0 transition-colors",
          isActive ? "text-accent" : "text-white/50 group-hover:text-white/80",
        )}
      />
      <div className="flex-1 min-w-0">
        <p className="leading-none">{item.label}</p>
        {item.desc && !isActive && (
          <p className="text-[10px] text-white/45 font-normal mt-0.5 leading-none group-hover:text-white/65 transition-colors truncate">
            {item.desc}
          </p>
        )}
      </div>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;

  const userRole = typeof user?.role === "string" ? user.role : "admin";

  const buildItems = [
    {
      label: "Overview",
      href: "/",
      icon: LayoutDashboard,
      desc: "Your instance stats",
    },
    {
      label: "Knowledge Base",
      href: "/kb",
      icon: BookOpen,
      desc: "Documents & embeddings",
    },
    {
      label: "FAQ",
      href: "/faq",
      icon: HelpCircle,
      desc: "Manage FAQ & intents",
    },
    {
      label: "Products",
      href: "/products",
      icon: Package,
      desc: "Product catalog",
    },
  ];

  const monitorItems = [
    {
      label: "Conversations",
      href: "/chat",
      icon: MessageSquare,
      desc: "Chat history",
    },
    {
      label: "Playground",
      href: "/playground",
      icon: Sparkles,
      desc: "Test chatbot quality",
    },
  ];

  const configItems = [
    { label: "API Keys", href: "/settings/keys", icon: Key },
    { label: "Team Settings", href: "/settings/team", icon: UsersIcon },
    { label: "Integrations", href: "/settings/packages", icon: Zap },
    { label: "System Config", href: "/settings", icon: Settings },
  ];

  const initials =
    typeof user?.email === "string"
      ? user.email.substring(0, 2).toUpperCase()
      : "KA";

  const userEmail =
    typeof user?.email === "string" ? user.email.split("@")[0] : "User";

  return (
    <aside className="w-60 bg-[#0a0a0f] border-r border-white/[0.06] h-screen flex flex-col">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/Assets/kembang-ai.webp"
            alt="Kembang AI"
            className="w-9 h-9 object-contain drop-shadow-lg drop-shadow-accent/30"
          />
          <div>
            <h1 className="text-[13px] font-bold tracking-tight text-white leading-none">
              Kembang AI
            </h1>
            <p className="text-[9px] text-white/30 font-mono uppercase tracking-[0.12em] mt-0.5">
              Tenant Console
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-4 overflow-y-auto">
        <NavGroup label="Workspace">
          {buildItems.map((item) => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}
        </NavGroup>

        <NavGroup label="Monitor">
          {monitorItems.map((item) => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}
        </NavGroup>

        <NavGroup label="Configuration">
          {configItems.map((item) => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}
        </NavGroup>
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/[0.04] transition-colors group cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-accent">
              {initials}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-white leading-none truncate">
              {userEmail}
            </p>
            <p className="text-[10px] text-white/30 font-mono truncate mt-0.5">
              {userRole}
            </p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1 hover:text-red-400 text-white/20 transition-colors opacity-0 group-hover:opacity-100"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
