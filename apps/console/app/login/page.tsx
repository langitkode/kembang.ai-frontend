"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Lock, Mail, Loader2, Bot, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginDisabled, setLoginDisabled] = useState(false);
  const router = useRouter();
  const setAuth = useAuth((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.login({ email, password });

      // Get user profile to verify role
      api.setToken(data.access_token);
      const user = await api.getMe();

      if (user.role !== "superadmin") {
        toast.error("Access denied. Superadmin privileges required.");
        return;
      }

      setAuth(data.access_token, user);
      toast.success("Welcome back, Superadmin!");
      router.push("/");
    } catch (error: any) {
      console.error("Login failed:", error);

      // Handle security-related errors
      if (error.response?.status === 429) {
        // Rate limited
        const retryAfter = error.response.data?.retry_after || '1 minute';
        toast.error(
          `Too many failed attempts. Please try again after ${retryAfter}`
        );
        setLoginDisabled(true);
        setTimeout(() => setLoginDisabled(false), 60000);
      } else if (error.response?.status === 423) {
        // Account locked
        toast.error(
          'Account locked due to too many failed attempts. Please try again later or reset your password.'
        );
      } else if (error.response?.status === 401) {
        // Invalid credentials
        toast.error('Invalid email or password');
      } else {
        // Generic error
        toast.error(
          error.response?.data?.detail || 'Login failed. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#070709] relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md px-4 relative z-10">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center justify-center mb-2">
            <img
              src="/Assets/kembang-ai.webp"
              alt="Kembang AI"
              className="w-20 h-20 object-contain drop-shadow-2xl drop-shadow-accent/40"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Kembang AI
          </h1>
          <p className="text-white/40 font-mono text-[10px] uppercase tracking-[0.2em]">
            Superadmin Console Gateway
          </p>
        </div>

        <Card className="bg-card/50 border-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription className="text-xs text-white/40">
              Enter your superadmin credentials to access the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    type="email"
                    placeholder="name@agency.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/[0.03] border-white/10 focus:border-accent/50 transition-colors"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white/[0.03] border-white/10 focus:border-accent/50 transition-colors"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-accent hover:bg-accent/90 text-white font-bold tracking-wide transition-all shadow-lg shadow-accent/20"
                disabled={loading || loginDisabled}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : loginDisabled ? (
                  "LOGIN DISABLED (COOLDOWN)"
                ) : (
                  "AUTHENTICATE SYSTEM"
                )}
              </Button>

              {loginDisabled && (
                <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                  <p className="text-xs text-yellow-500">
                    Too many failed attempts. Cooldown: 60s
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-[10px] font-mono text-white/20 uppercase tracking-widest">
          Secure Environment • Encrypted Channel
        </p>
      </div>
    </div>
  );
}
