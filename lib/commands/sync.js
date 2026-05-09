const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const installCommand = require('./install');

module.exports = async function sync(options) {
    console.log(chalk.cyan('\n🔄 Synchronizing AgentKit with project stack...'));
    
    const recommendations = ['foundation'];
    const projectDir = process.cwd();
    
    // 1. Scan package.json
    const packagePath = path.join(projectDir, 'package.json');
    if (await fs.pathExists(packagePath)) {
        try {
            const pkg = await fs.readJson(packagePath);
            const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
            
            if (deps['react'] || deps['next'] || deps['typescript']) {
                if (!recommendations.includes('builder')) {
                    recommendations.push('builder');
                }
            }
        } catch (error) {
            console.log(chalk.dim('  Could not read package.json, skipping dependency scan.'));
        }
    }
    
    // 2. Scan directory structure
    const dockerComposePath = path.join(projectDir, 'docker-compose.yml');
    const dockerfilePath = path.join(projectDir, 'Dockerfile');
    
    if (await fs.pathExists(dockerComposePath) || await fs.pathExists(dockerfilePath)) {
        if (!recommendations.includes('builder')) {
            recommendations.push('builder');
        }
    }
    
    console.log(chalk.white(`Detected stack recommendations: ${recommendations.map(r => chalk.bold.green(r)).join(', ')}\n`));
    
    for (const bundle of recommendations) {
        await installCommand(null, { ...options, pack: bundle });
    }
    
    console.log(chalk.green('✅ Sync complete! Project is now skill-ready.\n'));
};
