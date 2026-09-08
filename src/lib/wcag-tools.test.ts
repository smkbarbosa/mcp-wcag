import { describe, expect, it } from "vitest";
import { WCAG_GUIDE } from "../data/wcag-guide.js";
import { PROJECT_PROFILES } from "../data/project-profiles.js";
import {
  DISCLAIMER,
  buildManualTestSteps,
  buildSimplifiedGuideJson,
  findCriterio,
  generateManualTestRoutineText,
  getCriterionDetailsText,
  listaDeIds,
  recommendCriteriaForProjectTypeText,
  searchCriteriaByKeywordText,
} from "./wcag-tools.js";

describe("findCriterio", () => {
  it("encontra um critério existente pelo id exato", () => {
    expect(findCriterio("1.4.3")?.nome).toBe("Contraste (mínimo)");
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
  it("lista todos os 87 ids do dataset separados por vírgula", () => {
    const ids = listaDeIds().split(", ");
    expect(ids).toHaveLength(WCAG_GUIDE.length);
    expect(ids).toContain("4.1.2");
  });
});

describe("buildSimplifiedGuideJson", () => {
  it("produz um JSON válido com meta, todos os critérios e os perfis de projeto", () => {
    const parsed = JSON.parse(buildSimplifiedGuideJson());
    expect(parsed.criterios).toHaveLength(WCAG_GUIDE.length);
    expect(parsed.meta.norma).toContain("ABNT NBR 17225");
    expect(parsed.perfisProjeto).toHaveLength(PROJECT_PROFILES.length);
  });
});

describe("getCriterionDetailsText", () => {
  it("inclui nome, nível, diretriz, URL do W3C, itens ABNT e o aviso", () => {
    const text = getCriterionDetailsText("1.1.1");
    expect(text).toContain("Conteúdo Não Textual");
    expect(text).toContain("[A]");
    expect(text).toContain("Diretriz: Alternativas em texto");
    expect(text).toContain("w3.org");
    expect(text).toContain("5.2.1");
    expect(text.endsWith(DISCLAIMER)).toBe(true);
  });

  it("lida com o critério 4.1.1 (removido), mostrando a nota em vez de itens ABNT", () => {
    const text = getCriterionDetailsText("4.1.1");
    expect(text).toContain("REMOVIDO");
    expect(text).toContain("referência histórica");
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

  it("também busca dentro das correlações ABNT", () => {
    const text = searchCriteriaByKeywordText("audiodescrição");
    expect(text).toMatch(/1\.2\.(3|5|7)/);
  });

  it("retorna mensagem de zero resultados para palavra-chave desconhecida", () => {
    const text = searchCriteriaByKeywordText("xyzxyz-inexistente");
    expect(text).toContain("Nenhum critério encontrado");
    expect(text.endsWith(DISCLAIMER)).toBe(true);
  });
});

describe("buildManualTestSteps", () => {
  it("inclui o passo padrão do princípio e passos específicos do tema detectado", () => {
    const criterio = WCAG_GUIDE.find((c) => c.id === "2.4.7")!; // Foco Visível, Operável
    const steps = buildManualTestSteps(criterio);
    expect(steps[0]).toContain("teclado");
    expect(steps.some((s) => s.toLowerCase().includes("indicador de foco"))).toBe(true);
    expect(steps.at(-1)).toContain("Registre evidências");
  });

  it("não duplica o mesmo passo mesmo se vários gatilhos coincidirem", () => {
    const criterio = WCAG_GUIDE.find((c) => c.id === "1.4.3")!;
    const steps = buildManualTestSteps(criterio);
    expect(new Set(steps).size).toBe(steps.length);
  });
});

describe("generateManualTestRoutineText", () => {
  it("numera os passos do roteiro para um critério ativo", () => {
    const text = generateManualTestRoutineText("2.1.1");
    expect(text).toMatch(/^Roteiro de teste manual/);
    expect(text).toContain("1. ");
  });

  it("explica que o critério 4.1.1 (removido) não precisa de teste manual", () => {
    const text = generateManualTestRoutineText("4.1.1");
    expect(text).toContain("removido");
    expect(text).toContain("Não há necessidade de teste manual");
  });

  it("retorna mensagem amigável para um critério desconhecido", () => {
    const text = generateManualTestRoutineText("9.9.9");
    expect(text).toContain("não encontrado");
    expect(text.endsWith(DISCLAIMER)).toBe(true);
  });
});

describe("recommendCriteriaForProjectTypeText", () => {
  it("reconhece um perfil de e-commerce e lista critérios prioritários", () => {
    const text = recommendCriteriaForProjectTypeText("estou construindo uma loja virtual com carrinho");
    expect(text).toContain("E-commerce / loja virtual");
    expect(text).toContain("2.5.8");
  });

  it("pode casar mais de um perfil ao mesmo tempo", () => {
    const text = recommendCriteriaForProjectTypeText("formulário de cadastro dentro de um app mobile");
    expect(text).toContain("Formulários, cadastros e login");
    expect(text).toContain("Aplicativo mobile");
  });

  it("retorna mensagem amigável com sugestões quando não reconhece o tipo de projeto", () => {
    const text = recommendCriteriaForProjectTypeText("xyzxyz-nao-existe");
    expect(text).toContain("Não reconheci");
    expect(text).toContain("loja virtual");
    expect(text.endsWith(DISCLAIMER)).toBe(true);
  });
});
