/**
 * Base de conhecimento local inspirada no formato de cartões do "Guia WCAG"
 * (Marcelo Sales — guia-wcag.com), cruzando critérios de sucesso da WCAG 2.2
 * com os itens normativos correspondentes da ABNT NBR 17225:2025.
 *
 * As descrições e os roteiros de teste manual abaixo foram redigidos nesta
 * base no mesmo espírito "descomplicado" do guia original, mas não são cópia
 * literal do site (que é renderizado via JavaScript) nem do texto oficial da
 * norma ABNT (protegido por direitos autorais). Para a redação normativa
 * exata, consulte a ABNT NBR 17225:2025 na íntegra.
 */

export type Principio = "Perceptível" | "Operável" | "Compreensível" | "Robusto";
export type Nivel = "A" | "AA" | "AAA";

export interface AbntCorrelacao {
  /** Código do item da ABNT NBR 17225:2025, ex.: "5.11.2" */
  codigo: string;
  /** Resumo em linguagem simples do que o item normativo cobre (paráfrase, não texto oficial) */
  resumo: string;
}

export interface WcagCriterio {
  /** Número do critério de sucesso, ex.: "1.4.3" */
  id: string;
  nome: string;
  nivel: Nivel;
  principio: Principio;
  descricaoSimples: string;
  palavrasChave: string[];
  abnt: AbntCorrelacao[];
  roteiroTesteManual: string[];
}

export const GUIA_META = {
  fonte: "Inspirado no Guia WCAG de Marcelo Sales (guia-wcag.com)",
  norma: "ABNT NBR 17225:2025 — Acessibilidade em conteúdo e aplicações web",
  versaoWcag: "WCAG 2.2",
  observacao:
    "Conteúdo local, redigido em linguagem simples para apoiar agentes de IA. " +
    "Não substitui a leitura dos critérios originais da WCAG nem do texto integral da ABNT NBR 17225.",
};

