# Contrato e API

## `DomainPlugin`

```typescript
import type { DomainPlugin } from "@genesis/domain-producao/contracts";
import { knowledge, queryHints } from "@genesis/domain-producao";

const ProducaoDomain: DomainPlugin = {
  id: "producao",
  name: "Producao",
  version: "1.0.0",
  knowledge,
  queryHints,
};
```

## Exports principais

| Export | Descrição |
|--------|-----------|
| `PRODUCAO_DOMAIN_KNOWLEDGE` | String markdown consolidada |
| `PRODUCAO_WMS_EXPEDICAO_PLAYBOOK` | Playbook expedição isolado |
| `SANKHYA_PRODUCAO_PCP_PROTOCOL` | Protocolo gerência WMS isolado |
| `genesisDomainProducaoMapMessageToQueryHints` | NL → hints |
| `genesisDomainProducaoFormatQueryHintsForPrompt` | hints → markdown |
| `knowledge` | `[PRODUCAO_DOMAIN_KNOWLEDGE]` |
| `queryHints` | Array com as duas funções acima |

## `ProducaoQueryMappingHint`

```typescript
type ProducaoQueryMappingHint = {
  baseTable: string;
  suggestedJoins: string[];
  suggestedDimensions: string[];
  suggestedMetrics: string[];
  semanticNotes: string[];
};
```

## Subpaths

- `@genesis/domain-producao`
- `@genesis/domain-producao/contracts`
