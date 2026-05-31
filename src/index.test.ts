import { describe, expect, it } from "vitest";
import type { DomainPlugin } from "./contracts/index.js";
import {
  PRODUCAO_DOMAIN_KNOWLEDGE,
  genesisDomainProducaoMapMessageToQueryHints,
  knowledge,
  queryHints,
} from "./index.js";
import ProducaoDomain from "./index.js";

describe("@genesis/domain-producao", () => {
  it("exporta plugin producao", () => {
    expect(ProducaoDomain.id).toBe("producao");
    expect(ProducaoDomain.knowledge?.length).toBeGreaterThan(0);
  });

  it("knowledge inclui TPRORD e Apontamento", () => {
    expect(PRODUCAO_DOMAIN_KNOWLEDGE).toContain("TPRORD");
    expect(PRODUCAO_DOMAIN_KNOWLEDGE).toContain("Apontamento");
    expect(PRODUCAO_DOMAIN_KNOWLEDGE).toContain("Planejamento");
  });

  it("OP específica → TPRORD", () => {
    const hints = genesisDomainProducaoMapMessageToQueryHints("status da OP 12345");
    expect(hints?.baseTable).toBe("TPRORD");
  });

  it("PCP → TGFPRO", () => {
    const hints = genesisDomainProducaoMapMessageToQueryHints("planejamento PCP lead time");
    expect(hints?.baseTable).toBe("TGFPRO");
  });

  it("consulta produção genérica produz hints", () => {
    expect(genesisDomainProducaoMapMessageToQueryHints("consulta de produção")).not.toBeNull();
  });
});
