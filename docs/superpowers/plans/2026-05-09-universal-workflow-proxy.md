# Universal Workflow Proxy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Universal Workflow Proxy (UWP) and Multi-Platform Adapter (MPA) to enable native `/slash-commands` for 211 skills across 18+ AI coding agents.

**Architecture:**
1.  **Registry Pattern:** Centralize platform-specific metadata (paths, extensions, templates) in a new `lib/platforms.js` module.
2.  **Proxy Generation:** A dedicated engine in `lib/commands/workflow.js` that iterates through installed skills and writes lightweight trigger files to platform-specific directories.
3.  **Command Expansion:** Refactor the CLI to support nested command structures: `agentkit platform <cmd>` and `agentkit workflow <cmd>`.
4.  **Integrated Flow:** Update the existing `sync` command to perform stack detection, bundle installation, and platform-aware proxy generation in one pass.

**Tech Stack:** Node.js, Commander.js, fs-extra, chalk.

---

### Task 1: Platform Registry (MPA)

**Files:**
- Create: `lib/platforms.js`

- [ ] **Step 1: Create `lib/platforms.js` with the ultimate platform list**

```javascript
module.exports = {
    cursor: {
        name: 'Cursor',
        configDir: '.cursor/rules',
        extension: '.mdc',
        template: (id, name) => `---
