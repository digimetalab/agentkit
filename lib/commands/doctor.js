const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

module.exports = async function doctor(options = {}) {
    const projectRoot = process.cwd();

    console.log(chalk.cyan('\n🏥 AgentKit Health Check\n'));
    console.log(chalk.dim('────────────────────────────────────────'));

    let allPassed = true;
    const checks = [];

    // Check 1: Config file exists
    const configs = [
        '.agent/agentkit.json',
        '.cursorrules',
        '.claude/config.json',
        '.gemini/settings.json',
        '.codex/config.json',
        '.windsurfrules',
        '.trae/TRAE_RULES.md'
    ];

    let hasConfig = false;
    for (const config of configs) {
        if (await fs.pathExists(path.join(projectRoot, config))) {
            hasConfig = true;
            break;
        }
    }

    if (!hasConfig && options.fix) {
        console.log(chalk.yellow('🔧 Fixing: Creating default config file...'));
        const defaultConfig = {
            name: "agentkit-project",
            version: "1.0.0",
            skills: []
        };
        try {
            await fs.ensureDir(path.join(projectRoot, '.agent'));
            await fs.writeJson(path.join(projectRoot, '.agent/agentkit.json'), defaultConfig, { spaces: 2 });
            hasConfig = true;
        } catch (err) {
            console.log(chalk.red(`✖ Failed to create config: ${err.message}`));
        }
    }

    if (hasConfig) {
        checks.push({ status: '✔', message: 'Config file exists', color: 'green' });
    } else {
        checks.push({ status: '✘', message: 'No config file found', color: 'red' });
        allPassed = false;
    }

    // Check 2: Skills directory exists
    const skillsDirs = ['.agent/skills', '.cursor/skills', '.claude/skills', '.gemini/skills', '.codex/skills', '.trae/skills'];
    let skillsDir = null;
    let skillCount = 0;

    for (const dir of skillsDirs) {
        const dirPath = path.join(projectRoot, dir);
        if (await fs.pathExists(dirPath)) {
            skillsDir = dir;
            try {
                const skills = await fs.readdir(dirPath);
                skillCount = skills.filter(s => !s.startsWith('.')).length;
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    console.log(chalk.dim(`⚠ Warning: Could not read skills directory ${dir}: ${err.message}`));
                }
            }
            break;
        }
    }

    if (!skillsDir && options.fix) {
        console.log(chalk.yellow('🔧 Fixing: Creating skills directory...'));
        try {
            await fs.ensureDir(path.join(projectRoot, '.agent/skills'));
            skillsDir = '.agent/skills';
        } catch (err) {
            console.log(chalk.red(`✖ Failed to create skills directory: ${err.message}`));
        }
    }

    if (skillsDir) {
        checks.push({ status: '✔', message: 'Skills directory exists', color: 'green' });
    } else {
        checks.push({ status: '✘', message: 'Skills directory not found', color: 'red' });
        allPassed = false;
    }

    // Check 3: Skills count
    if (skillCount > 0) {
        checks.push({ status: '✔', message: `${skillCount} skills installed`, color: 'green' });
    } else {
        checks.push({ status: '⚠', message: 'No skills installed', color: 'yellow' });
    }

    // Check 4: Workflows directory
    let workflowsDir = path.join(projectRoot, '.agent/workflows'); // Default
    if (skillsDir) {
        // If we found a skills dir (e.g. .cursor/skills), check .cursor/workflows
        workflowsDir = path.join(projectRoot, path.dirname(skillsDir), 'workflows');
    }

    const workflowsExist = await fs.pathExists(workflowsDir);
    if (!workflowsExist && options.fix) {
        console.log(chalk.yellow('🔧 Fixing: Creating workflows directory...'));
        try {
            await fs.ensureDir(workflowsDir);
        } catch (err) {
            console.log(chalk.red(`✖ Failed to create workflows directory: ${err.message}`));
        }
    }

    if (await fs.pathExists(workflowsDir)) {
        checks.push({ status: '✔', message: 'Workflows directory exists', color: 'green' });
    } else {
        checks.push({ status: '⚠', message: 'Workflows directory not found', color: 'yellow' });
    }

    // Check 5: More skills available
    const totalAvailable = 315;
    if (skillCount < totalAvailable) {
        checks.push({ status: 'ℹ', message: `${totalAvailable - skillCount} more skills available`, color: 'dim' });
    }

    // Display results
    for (const check of checks) {
        console.log(chalk[check.color](`${check.status} ${check.message}`));
    }

    console.log(chalk.dim('────────────────────────────────────────'));

    if (allPassed) {
        console.log(chalk.green('\n✔ All checks passed!\n'));
    } else {
        console.log(chalk.yellow('\n⚠ Some issues found. Run "agentkit" to set up.\n'));
    }
};
