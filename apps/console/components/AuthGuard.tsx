"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/store/auth";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // If no token/user and not on login page, redirect to login
    if (!token && pathname !== "/login") {
      router.push("/login");
    }

    // If logged in and on login page, redirect to dashboard
    if (token && pathname === "/login") {
      router.push("/");
    }
  }, [token, pathname, router, mounted]);

  // Prevent flicker during hydration
  if (!mounted) return null;

  // Don't show sidebar/layout on login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (!token) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#070709] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase">
          Verifying System Credentials
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
