import type { GenesisDomainManifest } from "@genesis/plugin-contracts";

export const manifest: GenesisDomainManifest = {
  id: "domain-producao",
  type: "domain",
  version: "1.0.0",
  bootstrapPriority: 200,
  root: "producao",
  aliases: { production: "producao", manufactory: "producao", manufatura: "producao", industrial: "producao" },
};
