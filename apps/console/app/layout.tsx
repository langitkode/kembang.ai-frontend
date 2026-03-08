import "./globals.css";
import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Kembang AI | Developer Console",
  description: "Technical management suite for RAG-powered chatbots.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${mono.variable} font-sans bg-background text-foreground antialiased`}
      >
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
                <button className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase font-bold tracking-widest">
                  Logout
                </button>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto bg-muted/[0.02]">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
