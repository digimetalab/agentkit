const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const platforms = require('../platforms');
const { getSkillsIndex } = require('../utils');

/**
 * Generate platform-specific proxy files for all installed skills
 * @param {Object} options 
 */
async function proxy(options = {}) {
    const projectRoot = process.cwd();
    const skillsDir = path.join(projectRoot, '.agent', 'skills');

    // Identify the project root and locate the .agent/skills directory
    if (!(await fs.pathExists(skillsDir))) {
        console.warn(chalk.yellow('⚠️  No skills directory found at .agent/skills. Install skills first.'));
        return;
    }

    // List all installed skill IDs (subfolders in .agent/skills)
    let installedSkillIds = [];
    try {
        const entries = await fs.readdir(skillsDir, { withFileTypes: true });
        installedSkillIds = entries
            .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
            .map(dirent => dirent.name);
    } catch (err) {
        console.error(chalk.red(`❌ Error reading skills directory: ${err.message}`));
        return;
    }

    // If no skills are found, log a warning and exit
    if (installedSkillIds.length === 0) {
        console.warn(chalk.yellow('⚠️  No installed skills found in .agent/skills.'));
        return;
    }

    const skillsIndex = await getSkillsIndex();
    
    console.log(chalk.cyan(`\n🔄 Generating workflow proxies for ${installedSkillIds.length} skills...\n`));

    // Helper for backup
    const backupFile = async (filePath) => {
        if (await fs.pathExists(filePath)) {
            await fs.copy(filePath, `${filePath}.bak`, { overwrite: true });
        }
    };

    // For each platform in lib/platforms.js
    for (const [platformId, platform] of Object.entries(platforms)) {
        try {
            const platformConfigDir = path.join(projectRoot, platform.configDir);
            
            // Check if its configDir exists in the project
            if (await fs.pathExists(platformConfigDir)) {
                console.log(chalk.dim(`  Configuring ${platform.name}...`));
                
                const platformContents = [];
                const writePromises = [];
                
                // Iterate through the installed skills
                for (const skillId of installedSkillIds) {
                    // Look up the skill metadata from the global index (handle missing metadata gracefully)
                    const skillMetadata = skillsIndex.find(s => s.id === skillId);
                    const skillName = skillMetadata ? skillMetadata.name : skillId;
                    
                    // Use the platform's template function to generate content
                    const content = platform.template(skillId, skillName);
                    
                    if (platform.extension) {
                        // Write the proxy file to the platform's configDir using the platform's extension
                        const fileName = `${skillId}${platform.extension}`;
                        const filePath = path.join(platformConfigDir, fileName);
                        
                        writePromises.push((async () => {
                            await backupFile(filePath);
                            await fs.writeFile(filePath, content);
                        })());
                    } else if (platform.filename) {
                        platformContents.push(content);
                    }
                }

                if (writePromises.length > 0) {
                    await Promise.all(writePromises);
                }
                
                // Handle filename-based platforms (aggregation to avoid overwriting)
                if (platform.filename && platformContents.length > 0) {
                    const filePath = path.join(platformConfigDir, platform.filename);
                    await backupFile(filePath);

                    if (platform.filename.endsWith('.json')) {
                        // Intelligent JSON merging (e.g., Continue.dev)
                        let config = {};
                        if (await fs.pathExists(filePath)) {
                            try {
                                config = await fs.readJson(filePath);
                            } catch (e) {
                                console.warn(chalk.yellow(`  ⚠️  Failed to parse existing ${platform.filename}, starting fresh.`));
                            }
                        }

                        // For Continue.dev, we inject into slashCommands
                        if (platformId === 'continue') {
                            if (!config.slashCommands) config.slashCommands = [];
                            
                            // Remove existing AgentKit skills from slashCommands to avoid duplicates
                            config.slashCommands = config.slashCommands.filter(cmd => 
                                !installedSkillIds.includes(cmd.name)
                            );

                            // Add new ones
                            for (const content of platformContents) {
                                try {
                                    config.slashCommands.push(JSON.parse(content));
                                } catch (e) {
                                    // Should not happen as template returns valid JSON string
                                }
                            }
                        } else {
                            // Generic JSON merge or overwrite if unknown structure
                            config.agentkit_skills = platformContents.map(c => {
                                try { return JSON.parse(c); } catch(e) { return c; }
                            });
                        }
                        await fs.writeJson(filePath, config, { spaces: 2 });
                    } else if (platform.filename.endsWith('.md') || platform.filename.endsWith('.txt') || platform.filename.startsWith('.aider') || platform.filename.endsWith('.yml')) {
                        // Intelligent Markdown/Text/YAML appending
                        const isYaml = platform.filename.endsWith('.yml') || platform.filename.startsWith('.aider');
                        const startTag = isYaml ? '# agentkit-start' : '<!-- agentkit-start -->';
                        const endTag = isYaml ? '# agentkit-end' : '<!-- agentkit-end -->';
                        const header = isYaml ? `\n\n# 🤖 AgentKit Skills\n${startTag}\n` : `\n\n### 🤖 AgentKit Skills\n${startTag}\n`;
                        const footer = `\n${endTag}`;
                        const newSkillsContent = platformContents.join('\n');
                        
                        let existingContent = '';
                        if (await fs.pathExists(filePath)) {
                            existingContent = await fs.readFile(filePath, 'utf8');
                        }

                        // Replace existing AgentKit section if it exists
                        const sectionRegex = new RegExp(`${startTag}[\\s\\S]*${endTag}`);
                        if (sectionRegex.test(existingContent)) {
                            existingContent = existingContent.replace(sectionRegex, `${startTag}\n${newSkillsContent}\n${endTag}`);
                        } else {
                            existingContent += `${header}${newSkillsContent}${footer}`;
                        }
                        
                        await fs.writeFile(filePath, existingContent.trim() + '\n');
                    } else {
                        // Fallback for other files
                        const finalContent = platformContents.join('\n');
                        await fs.writeFile(filePath, finalContent);
                    }
                }
                
                console.log(chalk.green(`  ✅ ${platform.name} proxies generated.`));
            }
        } catch (platformErr) {
            console.error(chalk.red(`  ❌ Error configuring ${platform.name}: ${platformErr.message}`));
        }
    }
    
    console.log(chalk.cyan('\n✨ Workflow proxy generation complete!\n'));
}

module.exports = {
    proxy
};
