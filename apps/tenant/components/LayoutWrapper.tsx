"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import api from "@/lib/api";
import { Sidebar } from "@/components/Sidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { token, logout } = useAuth();
  const isLoginPage = pathname === "/login";

  // Initialize API token on mount and when token changes
  useEffect(() => {
    if (token) {
      console.log("LayoutWrapper: Setting API token:", token.substring(0, 20) + "...");
      api.setToken(token);
    } else {
      console.log("LayoutWrapper: No token available");
    }
  }, [token]);

  if (isLoginPage) return <>{children}</>;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border bg-background flex items-center px-8 justify-between shrink-0">
          <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-2">
            <span className="opacity-50 font-bold uppercase tracking-tight">
              System Status:
            </span>
            <span className="text-accent">Production-01</span>
            <span className="px-1.5 py-0.5 bg-green-500/10 text-green-500 rounded-sm">
              Operational
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <div className="h-4 w-[1px] bg-border mx-2" />
            <button className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase font-bold tracking-widest">
              Docs
            </button>
            <button
              onClick={handleLogout}
              className="text-[10px] font-mono text-muted-foreground hover:text-red-400 transition-colors uppercase font-bold tracking-widest"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-muted/[0.02]">
          {children}
        </main>
      </div>
    </div>
  );
}
