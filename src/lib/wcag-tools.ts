/**
 * Lógica pura por trás das tools e do resource do servidor MCP, separada da
 * camada de wiring (`src/index.ts`) para poder ser testada sem precisar subir
 * um transporte MCP/stdio.
 */
import { GUIA_META, WCAG_GUIDE, type WcagCriterio } from "../data/wcag-guide.js";
import { PROJECT_PROFILES, type PerfilProjeto } from "../data/project-profiles.js";

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
  return JSON.stringify(
    { meta: GUIA_META, criterios: WCAG_GUIDE, perfisProjeto: PROJECT_PROFILES },
    null,
    2,
  );
}

function formatAbntItem(item: WcagCriterio["abnt"][number]): string {
  return `  - ${item.codigo} — ${item.nome} [${item.classificacao}]\n    Como cumprir: ${item.comoCumprir}`;
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

  const removidoTag = item.nivel === "REMOVIDO" ? " (REMOVIDO da WCAG 2.2 — mantido como referência histórica)" : "";
  const abntSection =
    item.abnt.length > 0
      ? `Correlações ABNT NBR 17225:2025:\n${item.abnt.map(formatAbntItem).join("\n")}`
      : `Correlações ABNT NBR 17225:2025: ${item.abntNota ?? "nenhuma correlação direta registrada."}`;

  const text =
    `${item.id} — ${item.nome} [${item.nivel}]${removidoTag}\n` +
    `Princípio: ${item.principio} · Diretriz: ${item.diretriz}\n` +
    `Referência oficial (W3C): ${item.w3cUrl}\n\n` +
    `Descrição simplificada:\n${item.descricaoSimples}\n\n` +
    abntSection +
    DISCLAIMER;

  return text;
}

function criterioSearchHaystack(c: WcagCriterio): string {
  const abntText = c.abnt.map((a) => `${a.nome} ${a.comoCumprir}`).join(" ");
  return [c.id, c.nome, c.diretriz, c.principio, c.descricaoSimples, abntText, c.abntNota ?? ""]
    .join(" ")
    .toLowerCase();
}

export function searchCriteriaByKeywordText(keyword: string): string {
  const needle = keyword.trim().toLowerCase();
  const matches = WCAG_GUIDE.filter((c) => criterioSearchHaystack(c).includes(needle));

  if (matches.length === 0) {
    return `Nenhum critério encontrado para a palavra-chave "${keyword}".` + DISCLAIMER;
  }

  const body = matches
    .map(
      (c) =>
        `- ${c.id} — ${c.nome} [${c.nivel}] (${c.principio} · ${c.diretriz})\n  ${c.descricaoSimples}`,
    )
    .join("\n\n");

  return `${matches.length} critério(s) encontrado(s) para "${keyword}":\n\n${body}` + DISCLAIMER;
}

interface TopicRule {
  match: RegExp;
  step: string;
}

const PRINCIPIO_DEFAULT_STEP: Record<WcagCriterio["principio"], string> = {
  Perceptível:
    "Teste com um leitor de tela (NVDA, JAWS ou VoiceOver) ativo, prestando atenção ao que é anunciado nesse ponto da interface.",
  Operável:
    "Teste usando apenas o teclado (Tab, Shift+Tab, Enter, Espaço, setas), sem usar o mouse.",
  Compreensível:
    "Percorra o fluxo como uma pessoa usuária real faria, prestando atenção a instruções, mensagens e à previsibilidade do comportamento.",
  Robusto:
    "Inspecione a árvore de acessibilidade (Accessibility Tree) nas ferramentas de desenvolvedor do navegador e confirme com um leitor de tela.",
};

