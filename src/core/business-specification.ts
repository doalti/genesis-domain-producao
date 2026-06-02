import type { BusinessSpecification } from "@genesis/contracts";
import { genesisDomainProducaoMapMessageToQueryHints } from "./query-hints/map-message-to-query-hints.js";

function inferObjective(message: string): BusinessSpecification["objective"] {
  const m = message.toLowerCase();
  if (/\b(relat[oó]rio|jrxml|ireport)\b/.test(m)) return "REPORT";
  if (/\b(dashboard|painel)\b/.test(m)) return "DASHBOARD";
  if (/\b(tela|screen|formul[aá]rio)\b/.test(m)) return "SCREEN";
  return "QUERY";
}

function inferEntity(baseTable: string): string {
  const t = baseTable.toUpperCase();
  if (t === "TPRAPA") return "production_points";
  if (t === "TGFPRO") return "production_products";
  return "production_orders";
}

export function mapProducaoMessageToBusinessSpecification(
  message: string,
  conversationContext?: string,
): BusinessSpecification | null {
  const msg = String(message ?? "").trim();
  if (!msg) return null;
  const combined = [msg, String(conversationContext ?? "").trim()].filter(Boolean).join("\n");
  const hints = genesisDomainProducaoMapMessageToQueryHints(combined);
  if (!hints) return null;

  const objective = inferObjective(combined);
  return {
    domain: "producao",
    objective,
    entity: inferEntity(hints.baseTable),
    ...(hints.suggestedMetrics?.length
      ? { metrics: hints.suggestedMetrics.map((m) => String(m).toLowerCase()) }
      : {}),
    ...(hints.suggestedDimensions?.length
      ? { dimensions: hints.suggestedDimensions.map((d) => String(d).toLowerCase()) }
      : {}),
    output: {
      type:
        objective === "REPORT"
          ? "REPORT"
          : objective === "DASHBOARD"
            ? "DASHBOARD"
            : objective === "SCREEN"
              ? "SCREEN"
              : "QUERY",
    },
  };
}
