# Agentic OS Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the core infrastructure for Agentic OS, including the 5 capability-based Meta-Bundles and the initial intelligent CLI commands (`sync` and `doctor --fix`).

**Architecture:** 
1. Re-categorize the skill library into 5 Meta-Bundles (Foundation, Builder, Guardian, Brain, Strategist).
2. Enhance the `doctor` command with a `--fix` flag for self-healing configurations.
3. Implement a new `sync` command that scans project metadata to recommend and install relevant skills.

**Tech Stack:** Node.js, Commander.js, fs-extra, chalk.

---

### Task 1: Meta-Bundle Migration

**Files:**
- Modify: `lib/bundles.json`
- Modify: `templates/skills/skills_index.json` (partial update for categories)

- [ ] **Step 1: Define the 5 Meta-Bundles in `lib/bundles.json`**

```json
{
  "foundation": {
    "title": "🟢 The Foundation",
    "description": "Architecture, Standards, & Documentation. Clean Code, Git Workflows, and ADRs.",
    "skills": ["clean-code", "git-pushing", "documentation-templates", "architecture", "plan-writing"]
  },
  "builder": {
    "title": "🔵 The Builder",
    "description": "Frontend, Backend, & Infrastructure. React, Node.js, API Patterns, Docker, and Cloud.",
    "skills": ["react-patterns", "backend-dev-guidelines", "api-patterns", "docker-expert", "database-design"]
  },
  "guardian": {
    "title": "🔴 The Guardian",
    "description": "Security, Quality, & Scalability. OWASP, Profiling, and CI/CD DevSecOps.",
    "skills": ["api-security-best-practices", "performance-profiling", "lint-and-validate", "systematic-debugging", "test-driven-development"]
  },
  "brain": {
    "title": "🟣 The Brain",
    "description": "AI, Data, & Orchestration. Prompting, RAG, MCP, and Multi-agent systems.",
    "skills": ["prompt-engineering", "ai-agents-architect", "rag-implementation", "mcp-builder", "analytics-tracking"]
  },
  "strategist": {
    "title": "🟠 The Strategist",
    "description": "Product, Growth, & Content. A/B Testing, SEO, CRO, and Copywriting.",
    "skills": ["copywriting", "seo-fundamentals", "ab-test-setup", "launch-strategy", "product-manager-toolkit"]
  }
}
```

- [ ] **Step 2: Update `templates/skills/skills_index.json` categories**

Update the `category` field for the first 10 skills in the index as a migration proof-of-concept.
- `2d-games`, `3d-games`, `3d-web-experience` -> `builder`
- `ab-test-setup` -> `strategist`
- `active-directory-attacks` -> `guardian`
- `address-github-comments` -> `foundation`
- `affiliate-marketing` -> `strategist`
- `agent-evaluation` -> `brain`
- `agent-manager-skill` -> `brain`

- [ ] **Step 3: Verify the changes**

Run: `node bin/agentkit.js list`
Expected: Should show the 5 new bundles.

- [ ] **Step 4: Commit**

```bash
git add lib/bundles.json templates/skills/skills_index.json
git commit -m "feat: migrate to 5 Meta-Bundles architecture"
```

---

### Task 2: `doctor --fix` Self-Healing

**Files:**
- Modify: `lib/commands/doctor.js`

- [ ] **Step 1: Add `--fix` option handling to `doctor` command logic**

```javascript
module.exports = async function doctor(options = {}) {
    const shouldFix = options.fix || false;
    const projectRoot = process.cwd();
    // ... existing logic ...
```

- [ ] **Step 2: Implement repair logic for missing directories and config**

