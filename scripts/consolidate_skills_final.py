import json, os, shutil
from pathlib import Path

# Load index
with open('templates/skills/skills_index.json', 'r', encoding='utf-8') as f:
    index = json.load(f)

# Final Strategist Consolidation
strategist_final = {
    'professional-writing': ['copywriting', 'doc-coauthoring', 'technical-writing', 'case-study-writing', 'ghostwriting', 'copy-editing'],
    'creative-studio-sop': ['canvas-design', 'motion-graphics', 'algorithmic-art', 'product-photography', 'design-systems', 'brand-identity'],
    'content-creation-mastery': ['content-creator', 'content-repurposing', 'viral-content', 'viral-generator-builder', 'newsletter-growth']
}

# Final Brain Consolidation
brain_final = {
    'python-ai-mastery': ['python-patterns', 'pandas-mastery', 'deep-learning-pytorch', 'mlops-practices', 'experiment-tracking', 'data-science-mastery'],
    'ai-business-solutions': ['ai-product', 'ai-wrapper-product', 'ai-safety-alignment', 'agent-evaluation']
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

for master, subs in strategist_final.items():
    merge_cluster(master, subs, 'strategist')

for master, subs in brain_final.items():
    merge_cluster(master, subs, 'brain')

with open('templates/skills/skills_index.json', 'w', encoding='utf-8') as f:
    json.dump(index, f, indent=2)

print("Final surgical consolidation complete.")
