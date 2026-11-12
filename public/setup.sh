#!/usr/bin/env bash
#
# Set up Forge for coding agents: forge-skill, the read-only MCP server and (optionally) DESIGN.md.
#
#   curl -fsSL https://www.forgeui.org/setup.sh | bash
#   curl -fsSL https://www.forgeui.org/setup.sh | bash -s -- --client claude --mode both --scope project --design
#   curl -fsSL https://www.forgeui.org/setup.sh | bash -s -- --check
#
# Options:
#   --client claude|cursor|codex|all   default: every client detected on this machine
#   --mode skill|mcp|both              default: both
#   --scope user|project               user = home directory (default), project = current directory
#   --design                           project scope: download DESIGN.md and point AGENTS.md at it
#   --dry-run                          print what would change, change nothing
#   --check                            verify the current setup and exit
#

set -euo pipefail

SITE="${FORGE_SITE:-https://www.forgeui.org}"
MCP_URL="${SITE}/api/mcp"
CLIENTS=""
MODE="both"
SCOPE="user"
DESIGN=0
DRY_RUN=0
CHECK=0

bold() { printf "\033[1m%s\033[0m\n" "$*"; }
ok()   { printf "\033[32m✓\033[0m %s\n" "$*"; }
warn() { printf "\033[33m!\033[0m %s\n" "$*"; }
fail() { printf "\033[31m✗\033[0m %s\n" "$*"; }
die()  { fail "$*" >&2; exit 1; }
run()  { if [[ $DRY_RUN == 1 ]]; then printf "  [dry-run] %s\n" "$*"; else "$@"; fi; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --client) CLIENTS="${2:-}"; shift 2 ;;
    --mode) MODE="${2:-}"; shift 2 ;;
    --scope) SCOPE="${2:-}"; shift 2 ;;
    --design) DESIGN=1; shift ;;
    --dry-run) DRY_RUN=1; shift ;;
    --check) CHECK=1; shift ;;
    -h|--help) sed -n '2,20p' "$0" 2>/dev/null || true; exit 0 ;;
    *) die "Unknown option: $1" ;;
  esac
done

case "$MODE" in skill|mcp|both) ;; *) die "--mode must be skill, mcp or both" ;; esac
case "$SCOPE" in user|project) ;; *) die "--scope must be user or project" ;; esac
command -v node >/dev/null 2>&1 || die "Node.js is required"

detect_clients() {
  local found=()
  { command -v claude >/dev/null 2>&1 || [[ -d "$HOME/.claude" ]]; } && found+=(claude)
  [[ -d "$HOME/.cursor" ]] && found+=(cursor)
  { command -v codex >/dev/null 2>&1 || [[ -d "$HOME/.codex" ]]; } && found+=(codex)
  [[ ${#found[@]} -eq 0 ]] && found=(claude)
  echo "${found[*]}"
}
if [[ -z "$CLIENTS" ]]; then CLIENTS="$(detect_clients)"; elif [[ "$CLIENTS" == all ]]; then CLIENTS="claude cursor codex"; fi
CLIENTS="${CLIENTS//,/ }"
for client in $CLIENTS; do case "$client" in claude|cursor|codex) ;; *) die "Unknown client: $client" ;; esac; done

base_dir() { if [[ $SCOPE == project ]]; then pwd; else echo "$HOME"; fi; }
skills_dir() {
  case "$1" in
    claude) echo "$(base_dir)/.claude/skills" ;;
    cursor) if [[ $SCOPE == project ]]; then echo "$(base_dir)/.cursor/skills"; else echo "$HOME/.claude/skills"; fi ;;
    codex) if [[ $SCOPE == project ]]; then echo "$(base_dir)/.agents/skills"; else echo "$HOME/.codex/skills"; fi ;;
  esac
}
cursor_mcp_file() { echo "$(base_dir)/.cursor/mcp.json"; }
codex_config() { echo "$HOME/.codex/config.toml"; }

# Merge {"mcpServers":{"forge":{"url":...}}} into a JSON file without touching other servers.
merge_json_mcp() {
  local file="$1"
  run mkdir -p "$(dirname "$file")"
  if [[ $DRY_RUN == 1 ]]; then printf "  [dry-run] add mcpServers.forge to %s\n" "$file"; return; fi
  FORGE_FILE="$file" FORGE_URL="$MCP_URL" node -e '
    const fs = require("fs"); const file = process.env.FORGE_FILE;
    const config = fs.existsSync(file) && fs.readFileSync(file, "utf8").trim() ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
    config.mcpServers = { ...(config.mcpServers || {}), forge: { url: process.env.FORGE_URL } };
    fs.writeFileSync(file, JSON.stringify(config, null, 2) + "\n");'
}

setup_skill() {
  local client="$1" dir; dir="$(skills_dir "$client")"
  bold "forge-skill → ${client} (${dir})"
  if [[ $DRY_RUN == 1 ]]; then printf "  [dry-run] install forge-skill into %s\n" "$dir"; return; fi
  local installer; installer="$(mktemp)"
  curl -fsSL "${SITE}/install-skill.sh" -o "$installer"
  FORGE_SKILLS_DIR="$dir" bash "$installer" >/dev/null
  rm -f "$installer"
  ok "forge-skill installed"
}