description: Native trigger for ${name} SOP
globs: **/*
---
# /${id}
> Proxy for AgentKit Skill: ${name}
Load instructions from ../../.agent/skills/${id}/SKILL.md and execute the SOP.`
    },
    windsurf: {
        name: 'Windsurf',
        configDir: '.agent/rules',
        extension: '.md',
        template: (id, name) => `# /${id}\nProxy for AgentKit Skill: ${name}\nRefer to ../skills/${id}/SKILL.md for SOP.`
    },
    claude: {
        name: 'Claude Code',
        configDir: '.claude/skills',
        extension: '.md',
        template: (id, name) => `# /${id}\nProxy for AgentKit Skill: ${name}\nSource: ../../.agent/skills/${id}/SKILL.md`
    },
    antigravity: {
        name: 'Antigravity',
        configDir: '.agent/workflows',
        extension: '.md',
        template: (id, name) => `# /${id}\nProxy for AgentKit Skill: ${name}\nSource: ../skills/${id}/SKILL.md`
    },
    // Simplified entries for expansion
    copilot: { name: 'GitHub Copilot', configDir: '.github', filename: 'copilot-instructions.md' },
    continue: { name: 'Continue.dev', configDir: '.continue', filename: 'config.json' },
    trae: { name: 'Trae', configDir: '.trae/rules', extension: '.md' }
};
```

- [ ] **Step 2: Commit**

```bash
git add lib/platforms.js
git commit -m "feat: add multi-platform adapter registry"
```

---

### Task 2: Platform CLI Commands

**Files:**
- Create: `lib/commands/platform.js`
- Modify: `bin/agentkit.js`

- [ ] **Step 1: Implement `platform.js` with install/list logic**

```javascript
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const platforms = require('../platforms');

module.exports = {
    list: async () => {
        console.log(chalk.cyan('\n🔌 Supported Platforms:\n'));
        for (const [id, p] of Object.entries(platforms)) {
            const exists = await fs.pathExists(path.join(process.cwd(), p.configDir));
            const status = exists ? chalk.green('Detected') : chalk.dim('Not Found');
            console.log(`- ${chalk.bold(p.name)} (${id}): ${status}`);
        }
    },
    install: async (name) => {
        const p = platforms[name];
        if (!p) return console.log(chalk.red(`Error: Platform ${name} not supported.`));
        await fs.ensureDir(path.join(process.cwd(), p.configDir));
        console.log(chalk.green(`✔ Initialized ${p.name} at ${p.configDir}`));
    }
};
```

- [ ] **Step 2: Register `platform` commands in `bin/agentkit.js`**

```javascript
const platformCmd = require('../lib/commands/platform');

const platformGroup = program.command('platform').description('Manage AI agent platform integrations');

platformGroup.command('list').action(platformCmd.list);
platformGroup.command('install <name>').action(platformCmd.install);
platformGroup.command('sync').action(async () => {
    console.log(chalk.yellow('Syncing platforms...'));
    for (const name of Object.keys(require('../lib/platforms'))) {
        const p = require('../lib/platforms')[name];
        if (await fs.pathExists(path.join(process.cwd(), p.configDir))) {
            await platformCmd.install(name);
        }
    }
});
```

- [ ] **Step 3: Commit**

```bash
git add lib/commands/platform.js bin/agentkit.js
git commit -m "feat: add platform management commands"
```

---

### Task 3: Workflow Proxy Engine

**Files:**
- Create: `lib/commands/workflow.js`
- Modify: `bin/agentkit.js`

- [ ] **Step 1: Implement proxy generation logic in `workflow.js`**

```javascript
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const platforms = require('../platforms');
const { getSkillsIndex } = require('../utils');

module.exports = {
    proxy: async (options = {}) => {
        console.log(chalk.cyan('\n🔄 Generating Workflow Proxies...'));
        const projectRoot = process.cwd();
        const installedSkills = await fs.readdir(path.join(projectRoot, '.agent/skills')).catch(() => []);
        
        if (installedSkills.length === 0) {
            return console.log(chalk.yellow('No skills found in .agent/skills. Run sync first.'));
        }

        const index = await getSkillsIndex();

        for (const platformId in platforms) {
            const p = platforms[platformId];
            const platformPath = path.join(projectRoot, p.configDir);
            
            if (await fs.pathExists(platformPath)) {
                console.log(chalk.white(`- Target: ${p.name}...`));
                for (const skillId of installedSkills) {
                    const skillData = index.find(s => s.id === skillId);
                    if (skillData && p.template && p.extension) {
                        const content = p.template(skillId, skillData.name);
                        await fs.writeFile(path.join(platformPath, `${skillId}${p.extension}`), content);
                    }
                }
            }
        }
        console.log(chalk.green('✔ Proxies generated successfully.'));
    }
};
```

- [ ] **Step 2: Register `workflow` command in `bin/agentkit.js`**

```javascript
const workflowCmd = require('../lib/commands/workflow');

const workflowGroup = program.command('workflow').description('Manage agentic workflows');
workflowGroup.command('proxy').action(workflowCmd.proxy);
```

- [ ] **Step 3: Commit**

```bash
git add lib/commands/workflow.js bin/agentkit.js
git commit -m "feat: add workflow proxy generation engine"
```

---

### Task 4: Ultimate Sync Integration

**Files:**
- Modify: `lib/commands/sync.js`

- [ ] **Step 1: Update `sync.js` to include platform setup and proxying**

```javascript
const platformCmd = require('./platform');
const workflowCmd = require('./workflow');

// Inside module.exports = async function sync() { ...
    // ... after bundle installation ...
    
    // 3. Platform Sync
    console.log(chalk.yellow('\n🔌 Syncing Platform Configs...'));
    const platformIds = Object.keys(require('../platforms'));
    for (const name of platformIds) {
        const p = require('../platforms')[name];
        if (await fs.pathExists(path.join(projectRoot, p.configDir))) {
            await platformCmd.install(name);
        }
    }

    // 4. Generate Proxies
    await workflowCmd.proxy();

    console.log(chalk.green('\n✨ Agentic OS is fully operational!\n'));
// }
```

- [ ] **Step 2: Verify the "God Command"**

1. Ensure `.cursor/` directory exists.
2. Run `node bin/agentkit.js sync`.
3. Check `.cursor/rules/` for generated `.mdc` files mapping to installed skills.

- [ ] **Step 3: Commit**

```bash
git add lib/commands/sync.js
git commit -m "feat: integrate platform and proxy generation into master sync"
```
