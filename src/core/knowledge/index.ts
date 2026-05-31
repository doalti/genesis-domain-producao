/**
 * BusinessDomain producao — Manufatura / Módulo Produção (One Source of Truth).
 */
import { PRODUCAO_ORDENS_APONTAMENTO_PLAYBOOK } from "./producao-ordens-apontamento-playbook.js";
import { SANKHYA_PRODUCAO_PCP_PROTOCOL } from "./sankhya-producao-pcp-protocol.js";

export { PRODUCAO_ORDENS_APONTAMENTO_PLAYBOOK } from "./producao-ordens-apontamento-playbook.js";
export { SANKHYA_PRODUCAO_PCP_PROTOCOL } from "./sankhya-producao-pcp-protocol.js";

export const PRODUCAO_DOMAIN_KNOWLEDGE = `
## BusinessDomain: producao

Autoridade única para **Produção / Manufatura** (OP, apontamento, PCP, estrutura, planta).

${PRODUCAO_ORDENS_APONTAMENTO_PLAYBOOK.trim()}

${SANKHYA_PRODUCAO_PCP_PROTOCOL.trim()}

### Integração produção × estoque × comercial
- Consumo MP / entrada PA movimenta **TGFEST**; pode haver vínculo com **TGFCAB**/**TGFITE** conforme TOP.
- PCP gera requisição de compra — rastrear no módulo **Comercial/Compras** quando pedido citar MP.
- \`search_sankhya_docs\` (\`source: "ajuda"\`) para procedimentos — citar URLs devolvidas.

### QueryModel (domínio produz; capability query só compila)
- **OP/NROOP** específica → base **TPRORD** + joins processo/atividade
- **Apontamento** → tabelas **TPRAPA**/**TPRAMP** (confirmar dicionário)
- **PCP / necessidade produção** → **TGFPRO** + **TGFEST** + planejamento
- **Produção agregada** → dimensões (planta, PA, período) + métricas de quantidade produzida
`.trim();

export const knowledge = [PRODUCAO_DOMAIN_KNOWLEDGE];
