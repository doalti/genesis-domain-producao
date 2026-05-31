export interface ProducaoQueryMappingHint {
  baseTable: string;
  suggestedJoins: string[];
  suggestedDimensions: string[];
  suggestedMetrics: string[];
  semanticNotes: string[];
}
