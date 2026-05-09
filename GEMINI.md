# AgentKit - Gemini Instructions

Welcome to the **AgentKit** repository. This file provides instructional context and foundational mandates for AI interactions within this workspace.

## 🤖 Project Overview

**AgentKit** is an enterprise-grade infrastructure layer designed to transform generic AI assistants into specialized **Senior Engineering Partners**. It functions as a skill manager that injects over 315+ battle-tested engineering SOPs (Standard Operating Procedures) directly into an AI agent's context.

- **Primary Stack:** Node.js
- **Architecture:** CLI-based installer and manager for markdown-based "skills".
- **Core Goal:** Deterministically enforce engineering standards (React patterns, security audits, etc.) across various AI agents (Antigravity, Cursor, Windsurf, etc.).
- **Key Concepts:**
    - **Skills:** Individual markdown files containing task-specific instructions.
    - **Bundles:** Curated collections of skills (e.g., `full-stack`, `security-expert`).
    - **Workflows:** Slash commands that trigger step-by-step SOPs.

## 🛠️ Building and Running

This is a Node.js CLI project.

- **Run CLI:** `node bin/agentkit.js` (or `npm start`)
- **Main Command:** `agentkit`
- **Development Setup:**
    - Install dependencies: `npm install`
    - Run locally: `node bin/agentkit.js`
- **Testing:** Currently no test suite specified (Placeholder: TODO).

## 📁 Project Structure

- `bin/`: CLI entry points (`agentkit.js`, `cli.js`).
- `lib/commands/`: Logic for individual CLI commands (`install`, `list`, `search`, `doctor`, etc.).
- `lib/utils.js`: Common utility functions and constants.
- `templates/skills/`: The library of 315+ skill templates.
- `docs/`: Comprehensive documentation for users and contributors.
- `scripts/`: Internal automation scripts for managing the skill library.

## 📜 Development Conventions

- **Code Style:** Standard JS (enforced via `standard` if configured, otherwise follow existing patterns).
- **CLI Framework:** Built using `commander`.
- **UI/UX:** Uses `chalk` for colors, `boxen` for panels, and `ora` for spinners.
- **Skill Management:** 
    - All skills must be indexed in `templates/skills/skills_index.json`.
    - Bundles are defined in `lib/bundles.json`.
- **File System:** Uses `fs-extra` for simplified asynchronous file operations.
- **Compatibility:** Native support is prioritized for **Antigravity** (`.agent/skills`), but installers must support multiple agent paths (Cursor, Windsurf, etc.).

## 🎯 Strategic Intent for AI Agents

When working on this codebase:
1.  **Surgical Changes:** Use the `replace` tool for precise updates to commands and utilities.
2.  **Skill Integrity:** If adding a new skill, ensure it follows the [SKILL_ANATOMY.md](docs/SKILL_ANATOMY.md) and is correctly added to `skills_index.json`.
3.  **Cross-Agent Support:** When modifying installation logic, ensure compatibility across all supported agents listed in `bin/agentkit.js`.
4.  **CLI UX:** Maintain the professional, high-signal CLI output style (banners, progress bars).

---
*Note: This file is used as foundational context. Refer to [README.md](README.md) for user-facing documentation.*