const TOPIC_RULES: TopicRule[] = [
  {
    match: /contraste/,
    step: "Meça a razão de contraste com uma ferramenta de verificação (extensão de navegador ou seletor de cor) e compare com o valor mínimo exigido pelo critério.",
  },
  {
    match: /\bcor(es)?\b/,
    step: "Ative um simulador de daltonismo ou o modo de escala de cinza e confirme que a informação continua identificável sem depender da cor.",
  },
  {
    match: /teclado/,
    step: "Navegue só de teclado (sem mouse) e confirme que dá para realizar a ação completa dessa forma, sem armadilhas de foco.",
  },
  {
    match: /foco/,
    step: "Percorra a tela com Tab/Shift+Tab e observe se o indicador de foco fica sempre visível e claro.",
  },
  {
    match: /v[íi]deo/,
    step: "Reproduza o vídeo e confira legendas, audiodescrição (quando aplicável) e os controles de reprodução.",
  },
  {
    match: /[áa]udio/,
    step: "Reproduza o áudio e confirme se existe transcrição ou alternativa em texto equivalente.",
  },
  {
    match: /legenda/,
    step: "Ative as legendas e confirme que elas acompanham a fala e os sons relevantes com sincronismo adequado.",
  },
  {
    match: /r[óo]tulo|campo|formul[áa]rio/,
    step: "Navegue o formulário com Tab e, a cada campo, confirme com um leitor de tela que o rótulo/instrução correspondente é anunciado.",
  },
  {
    match: /erro/,
    step: "Preencha o formulário com dados inválidos de propósito e confirme que o erro é anunciado automaticamente pelo leitor de tela, em texto, próximo ao campo.",
  },
  {
    match: /tempo|temporizador|sess[ãa]o|expira/,
    step: "Verifique se existe um jeito de estender, pausar ou desligar o limite de tempo antes que ele expire.",
  },
  {
    match: /movimento|anima[çc][ãa]o|pisca|convuls/,
    step: "Verifique se há conteúdo piscando ou com movimento intenso e se existe como pausar, parar ou ocultar essa animação (cuidado: conteúdo que pisca pode desencadear convulsões fotossensíveis).",
  },
  {
    match: /gesto|arrast/,
    step: "No dispositivo touch, confirme que qualquer gesto complexo (arrastar, pinçar, multitoque) tem uma alternativa de toque simples equivalente.",
  },
  {
    match: /orienta[çc][ãa]o/,
    step: "Gire o dispositivo entre retrato e paisagem e confirme que o conteúdo continua funcional nas duas orientações.",
  },
  {
    match: /idioma/,
    step: "Confira se o idioma da página (e de trechos em outro idioma) está declarado corretamente no HTML (`lang`), e ouça se o leitor de tela pronuncia o texto no idioma certo.",
  },
  {
    match: /nome, fun[çc][ãa]o|aria|customizado|componente/,
    step: "Com um leitor de tela, confirme que o nome, a função (role) e o estado/valor do componente são anunciados corretamente, inclusive após uma mudança de estado.",
  },
  {
    match: /alvo|[áa]rea de toque/,
    step: "Meça a área clicável/tocável de botões e links pequenos (aproximadamente 24x24px CSS) num dispositivo touch ou no modo de emulação de toque do navegador.",
  },
  {
    match: /mensage(m|ns) de status/,
    step: "Dispare a ação que gera a mensagem de status e confirme que o leitor de tela a anuncia automaticamente, sem precisar mover o foco.",
  },
  {
    match: /redimension|zoom|reflow|responsiv/,
    step: "Aumente o zoom da página até 400% (ou reduza a largura da janela) e confirme que não há perda de conteúdo nem rolagem horizontal.",
  },
];

const CLOSING_STEP =
  "Registre evidências (prints, gravação de tela ou a transcrição do que o leitor de tela anunciou) para documentar sua conclusão.";

export function buildManualTestSteps(criterio: WcagCriterio): string[] {
  const haystack = `${criterio.nome} ${criterio.diretriz} ${criterio.descricaoSimples}`.toLowerCase();
  const steps: string[] = [PRINCIPIO_DEFAULT_STEP[criterio.principio]];

  for (const rule of TOPIC_RULES) {
    if (rule.match.test(haystack) && !steps.includes(rule.step)) {
      steps.push(rule.step);
    }
  }

  steps.push(CLOSING_STEP);
  return steps;
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

  if (item.nivel === "REMOVIDO") {
    return (
      `Roteiro de teste manual — ${item.id} ${item.nome}\n` +
      `Este critério foi removido da WCAG 2.2 e é mantido apenas como referência histórica. ` +
      `Não há necessidade de teste manual para ele.` +
      DISCLAIMER
    );
  }

  const passos = buildManualTestSteps(item)
    .map((passo, index) => `${index + 1}. ${passo}`)
    .join("\n");

  return (
    `Roteiro de teste manual — ${item.id} ${item.nome} [${item.nivel}]\n` +
    "Este roteiro deve ser executado por uma pessoa, usando teclado e/ou leitor de tela. " +
    "Nenhum passo aqui é executável ou verificável automaticamente por uma IA.\n\n" +
    passos +
    DISCLAIMER
  );
}

function matchProjectProfiles(projectType: string): PerfilProjeto[] {
  const needle = projectType.trim().toLowerCase();
  return PROJECT_PROFILES.filter((profile) => profile.gatilhos.some((gatilho) => needle.includes(gatilho)));
}

export function recommendCriteriaForProjectTypeText(projectType: string): string {
  const matchedProfiles = matchProjectProfiles(projectType);

  if (matchedProfiles.length === 0) {
    const available = PROJECT_PROFILES.map((p) => `"${p.nome}"`).join(", ");
    return (
      `Não reconheci um tipo de projeto em "${projectType}".\n` +
      `Descreva com outras palavras (ex.: "loja virtual", "formulário de cadastro", "app mobile") ou escolha um dos perfis conhecidos: ${available}.` +
      DISCLAIMER
    );
  }

  const sections = matchedProfiles.map((profile) => {
    const prioritized = new Set(profile.criteriosPrioritarios);
    const relevantes = WCAG_GUIDE.filter(
      (c) => c.nivel !== "REMOVIDO" && (profile.diretrizes.includes(c.diretriz) || prioritized.has(c.id)),
    );

    const lista = relevantes
      .map((c) => `  - ${c.id} — ${c.nome} [${c.nivel}]${prioritized.has(c.id) ? " (prioritário)" : ""}`)
      .join("\n");

    return `## ${profile.nome}\n${profile.observacao}\n\n${lista}`;
  });

  return (
    `Perfis de projeto reconhecidos em "${projectType}": ${matchedProfiles.map((p) => p.nome).join(", ")}.\n\n` +
    sections.join("\n\n") +
    DISCLAIMER
  );
}
