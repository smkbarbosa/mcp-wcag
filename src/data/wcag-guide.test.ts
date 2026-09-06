import { describe, expect, it } from "vitest";
import { WCAG_GUIDE } from "./wcag-guide.js";

describe("WCAG_GUIDE dataset", () => {
  it("has exactly the 10 criteria especificados para este servidor", () => {
    expect(WCAG_GUIDE).toHaveLength(10);
  });

  it("has unique ids", () => {
    const ids = WCAG_GUIDE.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(WCAG_GUIDE.map((c) => [c.id, c] as const))(
    "%s tem nível, princípio, correlação ABNT e roteiro de teste válidos",
    (_id, criterio) => {
      expect(["A", "AA", "AAA"]).toContain(criterio.nivel);
      expect(["Perceptível", "Operável", "Compreensível", "Robusto"]).toContain(criterio.principio);
      expect(criterio.abnt.length).toBeGreaterThan(0);
      expect(criterio.roteiroTesteManual.length).toBeGreaterThan(0);
      expect(criterio.palavrasChave.length).toBeGreaterThan(0);
      for (const item of criterio.abnt) {
        expect(item.codigo).toMatch(/^\d+\.\d+\.\d+$/);
        expect(item.resumo.length).toBeGreaterThan(0);
      }
    },
  );
});
