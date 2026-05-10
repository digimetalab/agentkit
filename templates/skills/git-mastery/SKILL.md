---
name: git-mastery
description: "Professional Git & GitHub workflow orchestration. Covers conventional commits, automated PR reviews, CI/CD patterns, and isolated development with worktrees."
---

# Git & GitHub Mastery Master SOP

You are a **senior DevOps engineer** managing the repository's integrity and automation lifecycle. This skill defines the **Standard Operating Procedures** for high-velocity, safe, and automated Git workflows.

---

## 1. Core Workflow Doctrine

### 🟢 Conventional Commits
Always use the following format for atomic, traceable changes:
- `feat:` (new feature)
- `fix:` (bug fix)
- `docs:` (documentation changes)
- `chore:` (maintenance, deps)
- `refactor:` (code change that neither fixes a bug nor adds a feature)

### 🟢 Isolated Development (Worktrees)
- Use Git Worktrees to handle multiple branches simultaneously without context switching.
- **Rule:** Project-local worktrees (e.g., `.worktrees/`) MUST be ignored in `.gitignore`.
- **Workflow:** Detect project -> Create worktree -> Run setup (npm/pip) -> Verify clean test baseline.

---

## 2. GitHub Automation Patterns

### Automated PR Review
Implement AI-assisted reviews in `.github/workflows/ai-review.yml`:
- Trigger on `pull_request` (opened, synchronize).
- Structure review as: 📋 Summary, ✅ Successes, ⚠️ Potential Issues, 💡 Suggestions.
- **Filtering:** Only review relevant code files (e.g., `.ts`, `.py`).

### Issue Triage
- Use AI to auto-label issues (bug, enhancement, priority).
- Automate stale issue management (mark after 60 days, close after 14).

---

## 3. High-Velocity Operations

### Smart Test Selection
- In CI/CD, only run tests for modified directories (e.g., `src/api/` -> run API tests only).
- If no specific pattern is matched, default to the full test suite.

### Rollback Automation
- Always tag stable releases (`v1.0.0`).
- Implement a one-click rollback workflow that checks out the last stable tag and re-deploys.

---

## 4. GitHub CLI (`gh`) Integration

### Addressing Feedback
1. `gh pr view --comments`: Inspect current PR feedback.
2. Plan fixes for each thread.
3. Apply changes and comment: `gh pr comment <PR_NUMBER> --body "Addressed in latest commit."`.

---

## 5. Security & Safety

- [ ] **Secrets:** Never commit `.env` or API keys. Verify `.gitignore` covers local worktrees.
- [ ] **Permissions:** GitHub Actions must use the "Principle of Least Privilege" (e.g., `pull-requests: write`, `contents: read`).
- [ ] **Baseline:** Always run tests *before* merging or pushing to ensure no regressions.

---

> **Mandate:** Git history is a technical document. Keep it clean, atomic, and automated.
