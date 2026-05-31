/**
 * Mapeia pedidos de produção/manufatura em NL para hints de QueryModel.
 */
import type { ProducaoQueryMappingHint } from "../../contracts/producao-query-mapping-hint.js";

export function genesisDomainProducaoFormatQueryHintsForPrompt(
  hints: ProducaoQueryMappingHint,
): string {
  const lines = [
    "### QueryModel hints (BusinessDomain producao — usar em `build_query_model`)",
    `- baseTable: **${hints.baseTable}**`,
    ...(hints.suggestedJoins.length > 0
      ? [`- suggestedJoins: ${hints.suggestedJoins.join(", ")}`]
      : []),
    `- suggestedDimensions: ${hints.suggestedDimensions.join(", ") || "(nenhuma)"}`,
    `- suggestedMetrics: ${hints.suggestedMetrics.join(", ") || "(listagem — sem agregação obrigatória)"}`,
    ...hints.semanticNotes.map((n) => `- ${n}`),
  ];
  return lines.join("\n");
}

function genesisDomainProducaoExtractOp(message: string): string | null {
  const m =
    message.match(/\b(?:nro?op|op|ordem\s+(?:de\s+)?produ[cç][aã]o)\s*[:=]?\s*(\d+)/i)
    ?? message.match(/\bop\s+(?:n?[°º]?\s*)?(\d+)/i);
  return m?.[1] ?? null;
}

function genesisDomainProducaoExtractCodprod(message: string): string | null {
  const m = message.match(/\bcodprod\s*[:=]?\s*(\d+)/i);
  return m?.[1] ?? null;
}

export function genesisDomainProducaoMapMessageToQueryHints(
  message: string,
): ProducaoQueryMappingHint | null {
  const msg = message.toLowerCase();
  if (
    !/\b(produ[cç][aã]o|manufatura|industrial|op\b|ordem\s+de\s+produ|apontamento|pcp|estrutura\s+de\s+produ|processo\s+produtivo|planta|lote|tprord|centro\s+de\s+trabalho|mat[eé]ria[- ]prima|produto\s+acabado|\bpa\b)\b/.test(
      msg,
    )
  ) {
    return null;
  }

  const nroop = genesisDomainProducaoExtractOp(message);
  const codprod = genesisDomainProducaoExtractCodprod(message);
  const isAggregate = /\b(por\s+\w+|resumo|total|quantidade|qtd)\b/.test(msg) && !nroop;
  const isPcp = /\b(pcp|planejamento|lead\s*time|previs[aã]o|necessidade)\b/.test(msg);
  const isApontamento = /\b(apontamento|operac[oõ]es\s+de\s+produ|ponto\s+de\s+apontamento|consumo\s+mp|pa\s+produzido)\b/.test(msg);

  let baseTable = "TPRORD";
  let suggestedJoins = ["TPRIPROC", "TGFPRO"];
  let suggestedDimensions: string[] = [];
  let suggestedMetrics: string[] = [];
  const semanticNotes: string[] = [];

  if (nroop) {
    baseTable = "TPRORD";
    suggestedJoins = ["TPRIPROC", "TGFPRO"];
    semanticNotes.push(`Filtrar OP/NROOP = ${nroop} quando coluna existir — confirmar com describe_table.`);
  } else if (isApontamento) {
    baseTable = "TPRAPA";
    suggestedJoins = ["TPRAMP", "TPRORD", "TGFPRO"];
    semanticNotes.push("Apontamento: confirmar tabelas TPRAPA/TPRAMP/TPRARW no dicionário.");
  } else if (isPcp) {
    baseTable = "TGFPRO";
    suggestedJoins = ["TGFEST"];
    suggestedDimensions = ["CODPROD"];
    suggestedMetrics = ["SUM(QTDEST)"];
    semanticNotes.push("PCP: cruzar estoque TGFEST com demanda/planejamento — confirmar tabelas PCP.");
  } else if (isAggregate) {
    baseTable = "TPRORD";
    suggestedJoins = ["TGFPRO"];
    suggestedDimensions = ["CODPROD", "CODPLANTA"];
    suggestedMetrics = ["COUNT(DISTINCT NROOP)", "SUM(QTDPRODUZIDA)"];
    semanticNotes.push("Métricas de quantidade: confirmar nomes reais (QTDPRODUZIDA etc.) via describe_table.");
  } else if (codprod) {
    baseTable = "TPRORD";
    suggestedJoins = ["TGFPRO"];
    semanticNotes.push(`Filtrar CODPROD (PA) = ${codprod}.`);
  }

  return {
    baseTable,
    suggestedJoins,
    suggestedDimensions,
    suggestedMetrics,
    semanticNotes,
  };
}
