export type { DomainPlugin, ProducaoQueryMappingHint } from "./contracts/index.js";

export {
  PRODUCAO_DOMAIN_KNOWLEDGE,
  PRODUCAO_ORDENS_APONTAMENTO_PLAYBOOK,
  SANKHYA_PRODUCAO_PCP_PROTOCOL,
  genesisDomainProducaoFormatQueryHintsForPrompt,
  genesisDomainProducaoMapMessageToQueryHints,
  knowledge,
  queryHints,
  mapProducaoMessageToBusinessSpecification,
} from "./core/index.js";

import { knowledge, queryHints } from "./core/index.js";

import { mapProducaoMessageToBusinessSpecification } from "./core/business-specification.js";

const ProducaoDomain = {
  id: "producao",
  name: "Producao",
  version: "1.0.0",
  knowledge,
  queryHints,
  businessSpecification: [mapProducaoMessageToBusinessSpecification] as const,
};

export default ProducaoDomain;
