import { describe, expect, it } from "vitest";
import { WCAG_GUIDE } from "./wcag-guide.js";

describe("WCAG_GUIDE dataset", () => {
  it("tem os 87 critérios da WCAG 2.2 (incluindo o 4.1.1, removido)", () => {
    expect(WCAG_GUIDE).toHaveLength(87);
  });

  it("tem ids únicos", () => {
    const ids = WCAG_GUIDE.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("marca exatamente o critério 4.1.1 como REMOVIDO", () => {
    const removidos = WCAG_GUIDE.filter((c) => c.nivel === "REMOVIDO");
    expect(removidos.map((c) => c.id)).toEqual(["4.1.1"]);
  });

  it.each(WCAG_GUIDE.map((c) => [c.id, c] as const))(
    "%s tem nível, princípio, diretriz, URL do W3C e descrição válidos",
    (_id, criterio) => {
      expect(["A", "AA", "AAA", "REMOVIDO"]).toContain(criterio.nivel);
      expect(["Perceptível", "Operável", "Compreensível", "Robusto"]).toContain(criterio.principio);
      expect(criterio.diretriz.length).toBeGreaterThan(0);
      expect(criterio.w3cUrl).toMatch(/^https:\/\/www\.w3\.org\//);
      expect(criterio.descricaoSimples.length).toBeGreaterThan(0);
    },
  );

  it.each(WCAG_GUIDE.filter((c) => c.nivel !== "REMOVIDO").map((c) => [c.id, c] as const))(
    "%s tem correlação ABNT em forma de itens ou de nota explicativa",
    (_id, criterio) => {
      expect(criterio.abnt.length > 0 || Boolean(criterio.abntNota)).toBe(true);
      for (const item of criterio.abnt) {
        expect(item.codigo).toMatch(/^\d+\.\d+\.\d+$/);
        expect(["Requisito", "Recomendação"]).toContain(item.classificacao);
        expect(item.nome.length).toBeGreaterThan(0);
        expect(item.comoCumprir.length).toBeGreaterThan(0);
      }
    },
  );

  it("o critério 4.1.1 (removido) não tem itens ABNT, só uma nota explicativa", () => {
    const c = WCAG_GUIDE.find((c) => c.id === "4.1.1")!;
    expect(c.abnt).toHaveLength(0);
    expect(c.abntNota).toBeTruthy();
  });
});
