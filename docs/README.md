# Documentação — `@genesis/domain-producao`

Pacote privado do **BusinessDomain producao** para o ecossistema Genesis. Contém conhecimento de negócio e funções que traduzem pedidos em linguagem natural para hints de QueryModel.

Estrutura **GAS**: `contracts/` (API pública), `core/` (regra de negócio), `adapters/` (integrações futuras).

## Índice

| Documento | Conteúdo |
|-----------|----------|
| [Visão geral](./visao-geral.md) | O que é o pacote, responsabilidades e limites |
| [Contrato e API](./contrato-api.md) | `DomainPlugin`, exports e tipos |
| [Knowledge](./knowledge.md) | Base de conhecimento |
| [Query hints](./query-hints.md) | Mapeamento NL → QueryModel |
| [Desenvolvimento](./desenvolvimento.md) | Setup, testes, build e publicação |
| [Distribuição](./distribuicao.md) | Consumo via GitHub + lockfile |

## Início rápido

```typescript
import type { DomainPlugin } from "@genesis/domain-producao/contracts";
import {
  PRODUCAO_DOMAIN_KNOWLEDGE,
  knowledge,
  queryHints,
  genesisDomainProducaoMapMessageToQueryHints,
} from "@genesis/domain-producao";
```

## Instalação (privado)

```json
"@genesis/domain-producao": "github:doalti/genesis-domain-producao"
```

Requer autenticação GitHub com acesso ao repositório `doalti/genesis-domain-producao`.

## Regra de escopo

Este repositório contém **exclusivamente** conteúdo do domínio producao. Integração (registry, bootstrap, validators SQL, runtime) é responsabilidade de cada projeto consumidor.

## Publicar

Pedido **publique** → regra Cursor `publish-github.mdc` + `npm run publish:github -- "mensagem"`.
