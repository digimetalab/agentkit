# Getting Started with AgentKit

**New here? This guide will help you supercharge your AI Agent in under 5 minutes.**

---

## 🤔 What Are "Skills"?

AI Agents (like **Cursor**, **Windsurf**, **Claude Code**) are smart, but they lack specific knowledge about your tools.
**Skills** are specialized instruction manuals (markdown files) that teach your AI how to perform specific tasks perfectly, every time.

**Analogy:** Your AI is a brilliant intern. **Skills** are the SOPs that make them a Senior Engineer.

---

## ⚡️ Quick Start

### 1. Run the Wizard

```bash
npx @digimetalab/agentkit
```

This launches an interactive wizard that:
1. Asks which AI Agent you're using (Cursor, Windsurf, Claude, etc.)
2. Lets you pick a Skill Bundle
3. Installs everything to the correct directory

### 2. Pick Your Bundle

| Bundle | Skills | Description |
|---|---|---|
| 💻 **full-stack** | 77 | Modern App Builder |
| 🕵️ **security-expert** | 46 | Pentester & Auditor |
| ✍️ **content-writer** | 34 | Writer & Creator |
| 🤖 **ai-engineer** | 65 | LLM Architect |
| 📊 **data-scientist** | 18 | Data Analyst |
| 🦄 **startup-founder** | 25 | Entrepreneur |
| 🎨 **creative-studio** | 50 | Designer / Artist |

### 3. Start Using Skills

Once installed, just talk to your AI naturally:

> "Use the **concise-planning** skill to help me plan a new feature."

---

## 🛠️ CLI Commands

| Command | Description |
|---|---|
| `agentkit` | Launch Setup Wizard |
| `agentkit list` | List all bundles |
| `agentkit install <bundle>` | Install a bundle |
| `agentkit status` | Show current setup |
| `agentkit doctor` | Health check |
| `agentkit --help` | Show all commands |

---

## 🔌 Supported Agents

| Agent | Path |
|---|---|
| **Antigravity** | `.agent/skills/` |
| **Cursor** | `.cursor/skills/` |
| **Windsurf** | `.agent/skills/` |
| **Claude Code** | `.claude/skills/` |
| **Gemini CLI** | `.gemini/skills/` |
| **Codex CLI** | `.codex/skills/` |
| **OpenCode** | `.agent/skills/` |
| **TRAE Code AI** | `.trae/skills/` |

---

## 🛡️ Trust & Safety

Skills are classified by risk level:

* 🟢 **Low**: Non-destructive (planning, documentation)
* 🟡 **Medium**: Modifies files (code generation)
* 🔴 **High**: System access (security testing)

---

## ❓ FAQ

**Q: Do I need to install all 315+ skills?**
A: No! Pick a bundle that matches your role. Install more later with `agentkit install <bundle>`.

**Q: Can I make my own skills?**
A: Yes! See [SKILL_ANATOMY.md](SKILL_ANATOMY.md).

**Q: Is this free?**
A: Yes, MIT License. Open source forever.

---

## ⏭️ Next Steps

1. [Browse the Bundles](BUNDLES.md)
2. [See Skill Catalog](SKILLS_CATALOG.md)
3. [Contribute a Skill](../CONTRIBUTING.md)
