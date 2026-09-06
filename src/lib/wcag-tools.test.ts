import { describe, expect, it } from "vitest";
import { WCAG_GUIDE } from "../data/wcag-guide.js";
import {
  DISCLAIMER,
  buildSimplifiedGuideJson,
  findCriterio,
  generateManualTestRoutineText,
  getCriterionDetailsText,
  listaDeIds,
  searchCriteriaByKeywordText,
} from "./wcag-tools.js";

describe("findCriterio", () => {
  it("encontra um critério existente pelo id exato", () => {
    expect(findCriterio("1.4.3")?.nome).toBe("Contraste Mínimo");
  });

  it("ignora espaços em branco ao redor do id", () => {
    expect(findCriterio("  2.1.1  ")?.id).toBe("2.1.1");
  });

  it("retorna undefined para um critério desconhecido", () => {
    expect(findCriterio("9.9.9")).toBeUndefined();
  });

  it("retorna undefined para uma string vazia", () => {
    expect(findCriterio("")).toBeUndefined();
  });
});

describe("listaDeIds", () => {
  it("lista todos os ids do dataset separados por vírgula", () => {
    const ids = listaDeIds().split(", ");
    expect(ids).toHaveLength(WCAG_GUIDE.length);
    expect(ids).toContain("4.1.2");
  });
});

describe("buildSimplifiedGuideJson", () => {
  it("produz um JSON válido com meta e todos os critérios", () => {
    const parsed = JSON.parse(buildSimplifiedGuideJson());
    expect(parsed.criterios).toHaveLength(WCAG_GUIDE.length);
    expect(parsed.meta.norma).toContain("ABNT NBR 17225");
  });
});

describe("getCriterionDetailsText", () => {
  it("inclui nome, nível, códigos ABNT e o aviso para um critério conhecido", () => {
    const text = getCriterionDetailsText("1.1.1");
    expect(text).toContain("Conteúdo Não Textual");
    expect(text).toContain("[A]");
    expect(text).toContain("5.2.1");
    expect(text.endsWith(DISCLAIMER)).toBe(true);
  });

  it("retorna mensagem amigável listando os ids válidos para um critério desconhecido", () => {
    const text = getCriterionDetailsText("9.9.9");
    expect(text).toContain("não encontrado");
    expect(text).toContain("4.1.2");
    expect(text.endsWith(DISCLAIMER)).toBe(true);
  });
});

describe("searchCriteriaByKeywordText", () => {
  it("encontra múltiplos critérios para uma palavra-chave compartilhada", () => {
    const text = searchCriteriaByKeywordText("contraste");
    expect(text).toContain("1.4.3");
    expect(text).toContain("1.4.11");
  });

  it("é case-insensitive", () => {
    expect(searchCriteriaByKeywordText("CONTRASTE")).toContain("1.4.3");
  });

  it("retorna mensagem de zero resultados para palavra-chave desconhecida", () => {
    const text = searchCriteriaByKeywordText("xyzxyz-inexistente");
    expect(text).toContain("Nenhum critério encontrado");
    expect(text.endsWith(DISCLAIMER)).toBe(true);
  });
});

describe("generateManualTestRoutineText", () => {
  it("numera todos os passos do roteiro de um critério conhecido", () => {
    const criterio = WCAG_GUIDE.find((c) => c.id === "2.1.1")!;
    const text = generateManualTestRoutineText("2.1.1");
    expect(text).toContain(`1. ${criterio.roteiroTesteManual[0]}`);
    expect(text).toContain(`${criterio.roteiroTesteManual.length}. `);
  });

  it("retorna mensagem amigável para um critério desconhecido", () => {
    const text = generateManualTestRoutineText("9.9.9");
    expect(text).toContain("não encontrado");
    expect(text.endsWith(DISCLAIMER)).toBe(true);
  });
});
