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
        <div class="subsection">
          <div class="subsection__header">
            <h2 class="subsection__title">Sumário Executivo</h2>
          </div>
          <div class="content-card">
            <div class="content-card__body">
              <p>O mercado de semijoias no Brasil apresenta crescimento constante, com projeção de expansão contínua até 2030. 
              A Amica tem a oportunidade de se posicionar como marca premium focada em qualidade e sustentabilidade.</p>
              
              <p>Este relatório recomenda uma estratégia digital multicanal, priorizando marketplace para entrada rápida no mercado e
              desenvolvimento simultâneo de presença própria em redes sociais e e-commerce.</p>
            </div>
          </div>
        </div>
      `,
      'analise-mercado': `
        <div class="subsection">
          <div class="subsection__header">
            <h2 class="subsection__title">Crescimento do Mercado</h2>
          </div>
          <div class="content-card">
            <div class="content-card__body">
              <p>O mercado de semijoias no Brasil cresceu consistentemente nos últimos anos, apresentando taxa média de crescimento anual de 8,5% 
              entre 2017 e 2023, mesmo com os desafios da pandemia.</p>
              <p>As projeções indicam continuação deste crescimento, impulsionado pela valorização do consumo consciente e pela busca
              por acessórios que combinem qualidade e preço acessível.</p>
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
            <p>Esta seção está sendo exibida no modo de compatibilidade do GitHub Pages.</p>
            <p>Para visualizar todos os recursos interativos e conteúdo completo, baixe o repositório e execute-o localmente.</p>
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
    // Adicionar uma mensagem de aviso
    const notice = document.createElement('div');
    notice.className = 'compatibility-notice';
    notice.innerHTML = `
      <h3>Modo de Visualização GitHub Pages</h3>
      <p>Você está visualizando este relatório em modo de compatibilidade para GitHub Pages. Para acessar todas as 
      funcionalidades interativas, recomendamos baixar o repositório e abri-lo localmente através de um servidor HTTP.</p>
      <pre>
# No terminal:
git clone https://github.com/kunst3d/Amica-RelatorioNEW.git
cd Amica-RelatorioNEW
python -m http.server 8000

# Depois acesse: http://localhost:8000
      </pre>
    `;
    notice.style.backgroundColor = '#fff8e1';
    notice.style.border = '1px solid #ffe082';
    notice.style.borderRadius = '4px';
    notice.style.padding = '15px';
    notice.style.margin = '15px 0';
    notice.style.fontSize = '14px';
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      // Inserir a mensagem no topo do conteúdo
      mainContent.insertBefore(notice, mainContent.firstChild);
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
    
    // Remover o loading indicator
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
    
    if (debug) console.log('Modo de compatibilidade GitHub Pages inicializado com sucesso');
  }
  
  // Iniciar em 500ms para dar tempo de outros scripts carregarem
  setTimeout(initCompatibilityMode, 500);
}); 