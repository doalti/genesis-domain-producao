# Query hints

## Funções

| Função | Entrada | Saída |
|--------|---------|-------|
| `genesisDomainProducaoMapMessageToQueryHints` | `message: string` | `ProducaoQueryMappingHint \| null` |
| `genesisDomainProducaoFormatQueryHintsForPrompt` | `ProducaoQueryMappingHint` | `string` (markdown) |

## Termos que ativam o mapeamento

`logística`, `wms`, `expedição`, `separação`, `picking`, `pulmão`, `estoque`, `ordem de carga`, `formação de carga`, `reabastecimento`, `inventário`, `endereço`, `armazenagem`, `transportadora`, `corte de pedido`, `gerência wms`, `recebimento wms`, `transferência wms`

## Lógica de decisão

| Cenário | `baseTable` | `suggestedJoins` |
|---------|-------------|------------------|
| NUNOTA/pedido informado | `TGFITE` | `TGFCAB`, `TGFEST` |
| Estoque / CODPROD | `TGFEST` | `TGFPRO` |
| Resumo agregado | `TGFCAB` | `TGFITE`, `TGFEST` |
| Consulta logística genérica | `TGFCAB` | `TGFITE`, `TGFEST` |

## Métricas agregadas

`SUM(QTDNEG)`, `COUNT(DISTINCT NUNOTA)`
