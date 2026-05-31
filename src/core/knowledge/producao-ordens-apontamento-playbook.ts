/**
 * Playbook produção — OP, apontamento e operações (BusinessDomain producao).
 *
 * Fontes Sankhya Ajuda:
 * - https://ajuda.sankhya.com.br/hc/pt-br/articles/360044599554-Lançamento-de-uma-Ordem-de-Produção-OP
 * - https://ajuda.sankhya.com.br/hc/pt-br/articles/360045118973-Apontamento-de-Produção
 * - https://ajuda.sankhya.com.br/hc/pt-br/articles/360045118953-Planejamento-de-Produção-e-Compra
 */
export const PRODUCAO_ORDENS_APONTAMENTO_PLAYBOOK = `## Produção — Ordens de Produção (OP) e Apontamento (Sankhya OM)

### Quando aplicar
- Pedidos sobre **produção**, **manufatura**, **OP**, **ordem de produção**, **apontamento**, **processo produtivo**, **PA**, **matéria-prima**, **estrutura de produção**, **planta**, **lote**, **TPRORD**, **centro de trabalho**.

### Módulo e telas (orientação)
| Tela | Caminho | Finalidade |
|------|---------|------------|
| Ordens de Produção | Produção > Rotinas > Ordens de Produção | Lançamento e gestão de OPs |
| Operações de Produção | Produção > Rotinas > Operações de Produção | Apontamento + CQ + gerenciamento atividade |
| Ponto de Apontamento | Produção > Rotinas > Ponto de Apontamento | Apontamento simplificado (desktop) |
| Planejamento PCP | Produção > Planejamento de Produção e Compras | Previsão, lead time, requisição MP |
| Estrutura de Produção | Produção > Cadastros > Estrutura de Produção | Fórmulas/BOM e etapas |

### Fluxo OP (lançamento manual)
1. **Nova OP** em modo grade — permissão Produção > Ordens de Produção > Incluir.
2. Informar **Produto acabado (PA)**, **demanda**, **planta**, **tipo de ordem**, **processo produtivo**.
3. **Incluir OP** — grade exibe sequência, planta, proc. produtivo, PA, tamanho lote, quantidade.
4. **Configurações de estoque** — reservas/consumo conforme parametrização.
5. Produção conjunta: botão **Incluir OP** com tipo Produção Conjunta ou Ordem Produção.

### Apontamento (Ponto de Apontamento / Operações)
- Tabelas típicas (confirmar dicionário): **TPRORD** (OP), **TPRIPROC** (processo/atividades), **TPRAPA** (PA), **TPRAMP** (materiais), **TPRASP** (subproduto), **TPRARW** (recursos CT), **TPREIATV** (execução atividade).
- Aba **Itens**: quantidade PA produzida, MP consumida, subprodutos gerados.
- Apontamento gera movimentação (**Mov. A** / estoque) — validar TOP e atualização estoque no ambiente.
- CQ (controle qualidade): preferir **Operações de Produção** — Ponto de Apontamento não cobre CQ.

### Fluxo QueryModel (obrigatório)
1. \`build_query_model\` **antes** de \`query_data\` no mesmo turno.
2. Consulta por **OP/NROOP/sequência**: base **TPRORD** + joins **TPRIPROC**, **TGFPRO** (PA).
3. Apontamentos / consumo MP: investigar **TPRAMP**, **TPRAPA** + **TGFITE**/**TGFEST** com \`describe_table\`.
4. Planejamento PCP: produtos selecionados, lead time, margem segurança — cruzar **TGFEST** (estoque) + demanda.
5. Sempre \`describe_table\` antes de afirmar colunas **TPR***.

### Entidades principais
- **TPRORD** — cabeçalho ordem de produção
- **TPRIPROC** / **TPRIATV** — processo e atividades (confirmar versão)
- **TPRAPA**, **TPRAMP**, **TPRARW** — apontamentos PA, MP, recursos
- **TGFPRO** — produto (PA e MP)
- **TGFEST** — saldo estoque MP/PA
- **TGFITE** / **TGFCAB** — quando OP gera documento/movimento comercial vinculado

### Agregados
- Produção por planta/produto/período: dimensões + \`SUM(QTDPRODUZIDA)\` ou métrica confirmada no dicionário
- OP única: listagem de atividades/apontamentos — sem GROUP BY obrigatório

### Proibido
- \`query_data\` com SQL inventado sem \`build_query_model\` no turno.
- Assumir colunas **TPR*** sem \`describe_table\`.
- Confundir **planejamento PCP** com **OP liberada/apontada** sem evidência no banco.`;