# Kembang AI — Design System (High-Performance Style)

This document defines the **Technical Visual Language** for Kembang AI. Inspired by platforms like **Vercel, Clerk, and Sanity.io**, the design prioritizes precision, speed, and content density over decorative effects.

## 🛠 Design Philosophy

- **Precision over Decoration**: Sharp edges, technical borders, and high contrast.
- **Data-First**: Clean, readable layouts optimized for complex SaaS operations.
- **Technical Aesthetic**: Using mono fonts for technical data and identifiers (API Keys, UUIDs).
- **🚫 NO GIBBERISH**: Do not use filler text (Lorem Ipsum), vague greeting messages, or "marketing fluff" in the dashboard. Use realistic technical placeholders (e.g., `kw_live_...`, `tenant_id: 550e8400...`, `token_count: 1542`).

## 🎨 Color Palette (High-Contrast)

- **Primary**: `#000000` (Light Mode) / `#FFFFFF` (Dark Mode).
- **Accents**:
  - Indigo: `#6366F1` (Focus/Primary actions).
  - Emerald: `#10B981` (Success/Kembang growth).
- **Surface**:
  - Base: `#FFFFFF` (Light) / `#000000` (Dark).
  - Muted: `#FAFAFA` (Light) / `#0A0A0A` (Dark).
- **Borders**: Sharp `#E5E7EB` (Light) / `#262626` (Dark).

## ✍️ Typography

- **Primary (UI/Body)**: `Inter` — Clean, legible, neutral.
- **Technical (Data/Code)**: `IBM Plex Mono` — For ID numbers, logs, code snippets, and API keys.
- **Headings**: `Inter` (Bold/Semibold) or `Geist` — Tight, professional, no large gaps between headers and content.

## 💎 Visual Style (The "Vercel" Look)

- **Corners**: Sharp or minimal radius (max `4px` / `rounded-sm`).
- **Shadows**: Minimal to none. Use thin borders (`1px`) to define depth.
- **Whitespace**: Calculated and compact. High density for dev tools.
- **Interaction**: Crisp state changes (e.g., `border-color` transitions instead of scaling or blurring).

## 🧩 Dashboard Layout

- **Navigation**: Sidebar with thin borders. Dark background with subtle gray text.
- **Metadata**: Display technical metadata (last updated, tenant_id) using mini IBM Plex Mono text.
- **Tables**: Column-based with light horizontal dividers. No vertical borders. Data cells using `IBM Plex Mono` for numerical values.

## 💬 Widget Design

- **Launcher**: Square or slightly rounded (`4px`) button with a minimalist orchid/flower icon.
- **Window**: Crisp borders. Header has a flat background. No transparency.
- **Bubbles**: Flat backgrounds. User: Dark gray/Black; Assistant: White/Very Light Gray with a precise border.
- **Input**: Clean text area with a mono-font indicator for character count or status.

---

### Example Stitch Prompt Snippet:

> "Generate a high-performance Developer Console for Kembang AI using the guidelines in d:\Projects\kembang.ai\frontend_context\stitch.md. **CRITICAL: No gibberish text.** Use realistic technical data (tenant IDs, token counts, request logs). Style: Sharp edges (4px max), Vercel-inspired high contrast, IBM Plex Mono for technical data, and Inter for primary UI elements."
