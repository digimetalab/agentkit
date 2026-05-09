# Agentic OS: The Next Generation of AgentKit

## 1. Overview
This document outlines the architectural shift for AgentKit from a passive "skill installer" to an active **"Agentic OS" (Proactive Engineering Partner)**. This transformation merges intelligent automation, knowledge sharing, and rigorous security/quality guards into a single ecosystem. 

## 2. Core Concepts
The update focuses on three major pillars:
1. **Intelligent Automation (Autopilot):** Project-aware skill synchronization and self-healing configurations.
2. **Ecosystem & Collaboration (Knowledge Hub):** Seamless publishing, updating, and documentation of skills and architectural decisions.
3. **Reliability (Security & Quality Guard):** Automated, workflow-driven audits to enforce production standards before code is shipped.

## 3. Structural Transformation: The 5 Meta-Bundles
To reduce overlap and improve context targeting, the current 315+ skills (previously categorized by "Job Title") will be re-mapped into **5 Capability-Based Meta-Bundles**:

1. **The Foundation (Architecture, Standards, & Docs):** Clean Code, Git Workflows, ADRs. For project setup and onboarding.
2. **The Builder (Frontend, Backend, & Infrastructure):** React, API Patterns, DB Design, Docker, Cloud. For core execution.
3. **The Guardian (Security, Quality, & Scalability):** OWASP, Profiling, CI/CD DevSecOps. For auditing and hardening.
4. **The Brain (AI, Data, & Orchestration):** Prompting, RAG, MCP, Multi-agent. For AI capability integration.
5. **The Strategist (Product, Growth, & Content):** A/B Testing, SEO, CRO, Copywriting. For go-to-market and iteration.

## 4. New CLI Capabilities
To support the Agentic OS vision, new core CLI commands will be introduced:

### `agentkit sync`
*   **Purpose:** Automatically aligns the agent's installed skills with the project's actual tech stack.
*   **Mechanism:** Scans `package.json`, `Cargo.toml`, or directory structures (e.g., detecting `src/app` for Next.js) to recommend and download the precise tools required from the Meta-Bundles.

### `agentkit doctor --fix`
*   **Purpose:** Self-healing configuration management.
*   **Mechanism:** Diagnoses broken paths, conflicts between agent rules (e.g., overlapping `.cursorrules`), and outdated skills, applying automatic fixes.

### `agentkit registry` (Phase 2)
*   **Purpose:** Enabling team collaboration.
*   **Mechanism:** Allows developers to `publish` custom, team-specific skills and `update` them similar to npm packages.

## 5. New AI Workflows (Slash Commands)
New proactive workflows will be added to the library:

*   `/audit-ready`: Pre-commit/push guard checking for security, performance, and test coverage.
*   `/adapt`: Scans recent errors/test failures and locally patches or creates new SOPs to prevent recurrence.
*   `/document-system`: Automatically generates Architecture Decision Records (ADRs) based on codebase analysis.

## 6. Implementation Strategy
1. **Phase 1: Re-architecture & Taxonomy.** Update `skills_index.json` and `bundles.json` to reflect the 5 Meta-Bundles. Update the `list` and `install` commands to support this new structure.
2. **Phase 2: Core Intelligence.** Implement `agentkit sync` (scanning logic) and `agentkit doctor --fix` (repair logic).
3. **Phase 3: Workflows.** Author and distribute the `/audit-ready`, `/adapt`, and `/document-system` markdown skills.

## 7. Trade-offs & Considerations
*   **Breaking Changes:** Existing users accustomed to `agentkit install full-stack` will need to adapt to the new bundle names (e.g., `agentkit install builder`). Aliases or a deprecation warning period will be required.
*   **Complexity:** Building an accurate `sync` scanner requires robust heuristics to avoid false positives (e.g., detecting a devDependency vs. a core architectural choice).

## 8. Success Criteria
*   The 315+ skills are cleanly categorized into the 5 Meta-Bundles without circular dependencies.
*   `agentkit sync` correctly identifies the tech stack of a standard React/Node project and installs appropriate skills.
*   `agentkit doctor --fix` can successfully repair a deliberately corrupted `.agent/skills` folder.