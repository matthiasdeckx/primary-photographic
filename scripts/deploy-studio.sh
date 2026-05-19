#!/usr/bin/env bash
# Sanity CLI (via @inquirer/core) requires Node 22+ for `node:util` `styleText`.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

node_meets_sanity_cli() {
  node -e 'const m=+process.versions.node.split(".")[0]; process.exit(m>=22?0:1)' 2>/dev/null
}

if ! node_meets_sanity_cli; then
  NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  if [[ -s "$NVM_DIR/nvm.sh" ]]; then
    # shellcheck disable=SC1090
    source "$NVM_DIR/nvm.sh"
    if [[ -f .nvmrc ]]; then
      nvm install 2>/dev/null || true
      nvm use 2>/dev/null || true
    else
      nvm install 22 2>/dev/null || true
      nvm use 22 2>/dev/null || true
    fi
  fi
fi

if ! node_meets_sanity_cli; then
  echo "Sanity CLI needs Node.js 22+ (you have $(node -v 2>/dev/null || echo unknown))." >&2
  echo "Fix: nvm install 22 && nvm use   (this repo has a .nvmrc with 22)" >&2
  exit 1
fi

export SANITY_STUDIO_BASE_PATH=/
exec npx sanity deploy -y "$@"
