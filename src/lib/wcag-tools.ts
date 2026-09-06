/**
 * Lógica pura por trás das tools e do resource do servidor MCP, separada da
 * camada de wiring (`src/index.ts`) para poder ser testada sem precisar subir
 * um transporte MCP/stdio.
 */
import { GUIA_META, WCAG_GUIDE, type WcagCriterio } from "../data/wcag-guide.js";

export const DISCLAIMER =
  "\n\n---\n" +
  "Aviso: LLMs ajudam a planejar testes, mas não comprovam conformidade sozinhas. " +
  "Realize testes manuais com teclado e tecnologias assistivas. A decisão final é humana.";

export function findCriterio(input: string): WcagCriterio | undefined {
  const normalized = input.trim();
  return WCAG_GUIDE.find((c) => c.id === normalized);
}

export function listaDeIds(): string {
  return WCAG_GUIDE.map((c) => c.id).join(", ");
}

export function buildSimplifiedGuideJson(): string {
  return JSON.stringify({ meta: GUIA_META, criterios: WCAG_GUIDE }, null, 2);
}

export function getCriterionDetailsText(criterion: string): string {
  const item = findCriterio(criterion);

  if (!item) {
    return (
      `Critério "${criterion}" não encontrado nesta base local.\n` +
      `Critérios disponíveis: ${listaDeIds()}.` +
      DISCLAIMER
    );
  }

  const abntList = item.abnt.map((a) => `  - ${a.codigo}: ${a.resumo}`).join("\n");
  return (
    `${item.id} — ${item.nome} [${item.nivel}] (Princípio: ${item.principio})\n\n` +
    `Descrição simplificada:\n${item.descricaoSimples}\n\n` +
    `Correlações ABNT NBR 17225:2025:\n${abntList}` +
    DISCLAIMER
  );
}

export function searchCriteriaByKeywordText(keyword: string): string {
  const needle = keyword.trim().toLowerCase();
  const matches = WCAG_GUIDE.filter((c) => {
    const haystack = [c.id, c.nome, c.descricaoSimples, ...c.palavrasChave]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });

  if (matches.length === 0) {
    return `Nenhum critério encontrado para a palavra-chave "${keyword}".` + DISCLAIMER;
  }

  const body = matches
    .map((c) => `- ${c.id} — ${c.nome} [${c.nivel}] (${c.principio})\n  ${c.descricaoSimples}`)
    .join("\n\n");

  return `${matches.length} critério(s) encontrado(s) para "${keyword}":\n\n${body}` + DISCLAIMER;
}

export function generateManualTestRoutineText(criterion: string): string {
  const item = findCriterio(criterion);

  if (!item) {
    return (
      `Critério "${criterion}" não encontrado nesta base local.\n` +
      `Critérios disponíveis: ${listaDeIds()}.` +
      DISCLAIMER
    );
  }

  const passos = item.roteiroTesteManual.map((passo, index) => `${index + 1}. ${passo}`).join("\n");

  return (
    `Roteiro de teste manual — ${item.id} ${item.nome} [${item.nivel}]\n` +
    "Este roteiro deve ser executado por uma pessoa, usando teclado e/ou leitor de tela. " +
    "Nenhum passo aqui é executável ou verificável automaticamente por uma IA.\n\n" +
    passos +
    DISCLAIMER
  );
}
