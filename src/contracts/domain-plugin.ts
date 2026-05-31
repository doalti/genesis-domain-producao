/**
 * Contrato mínimo para registro de BusinessDomain em consumidores (ex.: genesis-platform).
 */
export interface DomainPlugin {
  id: string;
  name: string;
  version: string;

  knowledge?: unknown[];
  queryHints?: unknown[];
}
