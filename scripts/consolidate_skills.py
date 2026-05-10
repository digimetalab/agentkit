import json, os, shutil
from pathlib import Path

# Load index
with open('templates/skills/skills_index.json', 'r', encoding='utf-8') as f:
    index = json.load(f)

# Define clusters
strategist_clusters = {
    'conversion-optimization': ['ab-test-setup', 'form-cro', 'onboarding-cro', 'page-cro', 'paywall-upgrade-cro', 'popup-cro', 'signup-flow-cro'],
    'growth-marketing': ['content-creator', 'content-repurposing', 'marketing-ideas', 'viral-content', 'viral-generator-builder', 'newsletter-growth', 'affiliate-marketing', 'referral-program'],
    'business-strategy': ['fundraising-strategy', 'launch-strategy', 'micro-saas-launcher', 'pricing-strategy', 'product-market-fit', 'saas-metrics', 'product-manager-toolkit'],
    'game-mastery': ['game-art', 'game-audio', 'game-design', 'game-development', 'mobile-games', 'pc-games', 'web-games']
}

brain_clusters = {
    'prompt-engineering-master': ['prompt-caching', 'prompt-engineer', 'prompt-engineering', 'prompt-library'],
    'rag-expert-sop': ['rag-engineer', 'rag-implementation', 'embeddings-expert', 'llama-index-expert'],
    'data-science-mastery': ['pandas-mastery', 'time-series-analysis', 'geo-fundamentals', 'geospatial-analysis', 'mlops-practices', 'experiment-tracking'],
    'ai-agents-architect': ['agent-evaluation', 'agent-manager-skill', 'crewai', 'langgraph', 'parallel-agents', 'subagent-driven-development']
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

# Run Strategist
for master, subs in strategist_clusters.items():
    merge_cluster(master, subs, 'strategist')

# Run Brain
for master, subs in brain_clusters.items():
    merge_cluster(master, subs, 'brain')

# Final Index Save
with open('templates/skills/skills_index.json', 'w', encoding='utf-8') as f:
    json.dump(index, f, indent=2)

print("Consolidation complete.")
