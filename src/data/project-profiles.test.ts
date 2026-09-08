import { describe, expect, it } from "vitest";
import { WCAG_GUIDE } from "./wcag-guide.js";
import { PROJECT_PROFILES } from "./project-profiles.js";

describe("PROJECT_PROFILES dataset", () => {
  it("tem ids únicos", () => {
    const ids = PROJECT_PROFILES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  const diretrizesValidas = new Set(WCAG_GUIDE.map((c) => c.diretriz));
  const idsValidos = new Set(WCAG_GUIDE.map((c) => c.id));

  it.each(PROJECT_PROFILES.map((p) => [p.id, p] as const))(
    "%s tem gatilhos, diretrizes e critérios prioritários válidos",
    (_id, perfil) => {
      expect(perfil.gatilhos.length).toBeGreaterThan(0);
      expect(perfil.diretrizes.length).toBeGreaterThan(0);
      expect(perfil.observacao.length).toBeGreaterThan(0);
      for (const diretriz of perfil.diretrizes) {
        expect(diretrizesValidas.has(diretriz)).toBe(true);
      }
      for (const id of perfil.criteriosPrioritarios) {
        expect(idsValidos.has(id)).toBe(true);
      }
    },
  );

  it("cada perfil resolve para pelo menos um critério real", () => {
    for (const perfil of PROJECT_PROFILES) {
      const prioritized = new Set(perfil.criteriosPrioritarios);
      const relevantes = WCAG_GUIDE.filter(
        (c) => c.nivel !== "REMOVIDO" && (perfil.diretrizes.includes(c.diretriz) || prioritized.has(c.id)),
      );
      expect(relevantes.length).toBeGreaterThan(0);
    }
  });
});