setup_mcp() {
  local client="$1"
  bold "Forge MCP → ${client}"
  case "$client" in
    claude)
      if command -v claude >/dev/null 2>&1; then
        local scope_flag="user"; [[ $SCOPE == project ]] && scope_flag="project"
        if claude mcp get forge >/dev/null 2>&1; then ok "already configured"; return; fi
        run claude mcp add --transport http --scope "$scope_flag" forge "$MCP_URL"
      elif [[ $SCOPE == project ]]; then
        merge_json_mcp "$(base_dir)/.mcp.json"
      else
        warn "claude CLI not found; run: claude mcp add --transport http forge ${MCP_URL}"; return
      fi ;;
    cursor) merge_json_mcp "$(cursor_mcp_file)" ;;
    codex)
      local file; file="$(codex_config)"
      if [[ -f "$file" ]] && grep -q '^\[mcp_servers\.forge\]' "$file"; then ok "already configured"; return; fi
      run mkdir -p "$(dirname "$file")"
      if [[ $DRY_RUN == 1 ]]; then printf "  [dry-run] append [mcp_servers.forge] to %s\n" "$file"; else printf '\n[mcp_servers.forge]\nurl = "%s"\n' "$MCP_URL" >> "$file"; fi ;;
  esac
  [[ $DRY_RUN == 1 ]] || ok "MCP configured"
}

setup_design() {
  local root; root="$(pwd)"
  bold "DESIGN.md → ${root}"
  if [[ ! -f "$root/DESIGN.md" ]]; then run curl -fsSL "${SITE}/DESIGN.md" -o "$root/DESIGN.md"; else ok "DESIGN.md already exists, left unchanged"; fi
  local line="Follow [DESIGN.md](./DESIGN.md) for all visual and interaction decisions; build UI with @forge-ui-official/core."
  if [[ -f "$root/AGENTS.md" ]] && grep -qF "DESIGN.md" "$root/AGENTS.md"; then ok "AGENTS.md already points to DESIGN.md"; return; fi
  if [[ $DRY_RUN == 1 ]]; then printf "  [dry-run] append to AGENTS.md: %s\n" "$line"; else printf '\n%s\n' "$line" >> "$root/AGENTS.md"; ok "AGENTS.md points to DESIGN.md"; fi
}

check() {
  local problems=0 client dir
  bold "Forge setup check (${SCOPE} scope)"
  for client in $CLIENTS; do
    if [[ $MODE != mcp ]]; then
      dir="$(skills_dir "$client")/forge-skill"
      if [[ -f "$dir/SKILL.md" ]]; then ok "${client}: forge-skill at ${dir}"; else fail "${client}: forge-skill missing (${dir})"; problems=$((problems + 1)); fi
    fi
    if [[ $MODE != skill ]]; then
      case "$client" in
        claude)
          if { command -v claude >/dev/null 2>&1 && claude mcp get forge >/dev/null 2>&1; } || grep -qs '"forge"' "$(base_dir)/.mcp.json"; then ok "claude: MCP forge configured"; else fail "claude: MCP forge not configured"; problems=$((problems + 1)); fi ;;
        cursor)
          if grep -qs '"forge"' "$(cursor_mcp_file)"; then ok "cursor: MCP forge configured"; else fail "cursor: MCP forge not configured ($(cursor_mcp_file))"; problems=$((problems + 1)); fi ;;
        codex)
          if grep -qs '^\[mcp_servers\.forge\]' "$(codex_config)"; then ok "codex: MCP forge configured"; else fail "codex: MCP forge not configured ($(codex_config))"; problems=$((problems + 1)); fi ;;
      esac
    fi
  done
  if [[ $MODE != skill ]]; then
    local body='{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"forge-setup","version":"1"}}}'
    if curl -fsS -X POST "$MCP_URL" -H 'content-type: application/json' -H 'accept: application/json, text/event-stream' -d "$body" 2>/dev/null | grep -q '"serverInfo"'; then ok "MCP endpoint reachable: ${MCP_URL}"; else fail "MCP endpoint not reachable: ${MCP_URL}"; problems=$((problems + 1)); fi
  fi
  if [[ $SCOPE == project ]]; then
    if [[ -f DESIGN.md ]]; then ok "DESIGN.md present"; else warn "DESIGN.md not in project (optional: --design)"; fi
  fi
  if [[ $problems -gt 0 ]]; then fail "${problems} problem(s); re-run without --check to fix"; return 1; fi
  ok "all good"
}

if [[ $CHECK == 1 ]]; then check; exit $?; fi

bold "Setting up Forge for: ${CLIENTS} (mode ${MODE}, ${SCOPE} scope)"
for client in $CLIENTS; do
  if [[ $MODE != mcp ]]; then setup_skill "$client"; fi
  if [[ $MODE != skill ]]; then setup_mcp "$client"; fi
done
if [[ $DESIGN == 1 ]]; then
  [[ $SCOPE == project ]] || die "--design needs --scope project"
  setup_design
fi
if [[ $DRY_RUN == 1 ]]; then echo; ok "dry run finished, nothing changed"; exit 0; fi
echo
ok "Done. Restart your coding agent, then try: \"用 Forge 做一个订单列表页\"."
echo "Verify any time: curl -fsSL ${SITE}/setup.sh | bash -s -- --check${CLIENTS:+ --client ${CLIENTS// /,}}"
