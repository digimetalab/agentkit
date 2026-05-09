# AgentKit Universal Integration: Workflow Proxy & 17+ Platform Support

## 1. Overview
This document specifies the architecture for the **Universal Workflow Proxy (UWP)** and the **Multi-Platform Adapter (MPA)**. The goal is to make all 216+ AgentKit skills instantly accessible via `/slash-commands` across all major AI coding agents.

## 2. Core Components

### 2.1 The Multi-Platform Adapter (MPA)
A registry of platform-specific handlers that translate AgentKit skills into the native configuration format of each AI agent.

| Category | Platform | Target Path | Format |
| :--- | :--- | :--- | :--- |
| **Rule-Based** | Cursor, Windsurf, Trae, Void, PearAI | `.cursor/rules/`, `.agent/rules/`, etc. | `.mdc` or `.md` |
| **Registry-Based**| Claude Code, Antigravity, Goose, Codex | `.claude/skills/`, `.agent/workflows/`, etc. | `.md` |
| **Instructional** | GitHub Copilot, Sourcegraph Cody, Tabnine | `.github/copilot-instructions.md`, etc. | Combined `.md` |
| **Config-Based** | Continue.dev, Aider | `.continue/config.json`, `.aider.conf.yml` | `.json` / `.yml` |

### 2.2 The Workflow Proxy Generator
A dynamic engine that creates "Proxy Files". These files act as a bridge, telling the AI to load the heavy logic from the central `skills/` folder only when a specific `/command` is typed.

#### Proxy Template Logic:
```markdown
# /[command]
> Dynamic Proxy for [Skill Name]

## MANDATE
Switch to the [Skill Name] protocol defined in `../../skills/[skill-id]/SKILL.md`.

## EXECUTION
1. Load full context from skill source.
2. Execute the task following the skill's SOP.
3. Verify output against the skill's Quality Bar.
```

## 3. Revised CLI Command Reference

### `agentkit platform <command>`
- `install <name>`: Configure a specific platform (e.g., `agentkit platform install cursor`).
- `sync`: Auto-detect all platforms in the current directory and install relevant proxies.
- `list`: Show all supported platforms and their current status.

### `agentkit workflow <command>`
- `proxy [--all|--bundle <name>]`: Generate proxy files for installed skills.
- `clean`: Remove all generated proxy files.

### `agentkit sync` (Updated)
The "God Command" that performs:
1. Tech stack detection.
2. Skill bundle installation.
3. Multi-platform configuration.
4. Workflow proxy generation.

## 4. Implementation Strategy

### Phase 1: Platform Registry
Implement the `lib/platforms.js` module containing the directory paths and file templates for all 17+ agents.

### Phase 2: Proxy Engine
Develop the `workflow proxy` logic to iterate through installed skills and generate platform-appropriate files.

### Phase 3: Config Integration
Implement logic to edit existing files (like `config.json` for Continue or `.aider.conf.yml`) using non-destructive JSON/YAML parsing.

## 5. Success Criteria
- Typing `/` in Cursor shows the full list of installed AgentKit skills in the autocomplete.
- Running `agentkit sync` in a Next.js project automatically configures Cursor, Windsurf, and Copilot if their configs are detected.
- Proxy files correctly reference relative paths to the `skills/` directory.
