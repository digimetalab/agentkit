import json, os, shutil
from pathlib import Path

# Load index
with open('templates/skills/skills_index.json', 'r', encoding='utf-8') as f:
    index = json.load(f)

# Define clusters for Builder
builder_clusters = {
    'devops-deployment': ['docker-expert', 'vercel-deployment', 'deployment-procedures', 'gcp-cloud-run', 'aws-serverless'],
    'database-mastery': ['postgres-best-practices', 'prisma-expert', 'prisma-orm', 'neon-postgres', 'database-design'],
    'frontend-frameworks': ['vue-mastery', 'svelte-development', 'astro-sites', 'htmx-development'],
    'senior-architect-sop': ['senior-architect', 'senior-fullstack', 'software-architecture', 'microservices-design']
}

# Define clusters for Guardian
guardian_clusters = {
    'red-team-mastery': ['red-team-operations', 'red-team-tactics', 'red-team-tools', 'metasploit-framework', 'shodan-reconnaissance', 'ethical-hacking-methodology'],
    'quality-assurance': ['test-driven-development', 'tdd-workflow', 'testing-patterns', 'systematic-debugging', 'lint-and-validate'],
    'infrastructure-security': ['container-security', 'cloud-penetration-testing', 'aws-penetration-testing', 'network-101', 'wireshark-analysis'],
    'privilege-escalation': ['linux-privilege-escalation', 'windows-privilege-escalation', 'privilege-escalation-methods']
}

def merge_cluster(master_id, sub_ids, category):
    global index
    print(f"Merging {sub_ids} into {master_id}...")
    display_name = master_id.replace("-", " ").title()
    content = f"---\nname: {master_id}\ndescription: Comprehensive Power SOP for {display_name}. Combined from multiple specialized skills.\n---\n\n# {display_name} Master SOP\n\n"
    
    for sid in sub_ids:
        spath = next((s['path'] for s in index if s['id'] == sid), None)
        if spath:
            skill_file = Path(spath) / 'SKILL.md'
            if skill_file.exists():
                text = skill_file.read_text(encoding='utf-8')
                if text.startswith('---'):
                    parts = text.split('---', 2)
                    if len(parts) > 2:
                        text = parts[2]
                content += f"\n\n--- SECTION: {sid.upper()} ---\n" + text
    
    master_path = Path('templates/skills') / master_id
    master_path.mkdir(exist_ok=True)
    (master_path / 'SKILL.md').write_text(content, encoding='utf-8')
    
    # Update index
    index = [s for s in index if s['id'] not in sub_ids and s['id'] != master_id]
    index.append({
        'id': master_id,
        'path': f"templates/skills/{master_id}",
        'category': category,
        'name': display_name,
        'description': f"Master SOP for {display_name}."
    })
    
    # Delete sub folders
    for sid in sub_ids:
        p = Path('templates/skills') / sid
        if p.exists() and p.is_dir() and sid != master_id:
            shutil.rmtree(p)

# Run Builder
for master, subs in builder_clusters.items():
    merge_cluster(master, subs, 'builder')

# Run Guardian
for master, subs in guardian_clusters.items():
    merge_cluster(master, subs, 'guardian')

# Final Index Save
with open('templates/skills/skills_index.json', 'w', encoding='utf-8') as f:
    json.dump(index, f, indent=2)

print("Builder & Guardian consolidation complete.")
