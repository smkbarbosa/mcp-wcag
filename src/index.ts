#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  buildSimplifiedGuideJson,
  generateManualTestRoutineText,
  getCriterionDetailsText,
  recommendCriteriaForProjectTypeText,
  searchCriteriaByKeywordText,
} from "./lib/wcag-tools.js";

const server = new McpServer(
  {
    name: "guia-wcag-mcp",
    version: "1.0.0",
  },
  {
    instructions:
      "Servidor de conhecimento local sobre acessibilidade web, com os 87 critérios da " +
      "WCAG 2.2 (Guia WCAG de Marcelo Sales, uso autorizado) cruzados com a ABNT NBR " +
      "17225:2025. Use as tools para consultar critérios, buscar por palavra-chave, " +
      "recomendar critérios prioritários de acordo com o tipo de projeto e gerar " +
      "roteiros de teste manual. Nenhuma tool deste servidor emite veredito de " +
      "conformidade — a validação final sempre depende de teste humano com teclado e " +
      "tecnologias assistivas.",
  },
);

server.registerResource(
  "wcag-simplified-guide",
  "wcag://v2.2/simplified-guide",
  {
    title: "Guia WCAG 2.2 completo (correlação ABNT NBR 17225)",
    description:
      "Os 87 critérios de sucesso da WCAG 2.2, com descrição em linguagem simples, " +
      "correlações com a ABNT NBR 17225:2025 e os perfis de tipo de projeto usados " +
      "pela tool recommend_criteria_for_project_type.",
    mimeType: "application/json",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "application/json",
        text: buildSimplifiedGuideJson(),
      },
    ],
  }),
);

server.registerTool(
  "get_criterion_details",
  {
    title: "Detalhes de um critério WCAG",
    description:
      "Retorna a descrição simplificada do guia e os itens normativos da ABNT NBR 17225 " +
      "correlacionados a um critério de sucesso da WCAG (ex.: \"1.4.3\").",
    inputSchema: {
      criterion: z.string().describe('Número do critério WCAG, ex.: "1.4.3"'),
    },
  },
  async ({ criterion }) => ({
    content: [{ type: "text", text: getCriterionDetailsText(criterion) }],
  }),
);

server.registerTool(
  "search_criteria_by_keyword",
  {
    title: "Buscar critérios por palavra-chave",
    description:
      'Filtra os cartões do guia que correspondem a uma palavra-chave (ex.: "contraste", "erro").',
    inputSchema: {
      keyword: z.string().min(1).describe('Palavra-chave a buscar, ex.: "contraste", "erro"'),
    },
  },
  async ({ keyword }) => ({
    content: [{ type: "text", text: searchCriteriaByKeywordText(keyword) }],
  }),
);

server.registerTool(
  "generate_manual_test_routine",
  {
    title: "Gerar roteiro de teste manual",
    description:
      "Gera um roteiro de teste manual passo a passo (teclado e leitor de tela) para um " +
      "critério WCAG. A execução e o veredito continuam sendo humanos.",
    inputSchema: {
      criterion: z.string().describe('Número do critério WCAG, ex.: "2.1.1"'),
    },
  },
  async ({ criterion }) => ({
    content: [{ type: "text", text: generateManualTestRoutineText(criterion) }],
  }),
);

server.registerTool(
  "recommend_criteria_for_project_type",
  {
    title: "Recomendar critérios por tipo de projeto",
    description:
      "Recebe uma descrição livre do tipo de projeto (ex.: \"loja virtual\", " +
      '"formulário de cadastro", "app mobile") e devolve os critérios WCAG ' +
      "prioritários para esse contexto, com base em perfis curados por este servidor.",
    inputSchema: {
      projectType: z
        .string()
        .min(1)
        .describe('Descrição livre do tipo de projeto, ex.: "e-commerce", "dashboard de dados"'),
    },
  },
  async ({ projectType }) => ({
    content: [{ type: "text", text: recommendCriteriaForProjectTypeText(projectType) }],
  }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("guia-wcag-mcp: servidor MCP iniciado (STDIO).");
}

main().catch((error) => {
  console.error("guia-wcag-mcp: falha ao iniciar o servidor:", error);
  process.exit(1);
});
