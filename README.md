# @genesis/domain-producao

> **Regra absoluta:** APENAS DOMÍNIO PRODUCAO PARA TUDO QUE FOR DESENVOLVIDO NESSE PROJETO.

> **Privacidade:** repositório e pacote **privados**. Sem publicação no npm público. Acesso somente via GitHub autenticado (`doalti/genesis-domain-producao`).

Pacote npm do **BusinessDomain producao** — conhecimento e query hints para WMS, expedição, formação de carga e estoque no Sankhya OM.

Estrutura conforme **Genesis Architecture Standard (GAS)**: `contracts/`, `core/`, `adapters/`.

## Documentação

Documentação completa em **[docs/](./docs/README.md)**:

- [Visão geral](./docs/visao-geral.md) — responsabilidades e limites
- [Contrato e API](./docs/contrato-api.md) — exports, tipos e exemplos
- [Knowledge](./docs/knowledge.md) — playbooks WMS e expedição
- [Query hints](./docs/query-hints.md) — mapeamento NL → QueryModel
- [Desenvolvimento](./docs/desenvolvimento.md) — setup, testes e publicação
- [Distribuição](./docs/distribuicao.md) — consumo via GitHub + lockfile

## Início rápido

```typescript
import type { DomainPlugin } from "@genesis/domain-producao/contracts";
import {
  PRODUCAO_DOMAIN_KNOWLEDGE,
  knowledge,
  queryHints,
  genesisDomainProducaoMapMessageToQueryHints,
} from "@genesis/domain-producao";

const ProducaoDomain: DomainPlugin = {
  id: "producao",
  name: "Producao",
  version: "1.0.0",
  knowledge,
  queryHints,
};
```

```bash
npm install
npm test
npm run build
```

## Instalação no consumidor (privado)

```json
"@genesis/domain-producao": "github:doalti/genesis-domain-producao"
```

O commit instalado é fixado no `package-lock.json` do consumidor. Detalhes: [docs/distribuicao.md](./docs/distribuicao.md).

**Publicar no GitHub:** diga **publique** — build, testes, corrigir até 100% verde, commit, push (`npm run publish:github -- "mensagem"`).
