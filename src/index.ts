export type { DomainPlugin, ProducaoQueryMappingHint } from "./contracts/index.js";

export {
  PRODUCAO_DOMAIN_KNOWLEDGE,
  PRODUCAO_ORDENS_APONTAMENTO_PLAYBOOK,
  SANKHYA_PRODUCAO_PCP_PROTOCOL,
  genesisDomainProducaoFormatQueryHintsForPrompt,
  genesisDomainProducaoMapMessageToQueryHints,
  knowledge,
  queryHints,
} from "./core/index.js";

import { knowledge, queryHints } from "./core/index.js";

const ProducaoDomain = {
  id: "producao",
  name: "Producao",
  version: "1.0.0",
  knowledge,
  queryHints,
};

export default ProducaoDomain;
