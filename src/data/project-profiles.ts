/**
 * Perfis de tipo de projeto, usados pela tool `recommend_criteria_for_project_type`
 * para priorizar quais critérios da WCAG revisar primeiro. É uma curadoria própria
 * deste servidor (não vem do Guia WCAG) — um mapeamento pragmático entre "o que a
 * pessoa está construindo" e as diretrizes/critérios mais relevantes para esse
 * contexto. Não é exaustivo: os demais critérios continuam se aplicando.
 */

export interface PerfilProjeto {
  id: string;
  nome: string;
  /** Palavras-chave (em minúsculas) usadas para casar com a descrição livre do usuário */
  gatilhos: string[];
  /** Nomes de diretriz (campo `diretriz` de WcagCriterio) mais relevantes para este perfil */
  diretrizes: string[];
  /** Critérios específicos de alta prioridade além das diretrizes acima */
  criteriosPrioritarios: string[];
  observacao: string;
}

export const PROJECT_PROFILES: PerfilProjeto[] = [
  {
    id: "formularios-e-cadastro",
    nome: "Formulários, cadastros e login",
    gatilhos: [
      "formulário",
      "formularios",
      "formulários",
      "cadastro",
      "cadastros",
      "login",
      "checkout",
      "inscrição",
      "inscricao",
      "registro",
    ],
    diretrizes: ["Assistência de entrada", "Previsível", "Legível"],
    criteriosPrioritarios: ["1.3.1", "1.3.5", "2.4.6", "2.5.3", "3.3.1", "3.3.2", "4.1.2"],
    observacao:
      "Fluxos de formulário concentram boa parte dos critérios de rótulos, instruções, " +
      "identificação/prevenção de erro e confirmação de dados.",
  },
  {
    id: "video-audio-midia",
    nome: "Vídeo, áudio e mídia",
    gatilhos: ["vídeo", "video", "áudio", "audio", "podcast", "streaming", "player", "mídia", "midia"],
    diretrizes: ["Mídias baseadas em tempo"],
    criteriosPrioritarios: ["1.4.2"],
    observacao:
      "Conteúdo de mídia temporizada traz um bloco inteiro de critérios próprios: " +
      "legendas, audiodescrição, transcrição e controle de reprodução de áudio.",
  },
  {
    id: "ecommerce-loja-virtual",
    nome: "E-commerce / loja virtual",
    gatilhos: [
      "loja",
      "e-commerce",
      "ecommerce",
      "carrinho",
      "produto",
      "compra",
      "pagamento",
      "checkout",
      "marketplace",
    ],
    diretrizes: ["Assistência de entrada", "Tempo suficiente", "Previsível"],
    criteriosPrioritarios: ["2.5.8", "2.2.1", "3.3.4", "3.3.6", "4.1.3"],
    observacao:
      "Checkout e pagamento envolvem prevenção de erro em dados sensíveis, tempo de " +
      "sessão e feedback de status — falhas aqui têm impacto financeiro direto.",
  },
  {
    id: "spa-aplicacao-dinamica",
    nome: "Aplicação de página única (SPA) / conteúdo dinâmico",
    gatilhos: [
      "spa",
      "single page",
      "aplicação",
      "aplicacao",
      "dashboard",
      "dinâmico",
      "dinamico",
      "reativo",
      "react",
      "angular",
      "vue",
    ],
    diretrizes: ["Navegável", "Compatível", "Previsível"],
    criteriosPrioritarios: ["2.4.3", "4.1.2", "4.1.3", "3.2.2"],
    observacao:
      "Conteúdo que muda sem recarregar a página exige atenção redobrada a foco, " +
      "mensagens de status e componentes customizados (nome/função/valor via ARIA).",
  },
  {
    id: "conteudo-institucional-blog",
    nome: "Site institucional / blog / conteúdo editorial",
    gatilhos: [
      "institucional",
      "blog",
      "notícia",
      "noticia",
      "artigo",
      "conteúdo",
      "conteudo",
      "editorial",
      "site",
    ],
    diretrizes: ["Adaptável", "Discernível", "Legível", "Navegável"],
    criteriosPrioritarios: ["2.4.2", "2.4.6"],
    observacao:
      "Conteúdo majoritariamente textual se beneficia de estrutura semântica correta, " +
      "contraste, hierarquia de títulos e navegação previsível entre páginas.",
  },
  {
    id: "mobile-app",
    nome: "Aplicativo mobile",
    gatilhos: ["mobile", "app", "aplicativo", "celular", "ios", "android", "smartphone"],
    diretrizes: ["Modalidades de entrada", "Adaptável"],
    criteriosPrioritarios: ["1.3.4", "2.5.4", "2.5.5", "2.5.8"],
    observacao:
      "Telas pequenas e interação por toque/gesto trazem critérios próprios de " +
      "orientação, tamanho de alvo e alternativas a gestos complexos ou movimento do aparelho.",
  },
  {
    id: "dashboards-e-dados",
    nome: "Dashboards e visualização de dados",
    gatilhos: ["dashboard", "gráfico", "grafico", "relatório", "relatorio", "dados", "tabela", "métrica", "metrica"],
    diretrizes: ["Discernível", "Compatível"],
    criteriosPrioritarios: ["1.4.1", "1.4.11", "4.1.3"],
    observacao:
      "Gráficos e tabelas dependem de mais do que cor para transmitir informação, e " +
      "atualizações de dados em tempo real precisam ser comunicadas via mensagens de status.",
  },
];
