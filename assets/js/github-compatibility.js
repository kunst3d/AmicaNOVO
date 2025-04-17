/**
 * github-compatibility.js
 * Script para garantir compatibilidade do relatório com o GitHub Pages.
 * Este script é carregado apenas quando o site está hospedado no GitHub Pages.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Verifica se estamos no GitHub Pages
  if (!window.location.hostname.includes('github.io')) {
    return; // Só continua se estiver no GitHub Pages
  }
  
  console.log('Modo de compatibilidade GitHub Pages ativado');
  
  // Configuração e inicialização
  const debug = true; // Ativa logs detalhados
  
  // Adiciona classe ao body para aplicar estilos específicos
  document.body.classList.add('github-pages-mode');
  
  // Oculta explicitamente os avisos de protocolo file://
  const fileProtocolWarning = document.querySelector('.file-protocol-warning');
  if (fileProtocolWarning) {
    fileProtocolWarning.style.display = 'none';
    if (debug) console.log('GitHub Pages: Ocultando aviso de protocolo file://');
  }
  
  const importantNotice = document.querySelector('.important-notice');
  if (importantNotice) {
    importantNotice.style.display = 'none';
    if (debug) console.log('GitHub Pages: Ocultando aviso importante de acesso local');
  }
  
  // Mapeia as seções para os arquivos HTML correspondentes
  const sectionContentMapping = {
    'sumario-executivo': 'content/sumario-executivo.html',
    'analise-mercado': 'content/analise-mercado.html',
    'analise-concorrencia': 'content/analise-concorrencia.html',
    'publico-alvo': 'content/publico-alvo.html',
    'precificacao-custos': 'content/precificacao-custos.html',
    'marketplaces': 'content/marketplaces.html',
    'ecommerce-proprio': 'content/ecommerce-proprio.html',
    'redes-sociais': 'content/redes-sociais.html',
    'fidelizacao-clientes': 'content/fidelizacao-clientes.html',
    'plano-expansao': 'content/plano-expansao.html',
    'analise-riscos': 'content/analise-riscos.html',
    'conclusao-recomendacoes': 'content/conclusao-recomendacoes.html'
  };
  
  // Função para tentar carregar todos os conteúdos diretamente
  function loadAllContentDirectly() {
    if (debug) console.log('Tentando carregar todo o conteúdo diretamente');
    
    // Para cada seção, tenta carregar o conteúdo correspondente
    Object.keys(sectionContentMapping).forEach(sectionId => {
      loadSectionContent(sectionId);
    });
  }
  
  // Função para carregar o conteúdo de uma seção específica
  function loadSectionContent(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) {
      if (debug) console.error(`Seção não encontrada: ${sectionId}`);
      return;
    }
    
    const contentPlaceholder = section.querySelector('.section-content-placeholder');
    if (!contentPlaceholder) {
      if (debug) console.error(`Placeholder de conteúdo não encontrado na seção ${sectionId}`);
      return;
    }
    
    if (debug) console.log(`Tentando carregar conteúdo para: ${sectionId}`);
    
    // Primeira abordagem: conteúdo estático embutido
    const staticContent = createStaticContent(sectionId);
    contentPlaceholder.innerHTML = staticContent;
    
    // Remover os atributos display:none para que as seções sejam visíveis
    section.style.display = 'block';
  }
  
  // Criar conteúdo estático para cada seção
  function createStaticContent(sectionId) {
    // Conteúdo específico para cada seção
    const contents = {
      'sumario-executivo': `
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
      `,
      'analise-mercado': `
        <div class="subsection" id="panorama-setor">
          <div class="subsection__header">
            <h2 class="subsection__title">Panorama do Setor</h2>
            <p class="subsection__description">O mercado de semijoias no Brasil representa uma oportunidade significativa, sendo parte de um setor global que movimenta US$ 49,5 bilhões anualmente. As semijoias funcionam como alternativa acessível às joias tradicionais, utilizando metais não-preciosos (latão, cobre, zinco) com banhos de metais nobres (ouro, prata, ródio).</p>
          </div>
          
          <div class="content-card">
            <div class="content-card__header">
              <h3 class="content-card__title">Cenário Atual no Brasil</h3>
            </div>
            <div class="content-card__body">
              <ul class="feature-list">
                <li class="feature-list__item">
                  <div class="feature-list__icon">
                    <span class="icon-location"></span>
                  </div>
                  <div class="feature-list__content">
                    <strong>Polos produtores</strong>: Limeira (SP) concentra 60% da produção nacional com cerca de 500 empresas formais e 2.000 informais, seguida por Guaporé (RS) e Juazeiro do Norte (CE)
                  </div>
                </li>
                <li class="feature-list__item">
                  <div class="feature-list__icon">
                    <span class="icon-technology"></span>
                  </div>
                  <div class="feature-list__content">
                    <strong>Evolução tecnológica</strong>: Processos galvânicos avançados aumentaram a durabilidade das peças de 6 meses (década de 1990) para até 3 anos atualmente
                  </div>
                </li>
                <li class="feature-list__item">
                  <div class="feature-list__icon">
                    <span class="icon-design"></span>
                  </div>
                  <div class="feature-list__content">
                    <strong>Design brasileiro</strong>: Desenvolvimento de identidade própria, com reconhecimento internacional em feiras como Bijorhca (Paris) e hktdc (Hong Kong)
                  </div>
                </li>
                <li class="feature-list__item">
                  <div class="feature-list__icon">
                    <span class="icon-digital"></span>
                  </div>
                  <div class="feature-list__content">
                    <strong>Adaptação digital</strong>: 78% das empresas aceleraram a digitalização após a pandemia, com 62% diversificando canais de venda
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="content-card">
            <div class="content-card__header">
              <h3 class="content-card__title">Crescimento do Mercado</h3>
            </div>
            <div class="content-card__body">
              <p>O mercado de semijoias no Brasil cresceu consistentemente nos últimos anos, apresentando taxa média de crescimento anual de 8,5% entre 2017 e 2023, mesmo com os desafios da pandemia.</p>
              <p>As projeções indicam continuação deste crescimento, impulsionado pela valorização do consumo consciente e pela busca por acessórios que combinem qualidade e preço acessível.</p>
              
              <ul class="feature-list">
                <li class="feature-list__item">
                  <div class="feature-list__icon">
                    <span class="icon-growth"></span>
                  </div>
                  <div class="feature-list__content">
                    <strong>Crescimento acelerado</strong>: Aumento de 21,9% nas vendas em 2023, com projeção de crescimento médio anual de 15,7% até 2027
                  </div>
                </li>
                <li class="feature-list__item">
                  <div class="feature-list__icon">
                    <span class="icon-ecommerce"></span>
                  </div>
                  <div class="feature-list__content">
                    <strong>E-commerce em expansão</strong>: Canal digital representa 32% das vendas, com crescimento 2,3x superior ao varejo físico
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="subsection" id="tendencias-emergentes">
          <div class="subsection__header">
            <h2 class="subsection__title">Tendências Emergentes</h2>
            <p class="subsection__description">Análise das principais tendências que estão moldando o futuro do mercado de semijoias.</p>
          </div>
          
          <div class="content-card">
            <div class="content-card__body">
              <ul class="feature-list">
                <li class="feature-list__item">
                  <div class="feature-list__icon">
                    <span class="icon-sustainability"></span>
                  </div>
                  <div class="feature-list__content">
                    <strong>Sustentabilidade</strong>: Aumento de 185% nas buscas por "semijoias sustentáveis" (2019-2023)
                  </div>
                </li>
                <li class="feature-list__item">
                  <div class="feature-list__icon">
                    <span class="icon-personalization"></span>
                  </div>
                  <div class="feature-list__content">
                    <strong>Personalização</strong>: 67% dos consumidores pagam mais por peças personalizadas
                  </div>
                </li>
                <li class="feature-list__item">
                  <div class="feature-list__icon">
                    <span class="icon-male"></span>
                  </div>
                  <div class="feature-list__content">
                    <strong>Crescimento masculino</strong>: Segmento representa 26% do mercado, com crescimento 40% superior ao feminino
                  </div>
                </li>
                <li class="feature-list__item">
                  <div class="feature-list__icon">
                    <span class="icon-gender"></span>
                  </div>
                  <div class="feature-list__content">
                    <strong>Genderless jewelry</strong>: Aumento de 78% nas buscas por "joias unissex"
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      `,
      'analise-concorrencia': `
        <div class="subsection">
          <div class="subsection__header">
            <h2 class="subsection__title">Análise Competitiva</h2>
          </div>
          <div class="content-card">
            <div class="content-card__body">
              <p>O mercado de semijoias está segmentado entre marcas premium estabelecidas (Vivara, Pandora), 
              marcas digitais de crescimento acelerado (Francisca Joias, Lolla) e marcas de nicho sustentável.</p>
              <p>Oportunidade para a Amica: desenvolver posicionamento claro que combine qualidade premium com 
              valores de sustentabilidade, diferenciando-se com design contemporâneo e responsabilidade ambiental.</p>
            </div>
          </div>
        </div>
      `,
      'publico-alvo': `
        <div class="subsection">
          <div class="subsection__header">
            <h2 class="subsection__title">Segmentação de Consumidores</h2>
          </div>
          <div class="content-card">
            <div class="content-card__body">
              <p>O público-alvo primário da Amica são mulheres entre 25-45 anos, classes A/B, com formação superior, 
              que valorizam tanto estética quanto ética em suas compras.</p>
              <p>Este segmento busca qualidade e design, mas também se preocupa com o impacto social e ambiental 
              das marcas que consome, estando disposto a pagar mais por produtos alinhados com seus valores.</p>
            </div>
          </div>
        </div>
      `,
      'precificacao-custos': `
        <div class="subsection">
          <div class="subsection__header">
            <h2 class="subsection__title">Estratégia de Preços</h2>
          </div>
          <div class="content-card">
            <div class="content-card__body">
              <p>A estratégia de precificação recomendada posiciona a Amica no segmento premium-acessível, com preços 
              entre R$150 e R$450 para a maioria das peças da coleção principal.</p>
              <p>Esta faixa permite margens saudáveis (40-60%) mesmo considerando custos de materiais de qualidade, 
              mão de obra especializada e investimentos em marketing digital.</p>
            </div>
          </div>
        </div>
      `,
      'marketplaces': `
        <div class="subsection">
          <div class="subsection__header">
            <h2 class="subsection__title">Estratégia para Marketplaces</h2>
          </div>
          <div class="content-card">
            <div class="content-card__body">
              <p>Os marketplaces representam o canal mais eficiente para entrada inicial no mercado, com destaque para 
              Amazon, Mercado Livre e Dafiti como plataformas prioritárias.</p>
              <p>Recomenda-se início com catálogo essencial (30-40 SKUs) e expansão gradual conforme análise de desempenho, 
              mantendo controle rigoroso sobre apresentação do produto e experiência do cliente mesmo dentro do marketplace.</p>
            </div>
          </div>
        </div>
      `,
      'ecommerce-proprio': `
        <div class="subsection">
          <div class="subsection__header">
            <h2 class="subsection__title">E-commerce Próprio</h2>
          </div>
          <div class="content-card">
            <div class="content-card__body">
              <p>O desenvolvimento de e-commerce próprio deve ocorrer paralelamente à operação em marketplaces, 
              priorizando experiência premium, storytelling da marca e recursos de personalização.</p>
              <p>Recomenda-se plataforma WooCommerce ou Shopify, com investimento inicial de R$15-25 mil e 
              equipe dedicada para atendimento ao cliente e gestão de conteúdo.</p>
            </div>
          </div>
        </div>
      `,
      'redes-sociais': `
        <div class="subsection">
          <div class="subsection__header">
            <h2 class="subsection__title">Presença Digital</h2>
          </div>
          <div class="content-card">
            <div class="content-card__body">
              <p>Instagram e Pinterest devem ser os canais prioritários, complementados por TikTok para 
              atingir público mais jovem e LinkedIn para comunicação B2B e institucioanl.</p>
              <p>A estratégia deve combinar conteúdo aspiracional (lifestyle, tendências) com educativo 
              (processo de fabricação, diferencial das semijoias) e colaborações com microinfluenciadoras 
              alinhadas aos valores da marca.</p>
            </div>
          </div>
        </div>
      `,
      'fidelizacao-clientes': `
        <div class="subsection">
          <div class="subsection__header">
            <h2 class="subsection__title">Programa de Fidelização</h2>
          </div>
          <div class="content-card">
            <div class="content-card__body">
              <p>O programa de fidelidade "Amica Club" deve oferecer benefícios exclusivos como acesso antecipado 
              a lançamentos, serviços de manutenção gratuitos e personalização de peças.</p>
              <p>A estratégia de CRM deve incluir segmentação avançada para comunicações personalizadas e 
              campanhas de reativação baseadas no histórico de compras e interesses específicos.</p>
            </div>
          </div>
        </div>
      `,
      'plano-expansao': `
        <div class="subsection">
          <div class="subsection__header">
            <h2 class="subsection__title">Expansão Gradual</h2>
          </div>
          <div class="content-card">
            <div class="content-card__body">
              <p>Plano de 36 meses dividido em três fases: Estabelecimento (marketplaces e branding), 
              Crescimento (e-commerce próprio e primeira coleção completa) e Expansão (pontos físicos e internacional).</p>
              <p>Cada fase possui KPIs específicos e gatilhos de progressão, permitindo ajustes 
              estratégicos baseados em desempenho real e feedback do mercado.</p>
            </div>
          </div>
        </div>
      `,
      'analise-riscos': `
        <div class="subsection">
          <div class="subsection__header">
            <h2 class="subsection__title">Gestão de Riscos</h2>
          </div>
          <div class="content-card">
            <div class="content-card__body">
              <p>Os principais riscos identificados incluem oscilações nos custos de matéria-prima, 
              intensificação da concorrência e desafios logísticos para entregas nacionais.</p>
              <p>Estratégias de mitigação incluem diversificação de fornecedores, monitoramento constante 
              do posicionamento competitivo e parcerias estratégicas com operadores logísticos.</p>
            </div>
          </div>
        </div>
      `,
      'conclusao-recomendacoes': `
        <div class="subsection">
          <div class="subsection__header">
            <h2 class="subsection__title">Recomendações Finais</h2>
          </div>
          <div class="content-card">
            <div class="content-card__body">
              <p>A Amica tem oportunidade significativa no mercado brasileiro de semijoias, especialmente 
              posicionando-se no segmento premium com compromisso genuíno com sustentabilidade.</p>
              <p>Recomenda-se abordagem omnichannel com entrada via marketplaces, construção simultânea de 
              presença em redes sociais e desenvolvimento progressivo de e-commerce próprio. A execução 
              cuidadosa do plano em três fases permitirá crescimento sustentável com investimento inicial controlado.</p>
            </div>
          </div>
        </div>
      `
    };
    
    // Retorna o conteúdo específico da seção ou um template genérico se não encontrado
    return contents[sectionId] || `
      <div class="subsection">
        <div class="subsection__header">
          <h2 class="subsection__title">${sectionId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>
        </div>
        <div class="content-card">
          <div class="content-card__body">
            <p>O conteúdo para esta seção não está disponível nesta visualização.</p>
            <p>Por favor, selecione outra seção no menu lateral.</p>
          </div>
        </div>
      </div>
    `;
  }
  
  // Alternativa para a navegação entre abas
  function setupStaticNavigation() {
    document.querySelectorAll('.sidebar-nav__link').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remover classe ativa de todos os links
        document.querySelectorAll('.sidebar-nav__link').forEach(l => {
          l.classList.remove('active');
        });
        
        // Adicionar classe ativa ao link clicado
        this.classList.add('active');
        
        // Extrair o ID da seção do href
        const targetId = this.getAttribute('href').substring(1);
        
        // Ocultar todas as seções
        document.querySelectorAll('.content-section').forEach(section => {
          section.style.display = 'none';
        });
        
        // Mostrar a seção alvo
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.style.display = 'block';
          
          // Scroll para o topo da seção
          window.scrollTo(0, 0);
        }
      });
    });
  }
  
  // Inicializar o modo de compatibilidade
  function initCompatibilityMode() {
    // Remover o loading indicator imediatamente
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
    
    // Garantir que a navegação lateral esteja visível
    const sidebar = document.querySelector('.main-nav');
    if (sidebar) {
      sidebar.style.display = 'block';
    }
    
    // Carregar todo o conteúdo diretamente
    loadAllContentDirectly();
    
    // Configurar navegação estática
    setupStaticNavigation();
    
    // Ativar a primeira seção por padrão
    const firstTab = document.querySelector('.sidebar-nav__link');
    if (firstTab) {
      firstTab.click();
    }
    
    if (debug) console.log('Modo de compatibilidade GitHub Pages inicializado com sucesso');
  }
  
  // Iniciar em 500ms para dar tempo de outros scripts carregarem
  setTimeout(initCompatibilityMode, 500);
}); 