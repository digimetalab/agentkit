const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const installCommand = require('./install');

const BUNDLE_HEURISTICS = {
    builder: {
        dependencies: ['react', 'next', 'typescript'],
        files: ['Dockerfile', 'docker-compose.yml']
    },
    guardian: {
        dependencies: ['jest', 'mocha', 'vitest', 'cypress', 'playwright', 'snyk', 'husky']
    },
    brain: {
        dependencies: ['openai', 'langchain', 'anthropic', 'pinecone', 'milvus', 'pytorch']
    },
    strategist: {
        dependencies: ['google-analytics', 'segment', 'mixpanel', 'hubspot']
    }
};

module.exports = async function sync(options) {
    console.log(chalk.cyan('\n🔄 Synchronizing AgentKit with project stack...'));
    
    const recommendations = new Set(['foundation']);
    const projectDir = process.cwd();
    
    // 1. Scan package.json
    const packagePath = path.join(projectDir, 'package.json');
    let deps = {};
    
    if (await fs.pathExists(packagePath)) {
        try {
            const pkg = await fs.readJson(packagePath);
            deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
        } catch (error) {
            console.log(chalk.yellow('  ⚠️ Warning: Could not read package.json, skipping dependency scan.'));
        }
    }

    // 2. Scan requirements.txt (Python)
    const reqPath = path.join(projectDir, 'requirements.txt');
    if (await fs.pathExists(reqPath)) {
        try {
            const content = await fs.readFile(reqPath, 'utf8');
            const lines = content.split('\n');
            
            // Heuristics for Python
            if (lines.some(l => /openai|langchain|anthropic|torch|tensorflow|numpy|pandas/i.test(l))) {
                recommendations.add('brain');
            }
            if (lines.some(l => /flask|django|fastapi|boto3/i.test(l))) {
                recommendations.add('builder');
            }
        } catch (error) {
            console.log(chalk.yellow('  ⚠️ Warning: Could not read requirements.txt, skipping.'));
        }
    }

    if (!await fs.pathExists(packagePath) && !await fs.pathExists(reqPath)) {
        console.log(chalk.dim('  ℹ️ No package.json or requirements.txt found. Using default foundation.\n'));
    }

    // 3. Run heuristic mapping
    for (const [bundle, rules] of Object.entries(BUNDLE_HEURISTICS)) {
        // Check dependencies
        if (rules.dependencies && rules.dependencies.some(d => deps[d])) {
            recommendations.add(bundle);
        }
        
        // Check files
        if (rules.files) {
            for (const file of rules.files) {
                if (await fs.pathExists(path.join(projectDir, file))) {
                    recommendations.add(bundle);
                    break;
                }
            }
        }
    }
    
    const finalRecs = Array.from(recommendations);
    console.log(chalk.white(`Detected stack recommendations: ${finalRecs.map(r => chalk.bold.green(r)).join(', ')}\n`));
    
    for (const bundle of finalRecs) {
        try {
            await installCommand(null, { ...options, pack: bundle });
        } catch (error) {
            console.error(chalk.red(`  ❌ Failed to install bundle: ${bundle}`));
            console.log(chalk.dim(error.message));
        }
    }
    
    console.log(chalk.green('✅ Sync complete! Project is now skill-ready.\n'));
};
