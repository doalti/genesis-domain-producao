/**
 * Protocolo PCP — planejamento produção e compras.
 * Fonte: https://ajuda.sankhya.com.br/hc/pt-br/articles/360045118953-Planejamento-de-Produção-e-Compra
 */
export const SANKHYA_PRODUCAO_PCP_PROTOCOL = `## Planejamento de Produção e Compra (PCP)

### Objetivo
Projetar produção e compras de matérias-primas com base em previsão de vendas, estoque mínimo e **lead time** do processo produtivo.

### Parametrização (Preferências Empresa — aba PCP)
- **Margem de segurança PCP** — usada no cálculo Planejamento/Janela.
- **Meta padrão PCP** — filtro por código de meta (simulação).
- **Lead time** — dias totais do processo (insumos até PA em estoque).

### Fluxo operacional
1. Selecionar produtos na tela **Planejamento de Produção e Compras**.
2. Botão **Planejamento** — gera planejamento de compras + requisição MP (portal compras).
3. Reprocessar grade após planejamento gerado.
4. Demanda → **Estrutura de Produção** (fórmula principal) + pedido modelo na estrutura.

### Integração com estoque e compras
- Estoque mínimo + previsão mensal alimentam necessidade de produção/compra.
- MP crítica: rastrear requisição gerada e saldo **TGFEST**.
- OPs geradas em telas subsequentes (fora desta tela) — não confundir planejamento com OP apontada.

### QueryModel
- Análise PCP agregada: **TGFPRO** + **TGFEST** + dimensão tempo; confirmar tabelas de planejamento no dicionário.
- Para OP já existente: base **TPRORD**, não PCP.`;