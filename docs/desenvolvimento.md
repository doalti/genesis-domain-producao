# Desenvolvimento

Guia para manter o pacote `@genesis/domain-producao`.

## Pré-requisitos

- Node.js 18+
- npm
- Acesso ao repositório privado `doalti/genesis-domain-producao`

## Setup

```bash
git clone git@github.com:doalti/genesis-domain-producao.git
cd genesis-domain-producao
npm install   # executa prepare → build
```

## Scripts

| Comando | Ação |
|---------|------|
| `npm test` | Vitest — contrato, knowledge e query hints |
| `npm run build` | TypeScript → `dist/` |
| `npm run prepare` | Build automático no `npm install` |
| `npm run publish:github -- "mensagem"` | Build + testes (duplo) + commit + push — ver `publish-github.mdc` |

## Estrutura do projeto (GAS)

```
genesis-domain-producao/
├── docs/
├── scripts/publish-github.sh
├── src/
│   ├── contracts/
│   ├── core/
│   │   ├── knowledge/
│   │   └── query-hints/
│   ├── adapters/
│   ├── index.ts
│   └── index.test.ts
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### Dependências entre camadas

```
contracts → core → adapters
```

- `core` importa tipos de `contracts`
- `index.ts` re-exporta + `default export` `ProducaoDomain` para bootstrap Platform
- Consumidor também pode montar `DomainPlugin` a partir de `knowledge` e `queryHints`

## Testes

Cobertura atual (`src/index.test.ts`):

- Montagem de `DomainPlugin` pelo consumidor
- Knowledge contém `TGFEST` e `Gerência do WMS`
- NUNOTA/pedido → `TGFITE`
- Resumo agregado → `SUM(QTDNEG)`
- Consulta logística genérica produz hints

```bash
npm test
```

## Build

- Target: ES2022, módulos NodeNext
- Imports internos usam sufixo `.js` (requerido pelo Node ESM)
- Testes excluídos do build

## Publicar alterações

Quando pedir **publique** / **publicar**, seguir `.cursor/rules/publish-github.mdc`:

```bash
npm run publish:github -- "fix: motivo da alteração"
```

Fluxo: build → testes → corrigir até verde → build → testes → commit → push `main`.

**Padronização:**

- **Não** fazer bump de `"version"` no `package.json` para publicar.
- Consumidor usa `"@genesis/domain-producao": "github:doalti/genesis-domain-producao"` — **sem** `#main`.
- **Proibido:** `npm publish` no npmjs.com.

Detalhes: [Distribuição e consumo](./distribuicao.md).

## Regras de contribuição

1. **Prefixo em funções** — `genesis-domain-producao-` (recursos) ou `genesisDomainProducao` (TypeScript)
2. **Apenas domínio producao** — sem código de platform, capabilities ou outros domínios
3. **Sem dependências de runtime** — preferir zero dependência de `@genesis/copilot-*`
4. **Citar tabelas Sankhya reais; `describe_table` antes de afirmar colunas WMS**
5. **GAS** — tipos em `contracts/`, regra em `core/`, barrel sem lógica extra
6. **Testes** — adicionar casos quando alterar heurísticas de query hints
7. **Documentação** — atualizar `docs/` quando mudar API ou comportamento

## Troubleshooting

| Problema | Solução |
|----------|---------|
| `Cannot find module './core/...'` | Usar sufixo `.js` nos imports internos |
| Build falha após clone | `npm run build` manualmente |
| Consumidor não resolve tipos | Verificar que `dist/index.d.ts` existe (prepare rodou) |
| Consumidor não vê mudanças | `npm update @genesis/domain-producao` + `sync:functions-vendors` na Platform |
| Referência npm com `#main` | **Proibido** — usar `github:doalti/genesis-domain-producao` |
## Playground local

```bash
npm run dev:playground:build
```

- LLM: `PLAYGROUND_GEMINI_API_KEY` ou `GOOGLE_API_KEY`
- Porta: `PLAYGROUND_PORT` (opcional)
- UI: `dev/playground/public/`
