"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import api from "@/lib/api";
import {
  Code2,
  Copy,
  Check,
  Package,
  Globe,
  MessageSquare,
  Zap,
  Terminal,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Widget CDN URLs
const WIDGET_VERSION = "1.0.0";
const WIDGET_CDN = `https://kembang-widget.vercel.app/widget-${WIDGET_VERSION}.js`;
const WIDGET_CDN_LATEST = "https://kembang-widget.vercel.app/widget.js";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://langitkode-kembang-ai-backend.hf.space";

export default function IntegrationsPage() {
  const { token } = useAuth();
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApiKey();
  }, [token]);

  async function fetchApiKey() {
    try {
      setLoading(true);
      const data = await api.getApiKey();
      setApiKey(data.api_key);
    } catch (error) {
      console.error("Failed to fetch API key:", error);
      toast.error("Failed to load API key. Please generate one first.");
    } finally {
      setLoading(false);
    }
  }

  function copyCode(key: string, code: string) {
    navigator.clipboard.writeText(code);
    setCopiedTab(key);
    setTimeout(() => setCopiedTab(null), 2000);
    toast.success("Code copied to clipboard!");
  }

  const displayApiKey = apiKey || "kw_live_YOUR_API_KEY_HERE";

  const snippets = {
    html: `<!-- Kembang AI Widget v${WIDGET_VERSION} -->
<script>
  window.KembangConfig = {
    apiKey: "${displayApiKey}",
    position: "bottom-right",
    theme: "auto",
  };
</script>
<script src="${WIDGET_CDN}" async defer></script>

<!-- Or use latest version (auto-updates) -->
<!-- <script src="${WIDGET_CDN_LATEST}" async defer></script> -->`,

    react: `// npm install @kembang/widget-react
import { KembangWidget } from "@kembang/widget-react";

export default function App() {
  return (
    <>
      {/* your app content */}
      <KembangWidget
        apiKey="${displayApiKey}"
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
    "X-API-Key": "${displayApiKey}",
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
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <header className="space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Integrations</h2>
            <p className="text-muted-foreground text-sm">
              Embed the Kembang AI chatbot widget on your website.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("https://kembang-widget.vercel.app", "_blank")}
          >
            <ExternalLink className="w-3.5 h-3.5 mr-2" />
            Widget Demo
          </Button>
        </div>
      </header>

      {/* API Key Status */}
      <Card className={loading ? "opacity-50" : ""}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Your API Key</CardTitle>
              <CardDescription className="text-xs">
                This key is used to authenticate widget requests
              </CardDescription>
            </div>
            {apiKey && (
              <Badge variant="outline" className="text-green-500 border-green-500/50">
                <Check className="w-3 h-3 mr-1" />
                Active
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading API key...
            </div>
          ) : apiKey ? (
            <div className="flex items-center gap-3 p-3 bg-muted/20 border rounded-lg font-mono text-xs">
              <Code2 className="w-4 h-4 text-accent shrink-0" />
              <span className="flex-1 truncate">{apiKey}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  toast.success("API key copied!");
                }}
              >
                <Copy className="w-3.5 h-3.5" />
              </Button>
            </div>
          ) : (
            <Alert className="bg-yellow-500/5 border-yellow-500/20">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <AlertTitle className="text-yellow-600 dark:text-yellow-400 text-xs">
                No API Key Found
              </AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground mt-1">
                Please generate an API key from the API Keys page first.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

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
          <Card
            key={item.label}
            className="hover:border-accent/30 transition-colors"
          >
            <CardContent className="p-5 space-y-3">
              <item.icon className="w-5 h-5 text-accent" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{item.label}</h3>
                  <Badge
                    variant="outline"
                    className={`text-[9px] ${item.badgeColor}`}
                  >
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
        <TabsList className="grid w-full grid-cols-3 bg-muted/20 border border-border/40">
          <TabsTrigger
            value="html"
            className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-white"
          >
            <Globe className="w-3.5 h-3.5" />
            HTML
          </TabsTrigger>
          <TabsTrigger
            value="react"
            className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-white"
          >
            <Package className="w-3.5 h-3.5" />
            React
          </TabsTrigger>
          <TabsTrigger
            value="api"
            className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-white"
          >
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

      {/* Testing Guide */}
      <Card className="bg-green-500/5 border-green-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-green-500">
            🧪 Testing Guide
          </CardTitle>
          <CardDescription className="text-xs text-green-500/70">
            Step-by-step guide to test your widget
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-green-500 border-green-500/50 shrink-0">
                1
              </Badge>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Generate API Key:</strong> Go to{" "}
                <a href="/settings/keys" className="text-accent hover:underline">
                  API Keys
                </a>{" "}
                and generate a new key if you don't have one.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-green-500 border-green-500/50 shrink-0">
                2
              </Badge>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Upload Documents:</strong> Add at least one
                document to the{" "}
                <a href="/kb" className="text-accent hover:underline">
                  Knowledge Base
                </a>{" "}
                so the chatbot can answer questions.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-green-500 border-green-500/50 shrink-0">
                3
              </Badge>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Copy Embed Code:</strong> Copy the HTML snippet
                above and paste it into your website before the closing{" "}
                <code className="bg-muted px-1 rounded font-mono text-xs">&lt;/body&gt;</code> tag.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-green-500 border-green-500/50 shrink-0">
                4
              </Badge>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Test Widget:</strong> Open your website and
                click the widget icon (bottom-right corner). Send a test message!
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-green-500 border-green-500/50 shrink-0">
                5
              </Badge>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Verify Response:</strong> The widget should
                respond based on your uploaded documents. Check browser console for errors.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-green-500/20">
            <Button
              variant="outline"
              size="sm"
              className="text-green-500 border-green-500/50 hover:bg-green-500/10"
              onClick={() => window.open("https://kembang-widget.vercel.app", "_blank")}
            >
              <ExternalLink className="w-3.5 h-3.5 mr-2" />
              Open Widget Playground
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Alert className="bg-amber-500/5 border-amber-500/20">
        <Zap className="w-4 h-4 text-amber-500" />
        <AlertTitle className="text-amber-600 dark:text-amber-400">
          Pro Tips
        </AlertTitle>
        <AlertDescription className="text-muted-foreground space-y-2">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              Use <strong>versioned widget URL</strong> (widget-1.0.0.js) for production stability
            </li>
            <li>
              Use <strong>latest widget URL</strong> (widget.js) for automatic updates (testing only)
            </li>
            <li>
              Keep your API key secure - never expose it in public repositories
            </li>
            <li>
              Test in incognito mode to avoid cache issues
            </li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
