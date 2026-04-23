#!/usr/bin/env bash
#
# Install the forge-react skill into Claude Code / Cursor / Codex.
#
#   curl -fsSL https://forge-ui.github.io/forge/install-skill.sh | bash
#
# Overrides (environment variables):
#   CLAUDE_SKILLS_DIR   where to install (default: ~/.claude/skills)
#   FORGE_BRANCH        git branch to pull from (default: main)
#   FORGE_REPO          source repo (default: forge-ui/forge)
#

set -euo pipefail

REPO="${FORGE_REPO:-forge-ui/forge}"
BRANCH="${FORGE_BRANCH:-main}"
SKILL_NAME="forge-react"
SKILL_SUBDIR="skills/${SKILL_NAME}"
SKILLS_DIR="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
DEST="${SKILLS_DIR}/${SKILL_NAME}"

bold() { printf "\033[1m%s\033[0m\n" "$*"; }
info() { printf "• %s\n" "$*"; }
ok()   { printf "\033[32m✓\033[0m %s\n" "$*"; }
err()  { printf "\033[31m✗\033[0m %s\n" "$*" >&2; }

need() {
  command -v "$1" >/dev/null 2>&1 || { err "Missing dependency: $1"; exit 1; }
}

need git

bold "Installing ${SKILL_NAME} skill from ${REPO}@${BRANCH}"
info "target: ${DEST}"

if [[ -d "$DEST" ]]; then
  info "existing install detected — replacing"
  rm -rf "$DEST"
fi

mkdir -p "$SKILLS_DIR"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Sparse checkout: only pull the skill subtree, not the whole docs site.
git clone --quiet \
  --filter=blob:none \
  --sparse \
  --depth 1 \
  --branch "$BRANCH" \
  "https://github.com/${REPO}.git" \
  "$TMP/repo"

(
  cd "$TMP/repo"
  git sparse-checkout set --no-cone "$SKILL_SUBDIR" >/dev/null
)

if [[ ! -d "$TMP/repo/$SKILL_SUBDIR" ]]; then
  err "Skill directory not found in repo: $SKILL_SUBDIR"
  exit 1
fi

cp -R "$TMP/repo/$SKILL_SUBDIR" "$DEST"

ok "Installed to ${DEST}"
echo
echo "Next steps:"
echo "  1. Restart Claude Code / Cursor / Codex so the agent picks up the skill."
echo "  2. Try: 'Use the forge-react skill to build a dashboard page.'"
echo "  3. Re-run this installer any time to update to the latest version."
