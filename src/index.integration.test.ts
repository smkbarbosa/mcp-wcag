import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * Teste de integração: sobe o servidor MCP compilado (dist/index.js) e conversa
 * com ele via stdio usando JSON-RPC de verdade, exatamente como o VS Code
 * (Cline/Roo Code) faria. Requer que `npm run build` já tenha rodado antes
 * (o script "pretest" do package.json cuida disso).
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverEntry = path.resolve(__dirname, "../dist/index.js");

type JsonRpcResponse = { id: number; result?: any; error?: any };

describe("guia-wcag-mcp (integração via stdio)", () => {
  let child: ChildProcessWithoutNullStreams;
  let buffer = "";
  const pending = new Map<number, (value: JsonRpcResponse) => void>();

  function handleLine(line: string) {
    if (!line.trim()) return;
    const msg = JSON.parse(line) as JsonRpcResponse;
    const resolve = pending.get(msg.id);
    if (resolve) {
      pending.delete(msg.id);
      resolve(msg);
    }
  }

  function request(id: number, method: string, params: unknown = {}): Promise<JsonRpcResponse> {
    return new Promise((resolve) => {
      pending.set(id, resolve);
      child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
    });
  }

  beforeAll(async () => {
    child = spawn("node", [serverEntry], { stdio: ["pipe", "pipe", "pipe"] });
    child.stdout.on("data", (chunk: Buffer) => {
      buffer += chunk.toString();
      let idx: number;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        handleLine(line);
      }
    });

    await request(0, "initialize", {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "vitest", version: "0.0.1" },
    });
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
  });

  afterAll(() => {
    child.kill();
  });

  it("expõe o resource do guia simplificado", async () => {
    const res = await request(1, "resources/list");
    expect(res.result.resources).toHaveLength(1);
    expect(res.result.resources[0].uri).toBe("wcag://v2.2/simplified-guide");
  });

  it("expõe as três tools esperadas", async () => {
    const res = await request(2, "tools/list");
    const names = res.result.tools.map((t: { name: string }) => t.name);
    expect(names).toEqual([
      "get_criterion_details",
      "search_criteria_by_keyword",
      "generate_manual_test_routine",
    ]);
  });

  it("get_criterion_details retorna os dados do critério e o aviso", async () => {
    const res = await request(3, "tools/call", {
      name: "get_criterion_details",
      arguments: { criterion: "1.4.3" },
    });
    const text = res.result.content[0].text as string;
    expect(text).toContain("Contraste Mínimo");
    expect(text).toContain("A decisão final é humana.");
  });

  it("search_criteria_by_keyword filtra os cartões pela palavra-chave", async () => {
    const res = await request(4, "tools/call", {
      name: "search_criteria_by_keyword",
      arguments: { keyword: "teclado" },
    });
    const text = res.result.content[0].text as string;
    expect(text).toContain("2.1.1");
  });

  it("generate_manual_test_routine devolve um roteiro numerado", async () => {
    const res = await request(5, "tools/call", {
      name: "generate_manual_test_routine",
      arguments: { criterion: "2.4.7" },
    });
    const text = res.result.content[0].text as string;
    expect(text).toContain("Roteiro de teste manual");
    expect(text).toMatch(/1\. /);
  });

  it("lê o resource e devolve o JSON completo do guia", async () => {
    const res = await request(6, "resources/read", { uri: "wcag://v2.2/simplified-guide" });
    const parsed = JSON.parse(res.result.contents[0].text);
    expect(parsed.criterios).toHaveLength(10);
  });
});