```javascript
    // Check 1: Config file exists
    if (hasConfig) {
        checks.push({ status: '✔', message: 'Config file exists', color: 'green' });
    } else {
        if (shouldFix) {
            console.log(chalk.yellow('🔧 Fixing: Creating default .agent/agentkit.json...'));
            await fs.ensureDir(path.join(projectRoot, '.agent'));
            await fs.writeJson(path.join(projectRoot, '.agent/agentkit.json'), { agent: 'antigravity', persona: 'foundation' }, { spaces: 2 });
            checks.push({ status: '✔', message: 'Config file created', color: 'green' });
            hasConfig = true;
        } else {
            checks.push({ status: '✘', message: 'No config file found', color: 'red' });
            allPassed = false;
        }
    }

    // Check 2: Skills directory exists
    if (skillsDir) {
        checks.push({ status: '✔', message: 'Skills directory exists', color: 'green' });
    } else {
        if (shouldFix) {
            console.log(chalk.yellow('🔧 Fixing: Creating .agent/skills directory...'));
            await fs.ensureDir(path.join(projectRoot, '.agent/skills'));
            checks.push({ status: '✔', message: 'Skills directory created', color: 'green' });
            skillsDir = '.agent/skills';
        } else {
            checks.push({ status: '✘', message: 'Skills directory not found', color: 'red' });
            allPassed = false;
        }
    }
```

- [ ] **Step 3: Update `bin/agentkit.js` to pass the `fix` option**

```javascript
program
    .command('doctor')
    .description('Check AgentKit health and diagnose issues')
    .option('--fix', 'Automatically repair configuration issues')
    .action(async (options) => {
        await doctorCommand(options);
    });
```

- [ ] **Step 4: Verify with a failing scenario**

1. Delete `.agent` folder.
2. Run `node bin/agentkit.js doctor --fix`.
3. Verify `.agent/agentkit.json` and `.agent/skills/` are created.

- [ ] **Step 5: Commit**

```bash
git add lib/commands/doctor.js bin/agentkit.js
git commit -m "feat: add --fix capability to doctor command"
```

---

### Task 3: `sync` Command Implementation

**Files:**
- Create: `lib/commands/sync.js`
- Modify: `bin/agentkit.js`

- [ ] **Step 1: Create `lib/commands/sync.js` with scanning logic**

```javascript
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const install = require('./install');

module.exports = async function sync() {
    console.log(chalk.cyan('\n🔄 AgentKit Project Sync\n'));
    const projectRoot = process.cwd();
    const recommendedSkills = new Set(['foundation']); // Always recommend foundation

    // 1. Scan package.json
    if (await fs.pathExists(path.join(projectRoot, 'package.json'))) {
        const pkg = await fs.readJson(path.join(projectRoot, 'package.json'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        
        if (deps.react || deps.next) recommendedSkills.add('builder');
        if (deps.typescript) recommendedSkills.add('builder');
    }

    // 2. Scan directory structure
    if (await fs.pathExists(path.join(projectRoot, '.git'))) recommendedSkills.add('foundation');
    if (await fs.pathExists(path.join(projectRoot, 'docker-compose.yml')) || await fs.pathExists(path.join(projectRoot, 'Dockerfile'))) {
        recommendedSkills.add('builder');
    }

    console.log(chalk.white(`Detected Tech Stack. Recommending bundles: ${Array.from(recommendedSkills).join(', ')}`));

    for (const bundle of recommendedSkills) {
        await install(null, { pack: bundle });
    }

    console.log(chalk.green('\n✔ Sync complete! Your agent is now project-aware.\n'));
};
```

- [ ] **Step 2: Register `sync` in `bin/agentkit.js`**

```javascript
const syncCommand = require('../lib/commands/sync');

program
    .command('sync')
    .description('Sync skills with the current project tech stack')
    .action(async () => {
        await syncCommand();
    });
```

- [ ] **Step 3: Verify the command**

Run: `node bin/agentkit.js sync`
Expected: Should detect `package.json` and install `builder` bundle.

- [ ] **Step 4: Commit**

```bash
git add lib/commands/sync.js bin/agentkit.js
git commit -m "feat: add sync command for project-aware skill installation"
```
