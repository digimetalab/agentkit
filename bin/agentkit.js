#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const boxen = require('boxen');
const { version } = require('../package.json');

const program = new Command();

// Import commands
const wizardCommand = require('../lib/commands/wizard');
const listCommand = require('../lib/commands/list');
const statusCommand = require('../lib/commands/status');
const doctorCommand = require('../lib/commands/doctor');
const installCommand = require('../lib/commands/install');
const searchCommand = require('../lib/commands/search');
const syncCommand = require('../lib/commands/sync');
const platformCommand = require('../lib/commands/platform');
const workflowCommand = require('../lib/commands/workflow');

// Shared banner function - ONLY ONE ASCII ART
const showBanner = (includeLinks = false) => {
    // Clear screen
    process.stdout.write('\x1Bc');

    // Single ASCII art - Banner font (large and readable)
    const banner = `
     █████╗  ██████╗ ███████╗███╗   ██╗████████╗██╗  ██╗██╗████████╗
    ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██║ ██╔╝██║╚══██╔══╝
    ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   █████╔╝ ██║   ██║   
    ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ██╔═██╗ ██║   ██║   
    ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ██║  ██╗██║   ██║   
    ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═╝   ╚═╝   
`;
    console.log(chalk.cyan(banner));

    // Info box
    let content =
        chalk.bold.cyan('🤖 @cgyudistira/agentkit') + '\n' +
        chalk.white('The Ultimate AI Skills Manager') + '\n\n' +
        chalk.dim(`Version: v${version}`) + '\n' +
        chalk.dim('Author: @cgyudistira') + '\n' +
        chalk.dim('Skills: 315+ | Bundles: 5') + '\n' +
        chalk.dim('License: MIT');

    if (includeLinks) {
        content += '\n\n' +
            chalk.cyan('GitHub: ') + chalk.white('github.com/cgyudistira/agentkit') + '\n' +
            chalk.cyan('NPM: ') + chalk.white('npmjs.com/package/@cgyudistira/agentkit');
    }

    console.log(boxen(content, {
        padding: 1,
        margin: { top: 0, bottom: 1, left: 5, right: 5 },
        borderStyle: 'round',
        borderColor: 'cyan',
        align: 'center'
    }));

    if (includeLinks) {
        console.log(chalk.dim('     ────────────────────────────────────────────────────────'));
        console.log(chalk.cyan('                        📦 Supported Agents:'));
        console.log(chalk.white('         Antigravity • Cursor • Windsurf • Claude Code'));
        console.log(chalk.white('         Gemini CLI • Codex CLI • OpenCode • TRAE'));
        console.log(chalk.dim('     ────────────────────────────────────────────────────────'));
        console.log('');
    }
};

program
    .name('agentkit')
    .description('AI Skills Manager for Code Agents')
    .version(version);

// Default: show banner + wizard
program
    .action(async () => {
        showBanner(false);
        await new Promise(r => setTimeout(r, 1000));
        await wizardCommand();
    });

// About command
program
    .command('about')
    .description('Show AgentKit info and credits')
    .action(() => {
        showBanner(true);
    });

program
    .command('list')
    .description('List available skill bundles')
    .option('-s, --skills', 'List all individual skills')
    .action(async (options) => {
        await listCommand(options);
    });

program
    .command('status')
    .description('Show current AgentKit setup status')
    .action(async () => {
        await statusCommand();
    });

program
    .command('doctor')
    .description('Check AgentKit health and diagnose issues')
    .option('--fix', 'Automatically repair issues')
    .action(async (options) => {
        await doctorCommand(options);
    });

program
    .command('install [skill]')
    .description('Install a skill or skill bundle')
    .option('--pack <bundle>', 'Install a bundle (full-stack, security-expert, etc)')
    .option('--all', 'Install all skills (315+)')
    .option('--out <path>', 'Output directory', './.agent/skills')
    .action(async (skill, options) => {
        await installCommand(skill, options);
    });

program
    .command('search <query>')
    .description('Search for skills by keyword')
    .action(async (query) => {
        await searchCommand(query);
    });

program
    .command('sync')
    .description('Automatically install bundles based on project stack')
    .option('--out <path>', 'Output directory', './.agent/skills')
    .action(async (options) => {
        await syncCommand(options);
    });

const platform = program
    .command('platform')
    .description('Manage agent platform configurations');

platform
    .command('list')
    .description('List supported platforms and detection status')
    .action(async () => {
        await platformCommand.list();
    });

platform
    .command('install <name>')
    .description('Initialize configuration for a specific platform')
    .action(async (name) => {
        await platformCommand.install(name);
    });

platform
    .command('sync')
    .description('Sync all detected platforms')
    .action(async () => {
        await platformCommand.sync();
    });

const workflow = program
    .command('workflow')
    .description('Manage skill workflow proxies');

workflow
    .command('proxy')
    .description('Generate platform-specific proxy files for all installed skills')
    .action(async (options) => {
        await workflowCommand.proxy(options);
    });

program.parse(process.argv);
