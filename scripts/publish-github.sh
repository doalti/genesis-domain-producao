#!/usr/bin/env bash
# Publica @genesis/domain-producao no GitHub privado (branch main).
# Não usa npmjs.com. Consumidor: github:doalti/genesis-domain-producao (sem #main).
#
# Fluxo: build → testes → build → testes (100% verde) → commit → push
#
# Uso:
#   npm run publish:github -- "fix: motivo da alteração"
#   PUBLISH_COMMIT_MSG="..." npm run publish:github

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PACKAGE="@genesis/domain-producao"
REPO="genesis-domain-producao"

run_build() {
  echo "[publish:github] build…"
  npm run build
  if [[ ! -f dist/index.js ]]; then
    echo "[publish:github] ERRO: dist/index.js ausente após build." >&2
    exit 1
  fi
}

run_tests() {
  echo "[publish:github] testes…"
  npm test
}

resolve_commit_message() {
  if [[ $# -gt 0 ]]; then
    printf '%s' "$*"
    return
  fi
  if [[ -n "${PUBLISH_COMMIT_MSG:-}" ]]; then
    printf '%s' "$PUBLISH_COMMIT_MSG"
    return
  fi
  printf '%s' "chore: publish $PACKAGE"
}

echo "[publish:github] ── fase 1: build + testes ──"
run_build
run_tests

echo ""
echo "[publish:github] ── fase 2: verificação final (build + testes 100% verde) ──"
run_build
run_tests

echo ""
echo "[publish:github] ── fase 3: commit + push GitHub ──"

if ! git diff --quiet || ! git diff --cached --quiet || [[ -n "$(git ls-files --others --exclude-standard)" ]]; then
  COMMIT_MSG="$(resolve_commit_message "$@")"
  echo "[publish:github] alterações locais — commit…"
  echo "  mensagem: $COMMIT_MSG"
  git add -A
  if git diff --cached --quiet; then
    echo "[publish:github] nada para commitar após git add." >&2
    git status -sb
    exit 1
  fi
  git commit -m "$COMMIT_MSG"
else
  echo "[publish:github] working tree limpo — sem commit novo."
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "main" ]]; then
  echo "[publish:github] AVISO: branch actual é '$BRANCH', não 'main'." >&2
fi

echo "[publish:github] push origin main…"
git push origin main

SHA="$(git rev-parse HEAD)"
echo ""
echo "[publish:github] OK — publicado no GitHub: $SHA"
echo "  Repo: https://github.com/doalti/$REPO"
echo ""
echo "  Platform (genesis-platform):"
echo "    \"$PACKAGE\": \"github:doalti/$REPO\""
echo "    npm update $PACKAGE"
echo "    npm run sync:functions-vendors && npm --prefix functions run build"
