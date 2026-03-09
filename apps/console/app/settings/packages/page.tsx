"use client";

import { useState } from "react";
import {
  Code2,
  Copy,
  Check,
  Package,
  Globe,
  MessageSquare,
  Zap,
  Terminal,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WIDGET_CDN = "https://cdn.kembang.ai/widget.js";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://your-backend.hf.space";

export default function IntegrationsPage() {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  function copyCode(key: string, code: string) {
    navigator.clipboard.writeText(code);
    setCopiedTab(key);
    setTimeout(() => setCopiedTab(null), 2000);
  }

  const apiKey = "kw_live_YOUR_API_KEY_HERE";

  const snippets = {
    html: `<!-- Kembang AI Widget -->
<script>
  window.KembangConfig = {
    apiKey: "${apiKey}",
    position: "bottom-right",
    theme: "auto",
  };
</script>
<script src="${WIDGET_CDN}" async defer></script>`,

    react: `// npm install @kembang/widget-react
import { KembangWidget } from "@kembang/widget-react";

export default function App() {
  return (
    <>
      {/* your app content */}
      <KembangWidget
        apiKey="${apiKey}"
        position="bottom-right"
        theme="auto"
      />
    </>
  );
}`,

    api: `// Direct API integration
const response = await fetch("${API_BASE_URL}/api/v1/widget/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "${apiKey}",
  },
  body: JSON.stringify({
    message: "Harga cappuccino berapa?",
    user_identifier: "user_12345",
    conversation_id: null,
  }),
});

const { reply, conversation_id, sources } = await response.json();`,
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Integrations</h2>
        <p className="text-muted-foreground text-sm">
          Embed the Kembang AI chatbot widget on any website. Choose your integration method below.
        </p>
      </header>

      {/* Integration method cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Globe,
            label: "HTML Snippet",
            desc: "Paste into any HTML website. No framework needed.",
            badge: "Recommended",
            badgeColor: "text-green-500 bg-green-500/10 border-green-500/20",
          },
          {
            icon: Package,
            label: "React Component",
            desc: "Use the official @kembang/widget-react npm package.",
            badge: "npm package",
            badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          },
          {
            icon: Terminal,
            label: "REST API",
            desc: "Full control — call the backend API directly from your code.",
            badge: "Advanced",
            badgeColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
          },
        ].map((item) => (
          <Card key={item.label} className="hover:border-accent/30 transition-colors">
            <CardContent className="p-5 space-y-3">
              <item.icon className="w-5 h-5 text-accent" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{item.label}</h3>
                  <Badge variant="outline" className={`text-[9px] ${item.badgeColor}`}>
                    {item.badge}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Code blocks */}
      <Tabs defaultValue="html" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="html" className="gap-2">
            <Globe className="w-3.5 h-3.5" />
            HTML
          </TabsTrigger>
          <TabsTrigger value="react" className="gap-2">
            <Package className="w-3.5 h-3.5" />
            React
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Terminal className="w-3.5 h-3.5" />
            REST API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="html" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                HTML Snippet
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyCode("html", snippets.html)}
              className="gap-2 text-xs"
            >
              {copiedTab === "html" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </Button>
          </div>
          <Card className="bg-[#070709] border-border/40">
            <CardContent className="p-5">
              <pre className="text-[11px] font-mono text-green-400/90 overflow-x-auto leading-relaxed">
                <code>{snippets.html}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="react" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                React / Next.js
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyCode("react", snippets.react)}
              className="gap-2 text-xs"
            >
              {copiedTab === "react" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </Button>
          </div>
          <Card className="bg-[#070709] border-border/40">
            <CardContent className="p-5">
              <pre className="text-[11px] font-mono text-blue-300/90 overflow-x-auto leading-relaxed">
                <code>{snippets.react}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                REST API (Direct)
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyCode("api", snippets.api)}
              className="gap-2 text-xs"
            >
              {copiedTab === "api" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-500" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy
                </>
              )}
            </Button>
          </div>
          <Card className="bg-[#070709] border-border/40">
            <CardContent className="p-5">
              <pre className="text-[11px] font-mono text-violet-300/90 overflow-x-auto leading-relaxed">
                <code>{snippets.api}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tips */}
      <Alert className="bg-amber-500/5 border-amber-500/20">
        <Zap className="w-4 h-4 text-amber-500" />
        <AlertTitle className="text-amber-600 dark:text-amber-400">Before you embed</AlertTitle>
        <AlertDescription className="text-muted-foreground space-y-2">
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>
              Replace{" "}
              <code className="bg-amber-500/10 text-amber-300 px-1 rounded font-mono text-xs">
                kw_live_YOUR_API_KEY_HERE
              </code>{" "}
              with your actual API key from the{" "}
              <a href="/settings/keys" className="text-accent hover:underline">
                API Keys
              </a>{" "}
              page.
            </li>
            <li>
              Make sure you have uploaded at least one document to the{" "}
              <a href="/kb" className="text-accent hover:underline">
                Knowledge Base
              </a>{" "}
              so the chatbot has something to answer with.
            </li>
            <li>
              Add your site URL to CORS allowed origins in the backend environment config.
            </li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );
}
