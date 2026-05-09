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
Source: ../../.agent/skills/${id}/SKILL.md`
    },
    windsurf: {
        name: 'Windsurf',
        configDir: '.agent/rules',
        extension: '.md',
        template: (id, name) => `# /${id}\n> Proxy for AgentKit Skill: ${name}\nSource: ../skills/${id}/SKILL.md`
    },
    claude: {
        name: 'Claude Code',
        configDir: '.claude/skills',
        extension: '.md',
        template: (id, name) => `# /${id}\n> Proxy for AgentKit Skill: ${name}\nSource: ../../.agent/skills/${id}/SKILL.md`
    },
    antigravity: {
        name: 'Antigravity',
        configDir: '.agent/workflows',
        extension: '.md',
        template: (id, name) => `# /${id}\n> Proxy for AgentKit Skill: ${name}\nSource: ../skills/${id}/SKILL.md`
    },
    gemini: {
        name: 'Gemini CLI',
        configDir: '.gemini/skills',
        extension: '.md',
        template: (id, name) => `# /${id}\n> Proxy for AgentKit Skill: ${name}\nSource: ../../.agent/skills/${id}/SKILL.md`
    },
    copilot: { 
        name: 'GitHub Copilot', 
        configDir: '.github', 
        filename: 'copilot-instructions.md',
        template: (id, name) => `- /${id}: > Proxy for AgentKit Skill: ${name}\n  Source: ../.agent/skills/${id}/SKILL.md`
    },
    continue: { 
        name: 'Continue.dev', 
        configDir: '.continue', 
        filename: 'config.json',
        template: (id, name) => JSON.stringify({ name: id, context: [{ provider: 'file', options: { path: '.agent/skills/' + id + '/SKILL.md' } }] })
    },
    trae: { 
        name: 'Trae', 
        configDir: '.trae/rules', 
        extension: '.md',
        template: (id, name) => `# /${id}\n> Proxy for AgentKit Skill: ${name}\nSource: ../../.agent/skills/${id}/SKILL.md`
    },
    aider: { 
        name: 'Aider', 
        configDir: '.', 
        filename: '.aider.conf.yml',
        template: (id, name) => "- .agent/skills/" + id + "/SKILL.md"
    },
    cline: { 
        name: 'Cline', 
        configDir: '.cline/rules', 
        extension: '.md',
        template: (id, name) => `# /${id}\n> Proxy for AgentKit Skill: ${name}\nSource: ../../.agent/skills/${id}/SKILL.md`
    },
    codex: {
        name: 'Codex CLI',
        configDir: '.codex/skills',
        extension: '.md',
        template: (id, name) => `# /${id}\n> Proxy for AgentKit Skill: ${name}\nSource: ../../.agent/skills/${id}/SKILL.md`
    },
    void: {
        name: 'Void',
        configDir: '.void/rules',
        extension: '.md',
        template: (id, name) => `# /${id}\n> Proxy for AgentKit Skill: ${name}\nSource: ../../.agent/skills/${id}/SKILL.md`
    },
    pearai: {
        name: 'PearAI',
        configDir: '.pearai/rules',
        extension: '.md',
        template: (id, name) => `# /${id}\n> Proxy for AgentKit Skill: ${name}\nSource: ../../.agent/skills/${id}/SKILL.md`
    },
    goose: {
        name: 'Goose',
        configDir: '.goose/skills',
        extension: '.md',
        template: (id, name) => `# /${id}\n> Proxy for AgentKit Skill: ${name}\nSource: ../../.agent/skills/${id}/SKILL.md`
    },
    cody: {
        name: 'Sourcegraph Cody', 
        configDir: '.github', 
        filename: 'cody-instructions.md',
        template: (id, name) => `- /${id}: > Proxy for AgentKit Skill: ${name}\n  Source: ../.agent/skills/${id}/SKILL.md`
    },
    tabnine: {
        name: 'Tabnine', 
        configDir: '.github', 
        filename: 'tabnine-instructions.md',
        template: (id, name) => `- /${id}: > Proxy for AgentKit Skill: ${name}\n  Source: ../.agent/skills/${id}/SKILL.md`
    },
    opencode: {
        name: 'OpenCode',
        configDir: '.opencode/rules',
        extension: '.md',
        template: (id, name) => `# /${id}\n> Proxy for AgentKit Skill: ${name}\nSource: ../../.agent/skills/${id}/SKILL.md`
    },
    idx: {
        name: 'Project IDX',
        configDir: '.idx/skills',
        extension: '.md',
        template: (id, name) => `# /${id}\n> Proxy for AgentKit Skill: ${name}\nSource: ../../.agent/skills/${id}/SKILL.md`
    },
    rooftop: {
        name: 'Rooftop',
        configDir: '.rooftop/rules',
        extension: '.md',
        template: (id, name) => `# /${id}\n> Proxy for AgentKit Skill: ${name}\nSource: ../../.agent/skills/${id}/SKILL.md`
    }
};
