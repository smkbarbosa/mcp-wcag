# guia-wcag-mcp

[![CI](https://github.com/smkbarbosa/mcp-wcag/actions/workflows/ci.yml/badge.svg)](https://github.com/smkbarbosa/mcp-wcag/actions/workflows/ci.yml)

Servidor **MCP (Model Context Protocol)** local, em Node.js/TypeScript, que expõe uma
base de conhecimento de acessibilidade web para agentes de IA no VS Code (Cline, Roo
Code, prompts locais). O conteúdo é inspirado no formato de cartões do
[Guia WCAG de Marcelo Sales](https://guia-wcag.com/) e cruza critérios de sucesso da
**WCAG 2.2** com os itens normativos correspondentes da **ABNT NBR 17225:2025**
(norma brasileira de acessibilidade digital).

> ⚠️ **Este servidor não audita nem certifica acessibilidade sozinho.** Todas as
> tools devolvem, ao final da resposta, o aviso: *"LLMs ajudam a planejar testes, mas
> não comprovam conformidade sozinhas. Realize testes manuais com teclado e
> tecnologias assistivas. A decisão final é humana."*

## O que ele expõe

### Resource

- `wcag://v2.2/simplified-guide` — JSON com os 10 critérios de sucesso cobertos,
  organizados por princípio (Perceptível, Operável, Compreensível, Robusto), cada um
  com descrição simplificada, palavras-chave e correlações com a ABNT NBR 17225.

### Tools

| Tool | Argumento | O que faz |
| --- | --- | --- |
| `get_criterion_details` | `criterion` (ex.: `"1.4.3"`) | Descrição simplificada do critério + itens ABNT correlacionados. |
| `search_criteria_by_keyword` | `keyword` (ex.: `"contraste"`, `"erro"`) | Filtra os cartões do guia que correspondem à palavra-chave. |
| `generate_manual_test_routine` | `criterion` (ex.: `"2.1.1"`) | Roteiro de teste manual passo a passo (teclado / leitor de tela). A execução e o veredito continuam sendo humanos. |

Critérios cobertos hoje: `1.1.1`, `1.4.1`, `1.4.3`, `1.4.11`, `2.1.1`, `2.4.7`,
`2.5.8`, `3.3.1`, `3.3.2`, `4.1.2`.

> As descrições, resumos das correlações ABNT e roteiros de teste foram redigidos
> neste projeto no mesmo espírito "descomplicado" do guia original — não são cópia
> literal do site (que é uma SPA renderizada via JS) nem do texto oficial da norma
> ABNT (protegida por direitos autorais). Para a redação normativa exata, consulte a
> ABNT NBR 17225:2025 na íntegra.

## Requisitos

- Node.js `>= 20` (desenvolvido e testado em Node 22.x e 24.x)
- npm

## Instalação e build

```bash
npm ci
npm run build
```

## Rodando os testes

```bash
npm test
```

O script `test` compila o projeto (`pretest`) e roda a suíte com
[Vitest](https://vitest.dev/): testes unitários da base de dados e das funções de
cada tool, além de um teste de integração que sobe o servidor compilado e conversa
com ele via stdio usando JSON-RPC de verdade (o mesmo protocolo que o VS Code usa).

## Como configurar o MCP no VS Code

Em todos os casos abaixo, rode `npm run build` antes (o servidor é iniciado a partir
de `dist/index.js`) e troque `/caminho/absoluto/para/guia_wcag_mcp` pelo caminho
onde você clonou este repositório.

### VS Code nativo (GitHub Copilot Chat, modo agente)

O VS Code tem suporte nativo a MCP — não precisa de extensão de terceiros.

**Só neste workspace:** crie o arquivo `.vscode/mcp.json` na raiz do projeto:

```json
{
  "servers": {
    "guia-wcag-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/dist/index.js"]
    }
  }
}
```

**Em todos os workspaces:** abra a paleta de comandos (`Ctrl+Shift+P` /
`Cmd+Shift+P`) e rode **MCP: Add Server...** → **Command (stdio)**, informando
`node` como comando e o caminho absoluto de `dist/index.js` como argumento. Isso
grava a configuração no `mcp.json` de usuário (acessível depois via
**MCP: Open User Configuration**).

Em ambos os casos, depois de salvar, abra o painel do Copilot Chat, mude para o
**modo agente** e clique em "Iniciar" ao lado do servidor `guia-wcag-mcp` (ou rode
**MCP: List Servers** na paleta de comandos para gerenciar/reiniciar).

### Cline / Roo Code

Registre o servidor no arquivo de configuração de MCP da extensão
(`cline_mcp_settings.json` para o Cline, `mcp_settings.json` para o Roo Code — ambos
usam a mesma estrutura):

```json
{
  "mcpServers": {
    "guia-wcag-mcp": {
      "command": "node",
      "args": [
        "/caminho/absoluto/para/guia_wcag_mcp/dist/index.js"
      ],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

Depois de salvar, recarregue a extensão (painel "MCP Servers" → Restart).

## Estrutura do projeto

```
src/
  data/
    wcag-guide.ts        # os 10 critérios (dados + tipos)
    wcag-guide.test.ts    # testes de integridade dos dados
  lib/
    wcag-tools.ts         # lógica pura por trás do resource e das tools
    wcag-tools.test.ts    # testes unitários dessa lógica
  index.ts                 # wiring do McpServer (resource + tools + stdio)
  index.integration.test.ts # sobe o servidor compilado e testa via JSON-RPC
```

## CI e segurança da cadeia de suprimentos

O workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) roda em todo push e
pull request para `main`, em dois jobs sequenciais — o build só é considerado
aprovado no GitHub se **ambos** passarem:

1. **`security`** — antes de qualquer build/teste:
   - `npm ci --ignore-scripts`: instala as dependências sem executar scripts de
     `install`/`postinstall` de terceiros (o vetor mais comum de infostealers e worms
     publicados no npm; nenhuma dependência deste projeto precisa desses scripts).
   - `npm audit signatures`: verifica a assinatura/proveniência de cada pacote
     instalado junto ao registry oficial do npm.
   - `npm audit --audit-level=high`: falha o build se houver vulnerabilidade
     conhecida de nível alto/crítico em qualquer dependência.
   - Checagem extra que garante que todo pacote do `package-lock.json` foi
     resolvido a partir de `registry.npmjs.org` (proteção contra dependency
     confusion / registries substituídos).
2. **`build-and-test`** (depende do job acima) — compila o projeto e roda
   `npm test` em Node 22.x e 24.x.

O workflow [`.github/workflows/codeql.yml`](.github/workflows/codeql.yml) roda
[CodeQL](https://codeql.github.com/) (análise estática de JavaScript/TypeScript) em
todo push/PR para `main` e semanalmente, para pegar padrões de código inseguro.

Além disso, o [Dependabot](.github/dependabot.yml) abre PRs semanais para manter as
dependências (npm e GitHub Actions) atualizadas.

A branch `main` exige, via regra do repositório, que os checks de CI e ao menos uma
aprovação de PR passem antes do merge.

Essas checagens reduzem o risco, mas não eliminam: sempre revise PRs que alterem
`package.json`/`package-lock.json` antes de fazer merge.

## Licença

ISC — veja [`package.json`](package.json).
