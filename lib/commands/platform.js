const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const platforms = require('../platforms');

/**
 * List all supported platforms and their detection status
 */
async function list() {
    const projectRoot = process.cwd();
    
    console.log(chalk.cyan('\n📱 AgentKit Platform Support\n'));
    console.log(chalk.dim('──────────────────────────────────────────────────'));
    console.log(`${chalk.bold('ID'.padEnd(15))} ${chalk.bold('Platform'.padEnd(25))} ${chalk.bold('Status')}`);
    console.log(chalk.dim('──────────────────────────────────────────────────'));

    for (const [id, platform] of Object.entries(platforms)) {
        const configPath = path.join(projectRoot, platform.configDir);
        const exists = await fs.pathExists(configPath);
        
        const status = exists 
            ? chalk.green('Detected') 
            : chalk.dim('Not Found');
            
        console.log(`${id.padEnd(15)} ${platform.name.padEnd(25)} ${status}`);
    }
    
    console.log(chalk.dim('──────────────────────────────────────────────────\n'));
    console.log(`Use ${chalk.cyan('agentkit platform install <id>')} to enable a platform.`);
    console.log(`Use ${chalk.cyan('agentkit platform sync')} to initialize all detected platforms.\n`);
}

/**
 * Install/initialize a specific platform
 * @param {string} name Platform ID
 * @param {Object} options Configuration options
 * @param {boolean} options.silent Suppress extra formatting
 */
async function install(name, options = {}) {
    const { silent = false } = options;
    const platform = platforms[name];
    
    if (!platform) {
        console.log(chalk.red(`${silent ? '' : '\n'}❌ Error: Unknown platform '${name}'`));
        console.log(`Available platforms: ${Object.keys(platforms).join(', ')}${silent ? '' : '\n'}`);
        return;
    }

    const projectRoot = process.cwd();
    const configPath = path.join(projectRoot, platform.configDir);

    try {
        if (!(await fs.pathExists(configPath))) {
            await fs.ensureDir(configPath);
            const prefix = silent ? '' : '\n✅ ';
            console.log(chalk.green(`${prefix}Initialized ${platform.name} configuration at ${platform.configDir}`));
        } else {
            const prefix = silent ? '' : '\nℹ️  ';
            console.log(chalk.yellow(`${prefix}${platform.name} configuration already exists at ${platform.configDir}`));
        }
    } catch (error) {
        const prefix = silent ? '' : '\n❌ ';
        console.log(chalk.red(`${prefix}Error initializing ${platform.name}: ${error.message}${silent ? '' : '\n'}`));
    }
}

/**
 * Sync all detected platforms
 */
async function sync() {
    const projectRoot = process.cwd();
    let syncCount = 0;

    console.log(chalk.cyan('\n🔄 Syncing Detected Platforms\n'));

    for (const [id, platform] of Object.entries(platforms)) {
        const configPath = path.join(projectRoot, platform.configDir);
        
        // If configDir is detected, ensure it's fully initialized
        // Note: For some platforms configDir might be '.' (e.g. aider), 
        // we might want to be careful or just skip them if they are always 'detected'
        if (platform.configDir !== '.' && await fs.pathExists(configPath)) {
            await install(id, { silent: true });
            syncCount++;
        }
    }

    if (syncCount === 0) {
        console.log(chalk.yellow('No existing platform configurations detected to sync.'));
        console.log(`Try ${chalk.cyan('agentkit platform list')} to see available options.\n`);
    } else {
        console.log(chalk.cyan(`\n✨ Finished syncing ${syncCount} platforms.\n`));
    }
}

module.exports = {
    list,
    install,
    sync
};