export const WCAG_GUIDE: WcagCriterio[] = [
  {
    id: "1.1.1",
    nome: "Conteúdo Não Textual",
    nivel: "A",
    principio: "Perceptível",
    descricaoSimples:
      "Todo conteúdo que não é texto (imagens, botões de imagem, gráficos, CAPTCHAs, " +
      "áreas de mídia) precisa ter uma alternativa em texto equivalente, para que " +
      "leitores de tela e outras tecnologias assistivas consigam comunicar a mesma " +
      "informação ou função a quem não enxerga a imagem.",
    palavrasChave: ["imagem", "alt", "texto alternativo", "não textual", "ícone", "captcha"],
    abnt: [
      { codigo: "5.2.1", resumo: "Alternativa textual para imagens informativas" },
      { codigo: "5.2.2", resumo: "Alternativa textual vazia para imagens puramente decorativas" },
      { codigo: "5.2.3", resumo: "Alternativa textual e mecanismo alternativo para CAPTCHA" },
      { codigo: "5.2.4", resumo: "Alternativa textual para controles e botões de imagem" },
      { codigo: "5.2.5", resumo: "Alternativa textual para imagens complexas (gráficos, mapas, infográficos)" },
      { codigo: "5.2.6", resumo: "Alternativa textual para conteúdo de mídia temporizada usado como imagem" },
      { codigo: "5.9.16", resumo: "Alternativa textual em campos de formulário do tipo imagem (image button)" },
    ],
    roteiroTesteManual: [
      "Desative o carregamento de imagens no navegador e verifique se o texto alternativo exibido no lugar de cada imagem comunica a mesma informação ou função.",
      "Ative um leitor de tela (NVDA, JAWS ou VoiceOver) e navegue pela página; confirme que imagens decorativas são ignoradas (silenciadas) e imagens informativas são anunciadas com sentido.",
      "Navegue até botões e links que usam apenas ícone ou imagem (sem texto visível) e confirme que o nome anunciado pelo leitor de tela descreve a ação, não apenas o nome do arquivo.",
      "Para gráficos, mapas ou infográficos complexos, verifique se existe uma alternativa textual completa (no próprio texto da página ou em um link próximo) equivalente à informação visual.",
    ],
  },
  {
    id: "1.4.1",
    nome: "Uso de Cores",
    nivel: "A",
    principio: "Perceptível",
    descricaoSimples:
      "A cor não pode ser o único meio usado para transmitir uma informação, indicar uma " +
      "ação necessária, solicitar uma resposta ou distinguir um elemento visual. Sempre deve " +
      "existir um segundo indicador (texto, ícone, sublinhado, padrão) além da cor.",
    palavrasChave: ["cor", "cores", "daltonismo", "informação visual"],
    abnt: [
      {
        codigo: "5.11.1",
        resumo: "A cor não pode ser o único meio de transmitir informação, indicar ação ou distinguir um elemento",
      },
    ],
    roteiroTesteManual: [
      "Ative um simulador de daltonismo (extensão do navegador) ou o modo de escala de cinza do sistema operacional.",
      "Com o simulador ativo, verifique se toda informação transmitida por cor (erro, sucesso, campo obrigatório, status) continua identificável sem a cor.",
      "Confira links no meio de um texto corrido: eles devem ter um segundo indicador (sublinhado, ícone, negrito) além da cor diferente.",
      "Confira gráficos e legendas que usam cor para diferenciar categorias: deve haver também padrão, textura ou rótulo textual.",
    ],
  },
  {
    id: "1.4.3",
    nome: "Contraste Mínimo",
    nivel: "AA",
    principio: "Perceptível",
    descricaoSimples:
      "O texto e sua imagem de fundo precisam ter contraste suficiente para serem lidos por " +
      "pessoas com baixa visão. Texto normal precisa de uma razão de contraste de pelo menos " +
      "4,5:1; texto grande precisa de pelo menos 3:1.",
    palavrasChave: ["contraste", "cor de fundo", "legibilidade", "baixa visão"],
    abnt: [
      { codigo: "5.11.2", resumo: "Contraste mínimo de 4,5:1 entre texto e plano de fundo" },
      { codigo: "5.11.3", resumo: "Exceções de contraste (texto decorativo, logotipos, texto de grande escala)" },
    ],
    roteiroTesteManual: [
      "Use uma ferramenta de verificação de contraste (extensão de navegador ou seletor de cor com cálculo de razão) para medir o contraste entre texto e fundo em pelo menos três pontos da página: corpo de texto, títulos e texto sobreposto a imagens.",
      "Confirme que texto normal atinge no mínimo 4,5:1 e texto grande (≥18pt, ou ≥14pt em negrito) atinge no mínimo 3:1.",
      "Repita a medição nos estados de hover, foco e erro, já que a cor do texto ou do fundo pode mudar dinamicamente nesses estados.",
      "Se o produto tiver modo escuro, repita a checagem também nesse tema.",
    ],
  },
  {
    id: "1.4.11",
    nome: "Contraste Não Textual",
    nivel: "AA",
    principio: "Perceptível",
    descricaoSimples:
      "Elementos gráficos que não são texto — como bordas de campos de formulário, ícones de " +
      "estado, indicadores de foco e partes essenciais de gráficos — precisam ter uma razão de " +
      "contraste de pelo menos 3:1 contra as cores adjacentes.",
    palavrasChave: ["contraste", "ícone", "borda", "componente", "gráfico não textual"],
    abnt: [
      { codigo: "5.11.4", resumo: "Contraste mínimo de 3:1 para componentes de interface (bordas de campos, ícones de estado)" },
      { codigo: "5.11.5", resumo: "Contraste mínimo de 3:1 para elementos gráficos essenciais à compreensão" },
      { codigo: "5.11.6", resumo: "Exceções de contraste para elementos inativos, decorativos ou sem alternativa visual" },
    ],
    roteiroTesteManual: [
      "Meça o contraste das bordas de campos de formulário, ícones de erro/sucesso e controles customizados (checkbox, radio, switch) contra o fundo adjacente; a razão mínima esperada é 3:1.",
      "Navegue pelos controles usando apenas o teclado e confirme visualmente que o indicador de foco (contorno) também atinge 3:1 de contraste contra o fundo em todos os temas do produto.",
      "Verifique ícones usados sozinhos em botões (sem texto) e partes essenciais de gráficos com a mesma régua de 3:1.",
    ],
  },
  {
    id: "2.1.1",
    nome: "Teclado",
    nivel: "A",
    principio: "Operável",
    descricaoSimples:
      "Toda funcionalidade da interface precisa poder ser operada usando somente o teclado, " +
      "sem exigir tempos de tecla específicos, e sem depender de mouse, gestos de toque ou " +
      "hover para ser alcançada.",
    palavrasChave: ["teclado", "tab", "navegação por teclado", "atalho"],
    abnt: [
      { codigo: "5.1.5", resumo: "Toda funcionalidade operável por mouse também deve ser operável por teclado" },
      { codigo: "5.1.12", resumo: "Ausência de armadilhas de teclado (o foco não pode ficar preso em um componente)" },
      { codigo: "5.1.13", resumo: "Atalhos de teclado de tecla única devem poder ser desativados ou remapeados" },
      { codigo: "5.1.15", resumo: "Ordem de tabulação lógica e previsível entre os elementos da página" },
    ],
    roteiroTesteManual: [
      "Guarde o mouse. Usando apenas Tab, Shift+Tab, Enter, Espaço e as setas, tente executar a tarefa principal da página (abrir menu, preencher e enviar formulário, fechar um modal, operar um carrossel).",
      "Verifique se nenhum elemento interativo é alcançável apenas por hover do mouse (ex.: submenus que só aparecem com mouseover e nunca com foco de teclado).",
      "Ao entrar em um modal, verifique se o foco fica contido dentro dele enquanto estiver aberto e se Esc ou um botão fecha o modal devolvendo o foco a um ponto lógico da página.",
      "Teste atalhos de teclado próprios da aplicação com um leitor de tela ativo, para garantir que eles não conflitam com os comandos do próprio leitor de tela.",
    ],
  },
  {
    id: "2.4.7",
    nome: "Foco Visível",
    nivel: "AA",
    principio: "Operável",
    descricaoSimples:
      "Qualquer interface operável pelo teclado precisa ter um modo de tornar visível qual " +
      "elemento está com o foco no momento, para que quem navega por teclado saiba sempre " +
      "onde está.",
    palavrasChave: ["foco", "indicador de foco", "outline", "navegação por teclado"],
    abnt: [
      { codigo: "5.1.1", resumo: "Indicador de foco visível em todo elemento interativo navegável por teclado" },
    ],
    roteiroTesteManual: [
      "Navegue a página inteira usando somente Tab/Shift+Tab e observe se cada elemento focável exibe um indicador visual claro (contorno, sombra ou mudança de cor perceptível).",
      "Verifique se algum componente remove o indicador padrão do navegador (ex.: `outline: none`) sem colocar um indicador substituto igualmente perceptível.",
      "Confirme que o indicador de foco é visível tanto em fundos claros quanto escuros e sobre imagens, e também nos componentes customizados (não só nos nativos do HTML).",
    ],
  },
  {
    id: "2.5.8",
    nome: "Tamanho do Alvo (Mínimo)",
    nivel: "AA",
    principio: "Operável",
    descricaoSimples:
      "Alvos de clique ou toque (botões, links, controles) precisam ter uma área mínima de " +
      "24 por 24 pixels CSS, exceto em algumas situações específicas (alvo em linha de texto, " +
      "controle equivalente disponível, ou espaçamento suficiente entre alvos vizinhos).",
    palavrasChave: ["alvo", "área de toque", "tamanho do botão", "toque", "clique"],
    abnt: [
      { codigo: "5.8.6", resumo: "Área mínima do alvo de toque/clique de 24 por 24 pixels CSS" },
      { codigo: "5.8.7", resumo: "Exceções ao tamanho mínimo do alvo (alvo em linha de texto, controle equivalente, espaçamento suficiente)" },
    ],
    roteiroTesteManual: [
      "Em um dispositivo touch real ou no modo de emulação de toque do navegador, tente tocar em botões, links de ícone, checkboxes e itens de menu pequenos, observando se a área clicável parece confortável (aproximadamente 24x24 px CSS ou mais).",
      "Quando o alvo visual for menor que 24x24 px, verifique se existe uma área de toque invisível maior compensando, ou espaçamento suficiente entre ele e os alvos vizinhos.",
      "Preste atenção especial a ícones de fechar ('x'), controles de carrossel e barras de ferramentas com muitos ícones próximos entre si.",
    ],
  },
  {
    id: "3.3.1",
    nome: "Identificação do Erro",
    nivel: "A",
    principio: "Compreensível",
    descricaoSimples:
      "Quando um erro de entrada é detectado automaticamente em um formulário, o item com " +
      "erro precisa ser identificado e o problema descrito ao usuário em texto, não apenas " +
      "com cor ou ícone.",
    palavrasChave: ["erro", "validação", "formulário", "mensagem de erro"],
    abnt: [
      { codigo: "5.9.9", resumo: "Identificação textual do campo com erro e descrição do problema encontrado" },
    ],
    roteiroTesteManual: [
      "Preencha um formulário de propósito com dados inválidos (campo obrigatório vazio, formato incorreto) e envie.",
      "Com um leitor de tela ativo, confirme que o erro é anunciado automaticamente perto do envio (sem precisar navegar manualmente para 'descobrir' onde está o erro).",
      "Verifique se a mensagem de erro está em texto, descreve qual campo e qual é o problema, e não depende só de cor vermelha ou de um ícone para ser percebida.",
      "Confirme que a mensagem de erro fica associada programaticamente ao campo (por exemplo, é possível chegar nela pela navegação do leitor de tela a partir do próprio campo).",
    ],
  },
  {
    id: "3.3.2",
    nome: "Rótulos ou Instruções",
    nivel: "A",
    principio: "Compreensível",
    descricaoSimples:
      "Quando o conteúdo exige que o usuário forneça uma entrada, rótulos ou instruções " +
      "precisam ser fornecidos para que a pessoa saiba o que preencher, incluindo formato " +
      "esperado e quais campos são obrigatórios.",
    palavrasChave: ["rótulo", "label", "instrução", "formulário", "campo obrigatório"],
    abnt: [
      { codigo: "5.1.16", resumo: "Rótulo ou instrução disponível e associado ao componente também via teclado" },
      { codigo: "5.9.2", resumo: "Rótulo (label) visível e programaticamente associado a todo campo de formulário" },
      { codigo: "5.9.5", resumo: "Instruções de formato exigido fornecidas antes do envio do formulário" },
      { codigo: "5.9.7", resumo: "Indicação clara de quais campos são obrigatórios" },
    ],
    roteiroTesteManual: [
      "Navegue o formulário com Tab e, a cada campo, confirme com um leitor de tela que o rótulo (label) é anunciado junto com o campo.",
      "Verifique se instruções de formato (por exemplo 'dd/mm/aaaa') aparecem antes de o usuário errar, e se estão associadas programaticamente ao campo, não apenas soltas visualmente ao lado.",
      "Confirme se campos obrigatórios são identificados tanto visualmente quanto pelo leitor de tela (não somente com um asterisco vermelho sem texto equivalente).",
    ],
  },
  {
    id: "4.1.2",
    nome: "Nome, Função, Valor",
    nivel: "A",
    principio: "Robusto",
    descricaoSimples:
      "Todo componente de interface (em especial os customizados, feitos com `<div>`/`<span>` " +
      "e JavaScript) precisa expor corretamente para a tecnologia assistiva seu nome, sua " +
      "função (role) e seu valor/estado atual, e notificar mudanças de estado.",
    palavrasChave: ["nome acessível", "role", "aria", "componente customizado", "estado"],
    abnt: [
      { codigo: "5.4.5", resumo: "Nome acessível (accessible name) definido para todo componente de interface" },
      { codigo: "5.8.3", resumo: "Função (role) e estado programaticamente determináveis para controles customizados" },
      { codigo: "5.9.1", resumo: "Nome, função e valor expostos corretamente para campos de formulário" },
      { codigo: "5.13.4", resumo: "Uso de padrões de nome/função/valor (ARIA) quando o HTML nativo não é suficiente" },
      { codigo: "5.13.10", resumo: "Mudanças de estado (selecionado, expandido, pressionado) comunicadas à tecnologia assistiva" },
      { codigo: "5.13.12", resumo: "Mensagens de status comunicadas sem exigir mudança de foco (ex.: região 'aria-live')" },
      { codigo: "5.13.13", resumo: "Valor atual de controles como sliders e barras de progresso exposto programaticamente" },
    ],
    roteiroTesteManual: [
      "Com um leitor de tela, navegue por todo componente interativo customizado (botões de ícone, abas, acordeões, sliders, checkboxes estilizados) e confirme que o nome anunciado descreve a função dele.",
      "Confirme que a função (role) é anunciada corretamente (por exemplo 'botão', 'aba', 'caixa de seleção marcada') mesmo quando o componente é construído com `<div>`/`<span>` mais JavaScript, em vez de elementos HTML nativos.",
      "Altere o estado do componente (marcar um checkbox, expandir um acordeão, mover um slider) e confirme que o leitor de tela anuncia a mudança de estado ou de valor sem que seja preciso mover o foco de novo.",
      "Use a árvore de acessibilidade (Accessibility Tree) das ferramentas de desenvolvedor do navegador para conferir se nome, função e valor batem com o que está sendo anunciado pelo leitor de tela.",
    ],
  },
];
