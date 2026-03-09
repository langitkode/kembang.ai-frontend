import "./globals.css";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuthGuard } from "@/components/AuthGuard";
import { LayoutWrapper } from "@/components/LayoutWrapper";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Kembang AI | Developer Console",
  description: "Technical management suite for RAG-powered chatbots.",
  icons: {
    icon: [
      { url: "/Assets/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/Assets/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/Assets/apple-touch-icon.png",
    shortcut: "/Assets/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <body
        className={`${geist.variable} ${mono.variable} font-sans bg-background text-foreground antialiased`}
      >
        <TooltipProvider>
          <AuthGuard>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AuthGuard>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
