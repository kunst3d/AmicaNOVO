/**
 * main.js - Versão simplificada para o Relatório Amica
 * Otimizado para funcionar no GitHub Pages com conteúdo embutido
 */

const AMICA = {
  // Configurações da aplicação
  config: {
    debugMode: true
  },
  
  // Estado da aplicação
  state: {
    currentSection: null,
    isGitHubPages: false
  },
  
  // Inicialização da aplicação
  init: function() {
    console.log("Inicializando aplicação...");
    
    // Verificar se estamos no GitHub Pages
    this.state.isGitHubPages = this.checkIfGitHubPages();
    
    // Configurar base href para GitHub Pages se necessário
    if (this.state.isGitHubPages) {
      console.log("Executando no GitHub Pages, configurando base href");
      document.getElementById('github-notice').style.display = 'block';
      this.setupBaseHref();
    } else {
      document.getElementById('local-notice').style.display = 'block';
    }
    
    // Carregar todo o conteúdo fixo
    this.loadFixedContent();
    
    // Inicializar navegação
    this.setupNavigation();
    
    // Carregar seção inicial baseada na URL ou mostrar a primeira
    this.loadInitialSection();
    
    // Adicionar classe para habilitar animações após carregamento
    document.body.classList.add('is-loaded');
    
    console.log("Relatório Amica inicializado.");
  },
  
  // Verificar se estamos no GitHub Pages
  checkIfGitHubPages: function() {
    const hostname = window.location.hostname;
    return hostname.includes('github.io') || 
           hostname.includes('githubusercontent.com') || 
           hostname.includes('pages.github.com');
  },
  
  // Configurar base href para GitHub Pages
  setupBaseHref: function() {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1) {
      const repoName = pathParts[1];
      if (repoName && repoName !== '') {
        const baseTag = document.createElement('base');
        baseTag.href = `/${repoName}/`;
        document.head.appendChild(baseTag);
        console.log(`Base href configurada para: /${repoName}/`);
      }
    }
  },
  
  // Carregar todo o conteúdo fixo
  loadFixedContent: function() {
    // Este método insere conteúdo fixo em cada seção
    // Para uma versão real, você carregaria dinamicamente o conteúdo de arquivos
    
    // Dados simplificados para cada seção
    const sections = [
      {
        id: 'sumario-executivo',
        title: 'Sumário Executivo',
        content: `
          <div class="section__header">
            <h1 class="section__title">Sumário Executivo</h1>
          </div>
          <div class="subsection" id="visao-geral">
            <div class="subsection__header">
              <h2 class="subsection__title">Visão Geral</h2>
              <p class="subsection__description">Análise estratégica para o lançamento da Amica, marca brasileira de semijoias focada no varejo popular.</p>
            </div>
            <div class="content-card">
              <div class="content-card__body">
                <p>O presente relatório analisa as oportunidades e estratégias para o lançamento da Amica, marca brasileira de semijoias voltada ao varejo popular. Aproveitando a infraestrutura da Simon Joias (empresa com 15 anos de atuação no atacado), a Amica posiciona-se como alternativa de qualidade às importações chinesas, oferecendo design nacional e preços acessíveis.</p>
                <p>A análise indica um mercado de semijoias em crescimento no Brasil (21,9% em 2023), com oportunidades significativas no segmento de varejo digital. Os principais diferenciais competitivos identificados são: produção nacional de qualidade, design contemporâneo e estratégia omnichannel integrada.</p>
              </div>
            </div>
          </div>
          <div class="subsection" id="abordagem-implementacao">
            <div class="subsection__header">
              <h2 class="subsection__title">Abordagem Faseada de Implementação</h2>
              <p class="subsection__description">Estratégia de entrada no mercado dividida em três fases distintas para otimizar recursos e minimizar riscos.</p>
            </div>
            <div class="content-card">
              <div class="content-card__body">
                <ul class="feature-list">
                  <li class="feature-list__item">
                    <div class="feature-list__icon">
                      <span class="icon-phase1"></span>
                    </div>
                    <div class="feature-list__content">
                      <strong>Fase inicial (6 meses)</strong>: Foco em 2-3 marketplaces estratégicos (Shopee e Mercado Livre), desenvolvimento de 50-80 SKUs básicos e estratégia de precificação segmentada
                    </div>
                  </li>
                  <li class="feature-list__item">
                    <div class="feature-list__icon">
                      <span class="icon-phase2"></span>
                    </div>
                    <div class="feature-list__content">
                      <strong>Fase de crescimento (7-12 meses)</strong>: Lançamento de e-commerce próprio, programa de fidelidade e expansão de portfólio
                    </div>
                  </li>
                  <li class="feature-list__item">
                    <div class="feature-list__icon">
                      <span class="icon-phase3"></span>
                    </div>
                    <div class="feature-list__content">
                      <strong>Fase de consolidação (13-24 meses)</strong>: Desenvolvimento de clube de assinatura, possibilidade de loja conceito e avaliação para expansão internacional
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="subsection" id="projecoes-financeiras">
            <div class="subsection__header">
              <h2 class="subsection__title">Projeções Financeiras</h2>
              <p class="subsection__description">Previsões de performance financeira baseadas em benchmarks do setor e análises de mercado.</p>
            </div>
            <div class="content-card">
              <div class="content-card__body">
                <p>Com base nas projeções financeiras, estima-se um faturamento de R$ 150-200 mil mensais após 12 meses de operação, com margem líquida entre 22-26%. O relatório detalha as estratégias específicas para cada área operacional e mercadológica.</p>
                <div class="metrics-grid">
                  <div class="metric-card">
                    <div class="metric-card__header">
                      <h4 class="metric-card__title">Faturamento (12 meses)</h4>
                    </div>
                    <div class="metric-card__value">R$ 150-200K</div>
                    <div class="metric-card__description">mensal</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-card__header">
                      <h4 class="metric-card__title">Margem Líquida</h4>
                    </div>
                    <div class="metric-card__value">22-26%</div>
                    <div class="metric-card__description">após consolidação</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-card__header">
                      <h4 class="metric-card__title">ROI 24 meses</h4>
                    </div>
                    <div class="metric-card__value">185%</div>
                    <div class="metric-card__description">sobre investimento inicial</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-card__header">
                      <h4 class="metric-card__title">Payback</h4>
                    </div>
                    <div class="metric-card__value">18 meses</div>
                    <div class="metric-card__description">tempo de recuperação</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        id: 'analise-mercado',
        title: 'Análise de Mercado',
        content: `
          <div class="section__header">
            <h1 class="section__title">Análise de Mercado</h1>
          </div>
          <div class="subsection" id="panorama-geral">
            <div class="subsection__header">
              <h2 class="subsection__title">Panorama Geral</h2>
              <p class="subsection__description">Análise macroeconômica e tendências do mercado brasileiro de semijoias.</p>
            </div>
            <div class="content-card">
              <div class="content-card__body">
                <p>O mercado brasileiro de semijoias tem apresentado crescimento constante nos últimos anos, mesmo diante de cenários econômicos desafiadores. Dados da IBGM (Instituto Brasileiro de Gemas e Metais Preciosos) e da AJESP (Associação dos Joalheiros do Estado de São Paulo) indicam um crescimento médio anual de 7,2% entre 2018 e 2022, com aceleração para 21,9% em 2023.</p>
                <div class="chart-card">
                  <div class="chart-card__header">
                    <h3 class="chart-card__title">Crescimento anual do mercado de semijoias no Brasil (%)</h3>
                  </div>
                  <div class="chart-card__body">
                    <canvas id="crescimentoVendas"></canvas>
                  </div>
                  <div class="chart-card__footer">
                    <div class="chart-data" data-chart="crescimentoVendas" data-type="line" hidden>
                      {
                        "labels": ["2018", "2019", "2020", "2021", "2022", "2023", "2024*"],
                        "datasets": [
                          {
                            "label": "Crescimento Anual (%)",
                            "data": [5.4, 8.2, -3.7, 12.6, 13.5, 21.9, 17.2],
                            "borderColor": "var(--color-primary)",
                            "backgroundColor": "rgba(166, 124, 82, 0.1)",
                            "borderWidth": 2,
                            "fill": true,
                            "tension": 0.3
                          }
                        ]
                      }
                    </div>
                    <div class="chart-legend">Fontes: IBGM, AJESP, 2023 | *Projeção</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="content-card">
              <div class="content-card__header">
                <h3 class="content-card__title">Principais Tendências do Mercado</h3>
              </div>
              <div class="content-card__body">
                <p>A análise de tendências conduzida pela consultoria McKinsey e relatórios setoriais da Euromonitor International destacam mudanças significativas no comportamento do consumidor e na estrutura do mercado:</p>
                <ul class="feature-list">
                  <li class="feature-list__item">
                    <strong>Digitalização acelerada:</strong> Crescimento de 147% nas vendas online de semijoias entre 2019 e 2023
                  </li>
                  <li class="feature-list__item">
                    <strong>Valorização do produto nacional:</strong> 72% dos consumidores preferem marcas brasileiras quando informados sobre a origem
                  </li>
                  <li class="feature-list__item">
                    <strong>Demanda por transparência:</strong> 68% consideram importante conhecer a procedência dos materiais e processos de fabricação
                  </li>
                  <li class="feature-list__item">
                    <strong>Experiência omnichannel:</strong> 84% dos compradores pesquisam online antes da compra, mesmo quando finalizada em loja física
                  </li>
                  <li class="feature-list__item">
                    <strong>Crescimento dos marketplaces:</strong> Representam 42% do faturamento online do setor em 2023, contra 28% em 2019
                  </li>
                </ul>
                <div class="chart-card">
                  <div class="chart-card__header">
                    <h3 class="chart-card__title">Participação de mercado por canal de venda (%)</h3>
                  </div>
                  <div class="chart-card__body">
                    <canvas id="participacaoMercado"></canvas>
                  </div>
                  <div class="chart-card__footer">
                    <div class="chart-data" data-chart="participacaoMercado" data-type="doughnut" hidden>
                      {
                        "labels": ["Lojas físicas multimarcas", "Marketplaces", "E-commerce próprio", "Lojas próprias", "Revendedores diretos", "Outros"],
                        "datasets": [
                          {
                            "data": [31, 28, 19, 12, 8, 2],
                            "backgroundColor": [
                              "var(--color-primary)",
                              "var(--color-secondary)",
                              "var(--color-tertiary)",
                              "var(--color-accent1)",
                              "var(--color-accent2)",
                              "var(--color-neutral)"
                            ]
                          }
                        ]
                      }
                    </div>
                    <div class="chart-legend">Fonte: IBGM, Euromonitor, 2023</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="subsection" id="comportamento-consumidor">
            <div class="subsection__header">
              <h2 class="subsection__title">Comportamento do Consumidor</h2>
              <p class="subsection__description">Análise dos hábitos e preferências do consumidor brasileiro de semijoias.</p>
            </div>
            <div class="content-card">
              <div class="content-card__header">
                <h3 class="content-card__title">Fatores Decisivos na Compra</h3>
              </div>
              <div class="content-card__body">
                <p>De acordo com pesquisas conduzidas pelo Instituto QualiBest, NielsenIQ e Opinion Box com mais de 3.500 consumidores em 2023, os seguintes fatores influenciam a decisão de compra:</p>
                <div class="chart-card">
                  <div class="chart-card__header">
                    <h3 class="chart-card__title">Importância dos fatores na decisão de compra (0-10)</h3>
                  </div>
                  <div class="chart-card__body">
                    <canvas id="fatoresDecisao"></canvas>
                  </div>
                  <div class="chart-card__footer">
                    <div class="chart-data" data-chart="fatoresDecisao" data-type="bar" hidden>
                      {
                        "labels": ["Preço", "Qualidade percebida", "Design exclusivo", "Durabilidade", "Reputação da marca", "Facilidade de troca", "Tempo de entrega", "Sustentabilidade"],
                        "datasets": [
                          {
                            "label": "Importância média (0-10)",
                            "data": [8.7, 8.4, 7.9, 7.6, 6.8, 6.5, 6.2, 5.4],
                            "backgroundColor": "var(--color-primary)"
                          }
                        ]
                      }
                    </div>
                    <div class="chart-legend">Fonte: Instituto QualiBest, NielsenIQ, Opinion Box, 2023</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
      },
      // Adicione conteúdo estático para outras seções aqui...
    ];
    
    // Inserir o conteúdo fixo em cada seção
    sections.forEach(section => {
      const sectionElement = document.getElementById(section.id);
      if (sectionElement) {
        const placeholderElement = sectionElement.querySelector('.section-content-placeholder');
        if (placeholderElement) {
          placeholderElement.innerHTML = section.content;
        }
      }
    });
    
    // Inicializar gráficos
    setTimeout(() => {
      this.initAllCharts();
    }, 500);
  },
  
  // Inicializar todos os gráficos na página
  initAllCharts: function() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js não está disponível');
      return;
    }
    
    const chartDataElements = document.querySelectorAll('.chart-data');
    console.log(`Encontrados ${chartDataElements.length} elementos de dados de gráficos`);
    
    chartDataElements.forEach(dataElement => {
      try {
        const chartId = dataElement.getAttribute('data-chart');
        const chartType = dataElement.getAttribute('data-type') || 'bar';
        const chartCanvas = document.getElementById(chartId);
        
        if (!chartCanvas) {
          console.warn(`Canvas #${chartId} não encontrado para gráfico`);
          return;
        }
        
        console.log(`Inicializando gráfico ${chartId} do tipo ${chartType}`);
        
        let chartData;
        try {
          chartData = JSON.parse(dataElement.textContent.trim());
        } catch (parseError) {
          console.error(`Erro ao fazer parse dos dados do gráfico ${chartId}:`, parseError);
          console.log('Conteúdo do elemento de dados:', dataElement.textContent);
          return;
        }
        
        // Verificar se já existe um gráfico neste canvas
        if (chartCanvas._chart) {
          chartCanvas._chart.destroy();
        }
        
        // Criar o gráfico
        chartCanvas._chart = new Chart(chartCanvas, {
          type: chartType,
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: true
          }
        });
        
        console.log(`Gráfico ${chartId} inicializado com sucesso`);
      } catch (error) {
        console.error('Erro ao inicializar gráfico:', error);
      }
    });
  },
  
  // Configurar navegação
  setupNavigation: function() {
    // Selecionar links de navegação
    const navLinks = document.querySelectorAll('.sidebar-nav__link');
    
    // Adicionar evento de clique a cada link
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Obter o ID da seção do atributo href
        const sectionId = link.getAttribute('href').substring(1);
        
        // Remover classe ativa de todos os links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Adicionar classe ativa ao link clicado
        link.classList.add('active');
        
        // Mostrar a seção correspondente
        this.showSection(sectionId);
        
        // Atualizar URL
        window.location.hash = sectionId;
      });
    });
    
    // Lidar com navegação através do hash na URL
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        this.showSection(hash);
        
        // Atualizar link ativo
        const activeLink = document.querySelector(`.sidebar-nav__link[href="#${hash}"]`);
        if (activeLink) {
          navLinks.forEach(l => l.classList.remove('active'));
          activeLink.classList.add('active');
        }
      }
    });
  },
  
  // Mostrar uma seção específica
  showSection: function(sectionId) {
    // Atualizar estado
    this.state.currentSection = sectionId;
    
    // Ocultar todas as seções
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
      section.style.display = 'none';
    });
    
    // Mostrar a seção solicitada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.style.display = 'block';
      
      // Rolar para o topo
      window.scrollTo(0, 0);
      
      console.log(`Seção exibida: ${sectionId}`);
    } else {
      console.error(`Seção não encontrada: ${sectionId}`);
    }
  },
  
  // Carregar seção inicial baseada na URL ou mostrar a primeira
  loadInitialSection: function() {
    let initialSection;
    
    // Verificar se há um hash na URL
    if (window.location.hash) {
      initialSection = window.location.hash.substring(1);
      console.log(`Usando hash da URL: ${initialSection}`);
    } else {
      // Caso contrário, usar a primeira seção
      const firstLink = document.querySelector('.sidebar-nav__link');
      if (firstLink) {
        initialSection = firstLink.getAttribute('href').substring(1);
        console.log(`Usando primeira seção do menu: ${initialSection}`);
      }
    }
    
    if (initialSection) {
      // Mostrar a seção inicial
      this.showSection(initialSection);
      
      // Atualizar o link ativo
      const activeLink = document.querySelector(`.sidebar-nav__link[href="#${initialSection}"]`);
      if (activeLink) {
        document.querySelectorAll('.sidebar-nav__link').forEach(l => l.classList.remove('active'));
        activeLink.classList.add('active');
      }
    } else {
      console.warn('Não foi possível determinar a seção inicial');
    }
  }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  AMICA.init();
});
