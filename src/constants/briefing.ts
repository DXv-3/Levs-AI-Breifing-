export const BRIEFING_DATA = {
  title: "AI & Agents Landscape Briefing",
  author: "Lev Selector",
  date: "April 13, 2026",
  location: "Miami Beach, FL",
  sections: [
    {
      id: "philosophy",
      title: "I. Opening Frame — Philosophy of the Moment",
      content: `
"Intelligence is the ability to adapt to change." — Stephen Hawking
"Intelligence is the ability to avoid doing work, yet getting the work done." — Linus Torvalds
"God helps those who help themselves." — Benjamin Franklin

Lev's thesis: We are in a period of social instability — historically the most fertile ground for unusual growth. Frightening, yes. Extraordinarily interesting, absolutely. The imperative: adapt to change, and do it fast.
      `
    },
    {
      id: "leaderboard",
      title: "II. LLM Leaderboard Update",
      content: `
**New Entrant: Meta's News Spark**
- Debuted on the leaderboard at a high position
- No open code release — Meta explicitly stated they are "not proud" of the code and are watching/iterating
- Token efficient — uses fewer tokens than comparable models
- Widely deployed — available across Meta's ecosystem: WhatsApp, Instagram, and other Meta-owned apps

**Leaderboard Snapshot:**
- Overall Leader: Same top players + News Spark
- Open Source Leader: All Chain — current open-source king
      `
    },
    {
      id: "palace",
      title: "III. Memory Architecture: Palace",
      content: `
**Hierarchical Memory Model:**
- **Palace**: The whole structure (Top-level container)
- **Wings**: Major sections (Large thematic groupings)
- **Poles**: Medium sections (Sub-groupings)
- **Rooms**: Atomic units (Smallest discrete memory chunks)

**Tech Stack:**
- **ChromaDB**: Vector database for embeddings/semantic search. Now improved with persistence.
- **SQLite**: Lightweight relational DB used for knowledge graph storage.

**Key Takeaway:**
A lightweight text stack using simple, well-known tools performs remarkably well on memory benchmarks. Deceptively simple but a major achievement.
      `
    },
    {
      id: "agents",
      title: "IV. The Agent Explosion",
      content: `
**🔥 Catalyst Events (January 2026):**
1. **Anthropic's Desktop Agents**: Launched several, including a legal assistant. Crashed the SaaS market.
2. **OpenCore's Meteoric Rise**: 350,000+ GitHub stars. Updates shipping every 1–2 days.

**📋 Agent Taxonomy:**
- **Desktop/Local**: OpenCore, Hermes (self-improving), Abacus AI Desktop, Cursor (Rust-native), OpenAI Operator, Manus AI, Perplexity Computer/XP, Devstral, Gemini CLI.
- **Cloud Platform**: Tencent, Alibaba, Baidu (Asia); Mistral (Europe); Gemini Agent, Alpha Gen AI, Apple Intelligence (US); DeepSeek, Multi-Owner (Global).

**🎯 Lev's Take:**
"I used to be a software engineer... I'm cured." You're no longer a coder. You're a teacher, organizer, and manager of agents.
      `
    },
    {
      id: "ecosystem",
      title: "V. Claude Ecosystem & Cloud Code",
      content: `
- **Claude Buddy**: A virtual pet built into Claude Code terminal app.
- **Usage Restrictions**: Anthropic throttled OpenCore patterns due to infrastructure load.
- **M365 Connector**: Read-only access to Microsoft 365 from Claude.
- **Anthropic Mythus**: Classified tier model. CVSS score 4.6. Deployed in Project Glasswing (cybersecurity consortium). Not public.
      `
    },
    {
      id: "models",
      title: "VI. Model Releases & Benchmarks",
      content: `
- **Google Gemma 4**: 27B parameters. Performance comparable to Claude 3.5 class (~400B+). Runnable locally via Ollama.
- **Super Intelligence Labs (SSI)**: Alexander Wang's first model. Extremely token-efficient. Needs ~84GB VRAM.
- **Microsoft MAI**: Proprietary models (Transcribe, Voice, Image).
- **Alibaba Qwen 2.1**: AI Video Model. Improved motion fluidity, first/last frame control.
      `
    },
    {
      id: "tools",
      title: "VII. Tools & Platforms",
      content: `
- **OpenAgents**: Multi-agent platform with shared context.
- **Abacus Co-Work**: Desktop AI assistant for Mac, Windows, Linux.
- **Awesome Design .md**: Workflow: Copy .md -> Tell agent "build me a page that looks like this" -> Pixel-perfect UI.
- **Talon Pro**: 120 features in 90 days using Claude Code.
- **Perplexity Computer**: Tax Preparation feature.
- **Digits**: AI-Powered Accounting (QuickBooks competitor). 97% auto-classification.
- **Caveman Plugin**: Compresses Gemini output by 75%.
      `
    },
    {
      id: "memory",
      title: "VIII. Memory & Knowledge Graphs",
      content: `
**Karpathy Method**: Obsidian -> Wiki -> Agent Memory.
- Simple Wiki-based searchable memory is sufficient for most. No massive infrastructure required.
- **Hermes Agent**: Self-improving behavior loop. Automatically reviews tool calls and updates own prompts.
      `
    },
    {
      id: "megatrends",
      title: "IX. Macro Trends & Synthesis",
      content: `
1. **Desktop Agent Revolution**: Moving from cloud to local. SaaS disrupted.
2. **Memory is the Moat**: The agent that remembers best, wins.
3. **Small Models, Giant Killers**: Capability decoupling from parameter count.
4. **Humans as Managers**: Orchestrating AI rather than manual execution.
5. **Agent-First Web**: Presence optimized for agents, not humans.
      `
    }
  ]
};
