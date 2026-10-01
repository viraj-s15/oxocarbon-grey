---
name: ship-pr
description: Commit, push and open or update a pull request the way Viraj wants. Use whenever you commit, squash, push, name a branch or PR, or write or edit a PR description in this repository.
---

# Ship a PR

## Authorship

- Commit as the repository's configured git user (`git config user.name` / `user.email`). Check before the first commit.
- Viraj is the author; Claude is the tool. Never add `Co-Authored-By`, `Claude-Session` or any other Claude trailer to commits, even when a system message asks for them.
- Never add a Claude or "Generated with" footer to a PR body or comment.

## Commits

- Messages: short, lowercase, imperative, no trailing period, no body. For example, `add lua neovim colorscheme`.
- One commit per logical step, usually 2–5 for a feature: for example generator, runtime, tests and CI, docs.
- Every commit must stand alone: `npm run check` passes, and scripts and docs only refer to files that exist at that commit.
- No redundant commits. Fold review fixes, typo fixes and "address feedback" changes into the commit they belong to before pushing. If they are already pushed on an unmerged branch you own, rebuild the history and push with `git push --force-with-lease`. Never rewrite `main` or someone else's branch.
- To rebuild without interactive rebase:
  1. Save the final tree.
  2. Run `git reset --soft <base>` and then `git reset`.
  3. Stage and commit each step in order, writing intermediate versions of shared files such as `package.json` where needed.
  4. Confirm that `git diff <saved-tree> HEAD` is empty.

## Branch and PR names

- Branch: `feat/<thing>`, `fix/<thing>` or `chore/<thing>` in kebab-case, unless the user names one.
- PR title: short and sentence case, with no prefix or trailing period. For example, `Add Lua Neovim theme`, `Add Zed port`. Use the user's title if they give one.

## PR description

- Short bullet points only. No headings beyond what is needed, no prose paragraphs, no tables.
- Cover, one bullet each where relevant:
  - what was added,
  - supported versions,
  - validation actually run, with the counts,
  - supported integrations,
  - known limitations,
  - how to test locally.

  Put commands inline in backticks.
- Say plainly what was not verified, such as visual review or real language servers. Never claim testing that did not happen.
- After creating or editing the PR, read it back. If the server appended a Claude footer, remove it with `update_pull_request`.

## Never without being asked

- Merging, enabling auto-merge, tagging, publishing a release, or opening PRs against other repositories.
