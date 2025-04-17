/**
 * data-loader.js
 * Script responsável pelo carregamento dinâmico de conteúdo no relatório.
 */

// Configuração para debugging
const debugMode = true; // Ative para ver logs detalhados no console

// Estado da aplicação
const appState = {
  currentSection: null,
  loadedSections: {},
  isFileProtocol: window.location.protocol === 'file:',
  isGitHubPages: window.location.hostname.includes('github.io'),
  debug: debugMode
};

// Elementos do DOM
let sectionLinks;
let contentSections;
let fileProtocolNotice;

// Mapeamento de seções para arquivos HTML
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

// Função para inicializar o carregador de conteúdo
function initializeContentLoader() {
  if (window.location.hostname.includes('github.io')) {
    if (appState.debug) console.log('GitHub Pages detectado: initializeContentLoader ignorado.');
    return;
  }

  if (appState.debug) console.log('Inicializando carregador de conteúdo...');
  
  // Capturar elementos do DOM
  sectionLinks = document.querySelectorAll('.sidebar-nav__link');
  contentSections = document.querySelectorAll('.content-section');
  fileProtocolNotice = document.querySelector('.file-protocol-warning');
  
  // Verificar se estamos no protocolo file:// e gerenciar aviso
  manageFileProtocolNotice();
  
  // Adicionar event listeners aos links de navegação
  setupNavigation();
  
  // Carregar seção inicial (primeira da lista)
  if (sectionLinks.length > 0) {
    const firstSectionId = sectionLinks[0].getAttribute('href').substring(1);
    loadSectionContent(firstSectionId);
    sectionLinks[0].classList.add('active');
  }
  
  if (appState.debug) console.log('Carregador de conteúdo inicializado');
}

// Gerenciar a visibilidade do aviso de protocolo file://
function manageFileProtocolNotice() {
  if (!fileProtocolNotice) return;
  
  if (appState.isFileProtocol && !appState.isGitHubPages) {
    fileProtocolNotice.style.display = 'block';
    if (appState.debug) console.log('Protocolo file:// detectado, exibindo aviso');
  } else {
    fileProtocolNotice.style.display = 'none';
    if (appState.debug) console.log('Protocolo HTTP detectado ou estamos no GitHub Pages, ocultando aviso');
  }
}

// Configurar navegação entre seções
function setupNavigation() {
  sectionLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remover classe ativa de todos os links
      sectionLinks.forEach(l => {
        l.classList.remove('active');
      });
      
      // Adicionar classe ativa ao link clicado
      this.classList.add('active');
      
      // Capturar o ID da seção do atributo href
      const sectionId = this.getAttribute('href').substring(1);
      
      // Carregar o conteúdo da seção
      loadSectionContent(sectionId);
    });
  });
}

// Carregar o conteúdo de uma seção específica
function loadSectionContent(sectionId) {
  if (window.location.hostname.includes('github.io')) {
    if (appState.debug) console.log(`GitHub Pages detectado: Carregamento de conteúdo dinâmico ignorado para ${sectionId}. Usando github-compatibility.js.`);
    contentSections.forEach(section => {
      section.style.display = (section.id === sectionId) ? 'block' : 'none';
    });
    sectionLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href').substring(1) === sectionId);
    });
    return;
  }

  if (appState.debug) console.log(`Carregando conteúdo para seção: ${sectionId}`);
  
  // Atualizar estado da aplicação
  appState.currentSection = sectionId;
  
  // Ocultar todas as seções
  contentSections.forEach(section => {
    section.style.display = 'none';
  });
  
  // Obter a seção alvo
  const targetSection = document.getElementById(sectionId);
  if (!targetSection) {
    console.error(`Seção não encontrada: ${sectionId}`);
    return;
  }
  
  // Exibir a seção alvo
  targetSection.style.display = 'block';
  
  // Verificar se a seção já foi carregada
  if (appState.loadedSections[sectionId]) {
    if (appState.debug) console.log(`Seção ${sectionId} já está carregada, não é necessário carregar novamente`);
    return;
  }
  
  // Obter o placeholder de conteúdo
  const contentPlaceholder = targetSection.querySelector('.section-content-placeholder');
  if (!contentPlaceholder) {
    console.error(`Placeholder de conteúdo não encontrado na seção ${sectionId}`);
    return;
  }
  
  // Adicionar indicador de carregamento
  contentPlaceholder.innerHTML = '<div class="loading-indicator"><div class="spinner"></div><p>Carregando conteúdo...</p></div>';
  
  // Obter o caminho do arquivo
  let filePath = sectionContentMapping[sectionId];
  
  // Ajuste para GitHub Pages - se necessário
  if (appState.isGitHubPages) {
    filePath = `https://raw.githubusercontent.com/kunst3d/Amica-RelatorioNEW/main/${filePath}`;
  }
  
  if (appState.debug) console.log(`Carregando arquivo: ${filePath}`);
  
  // MODIFICAÇÃO: Se estiver usando protocolo file://, tente usar XMLHttpRequest com fallback para conteúdo estático
  if (appState.isFileProtocol) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', filePath, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
            if (appState.debug) console.log(`XMLHttpRequest: Conteúdo recebido para ${sectionId}, processando...`);
            insertContent(xhr.responseText, contentPlaceholder, sectionId);
            appState.loadedSections[sectionId] = true;
          } else {
            // Nova tentativa com caminho relativo ajustado
            try {
              const adjustedPath = '../' + filePath;
              if (appState.debug) console.log(`Tentando caminho ajustado: ${adjustedPath}`);
              
              const xhr2 = new XMLHttpRequest();
              xhr2.open('GET', adjustedPath, true);
              xhr2.onreadystatechange = function() {
                if (xhr2.readyState === 4) {
                  if (xhr2.status === 200 || (xhr2.status === 0 && xhr2.responseText)) {
                    if (appState.debug) console.log(`XMLHttpRequest: Conteúdo recebido para ${sectionId} (caminho ajustado), processando...`);
                    insertContent(xhr2.responseText, contentPlaceholder, sectionId);
                    appState.loadedSections[sectionId] = true;
                  } else {
                    // Falha, tentar carregar conteúdo estático completo em vez de fallback
                    loadFullStaticContent(sectionId, contentPlaceholder);
                  }
                }
              };
              xhr2.send();
            } catch (e) {
              console.error("Erro ao usar XMLHttpRequest com caminho ajustado:", e);
              loadFullStaticContent(sectionId, contentPlaceholder);
            }
          }
        }
      };
      xhr.send();
    } catch (e) {
      console.error("Erro ao usar XMLHttpRequest:", e);
      loadFullStaticContent(sectionId, contentPlaceholder);
    }
    return;
  }
  
  // Buscar o conteúdo via fetch (para HTTP)
  fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      if (appState.debug) console.log(`Conteúdo recebido para ${sectionId}, processando...`);
      
      // Processar e inserir o conteúdo
      insertContent(html, contentPlaceholder, sectionId);
      
      // Marcar seção como carregada
      appState.loadedSections[sectionId] = true;
      
      // Ocultar o aviso de protocolo file:// se o conteúdo foi carregado com sucesso
      if (appState.isFileProtocol && fileProtocolNotice) {
        fileProtocolNotice.style.display = 'none';
      }
    })
    .catch(error => {
      console.error(`Erro ao carregar conteúdo para ${sectionId}:`, error);
      
      // Tentar abordagem alternativa com conteúdo estático
      loadFullStaticContent(sectionId, contentPlaceholder);
    });
}

// NOVA FUNÇÃO: Carregar conteúdo estático completo para protocolo file://
function loadFullStaticContent(sectionId, contentPlaceholder) {
  if (appState.debug) console.log(`Usando conteúdo estático completo para ${sectionId}`);
  
  // Carregar primeiro o conteúdo HTML completo se possível
  try {
    // Tenta ler o conteúdo diretamente do DOM para páginas já carregadas
    const existingContent = document.getElementById(`${sectionId}-full-content`);
    if (existingContent) {
      if (appState.debug) console.log(`Usando conteúdo completo pré-carregado para ${sectionId}`);
      contentPlaceholder.innerHTML = existingContent.innerHTML;
      appState.loadedSections[sectionId] = true;
      return;
    }
  } catch (e) {
    console.error(`Erro ao buscar conteúdo pré-carregado para ${sectionId}:`, e);
  }

  // Conteúdo estático ampliado para cada seção
  let contentHtml = '';
  
  switch(sectionId) {
    case 'sumario-executivo':
      contentHtml = `
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
      `;
      break;
      
    case 'analise-mercado':
      contentHtml = `
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
      `;
      break;
      
    // Adicione mais cases para outras seções conforme necessário
    
    default:
      // Para outras seções, usar conteúdo de fallback melhorado
      contentHtml = `
        <div class="subsection">
          <div class="subsection__header">
            <h2 class="subsection__title">Conteúdo Parcial</h2>
          </div>
          <div class="content-card">
            <div class="content-card__body">
              <p>Esta seção está disponível apenas parcialmente quando acessada via protocolo file://.</p>
              <p>Para visualizar o conteúdo completo, execute um servidor HTTP local:</p>
              <pre>python -m http.server 8000</pre>
              <p>E acesse <a href="http://localhost:8000">http://localhost:8000</a> no seu navegador.</p>
            </div>
          </div>
          
          <div class="subsection__header">
            <h2 class="subsection__title">Conteúdo Disponível</h2>
          </div>
          <div class="content-card">
            <div class="content-card__body">
              ${loadStaticFallbackContent(sectionId, null, true)}
            </div>
          </div>
        </div>
      `;
      break;
  }
  
  // Inserir o conteúdo
  contentPlaceholder.innerHTML = contentHtml;
  appState.loadedSections[sectionId] = true;
}

// MODIFICAÇÃO na função loadStaticFallbackContent para permitir retorno do HTML em vez de inserção direta
function loadStaticFallbackContent(sectionId, contentPlaceholder, returnHTML = false) {
  if (appState.debug && !returnHTML) console.log(`Usando conteúdo estático para ${sectionId}`);
  
  // Conteúdo estático para cada seção
  const staticContents = {
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
    // ... (os outros conteúdos estáticos continuam os mesmos)
  };
  
  // Se for apenas para retornar o HTML, sem inserir no DOM
  if (returnHTML) {
    return staticContents[sectionId] || `
      <p>Conteúdo parcial para ${sectionId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}.</p>
      <p>Para conteúdo completo, utilize um servidor HTTP local.</p>
    `;
  }
  
  // Inserir conteúdo estático ou mensagem de fallback
  if (staticContents[sectionId]) {
    contentPlaceholder.innerHTML = staticContents[sectionId];
    appState.loadedSections[sectionId] = true;
  } else {
    contentPlaceholder.innerHTML = `
      <div class="error-message">
        <h3>Conteúdo não disponível no modo offline</h3>
        <p>Esta seção não está disponível quando o relatório é acessado diretamente pelo sistema de arquivos.</p>
        <p>Para visualizar o conteúdo completo, utilize um servidor HTTP local:</p>
        <pre>python -m http.server 8000</pre>
        <p>Depois acesse: <code>http://localhost:8000</code> em seu navegador.</p>
      </div>
    `;
  }
}

// Inserir conteúdo na seção
function insertContent(html, placeholder, sectionId) {
  if (appState.debug) console.log(`Processando conteúdo para seção ${sectionId}`);
  
  // Criar um elemento temporário para analisar o HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Variável para armazenar o conteúdo extraído
  let extractedContent = null;
  let extractionMethod = '';
  
  // Estratégia 1: Buscar uma section com o ID correspondente
  if (!extractedContent) {
    const sectionElement = tempDiv.querySelector(`section#${sectionId}`);
    if (sectionElement) {
      extractedContent = sectionElement.innerHTML;
      extractionMethod = 'ID específico da seção';
      if (appState.debug) console.log(`Conteúdo extraído usando método: ${extractionMethod}`);
    }
  }
  
  // Estratégia 2: Buscar qualquer section dentro do HTML
  if (!extractedContent) {
    const sectionElement = tempDiv.querySelector('section');
    if (sectionElement) {
      extractedContent = sectionElement.innerHTML;
      extractionMethod = 'Primeira seção encontrada';
      if (appState.debug) console.log(`Conteúdo extraído usando método: ${extractionMethod}`);
    }
  }
  
  // Estratégia 3: Buscar div com classe subsection
  if (!extractedContent) {
    const subsectionElement = tempDiv.querySelector('.subsection');
    if (subsectionElement) {
      extractedContent = subsectionElement.outerHTML;
      extractionMethod = 'Elemento com classe subsection';
      if (appState.debug) console.log(`Conteúdo extraído usando método: ${extractionMethod}`);
    }
  }
  
  // Estratégia 4: Buscar content-card
  if (!extractedContent) {
    const contentCard = tempDiv.querySelector('.content-card');
    if (contentCard) {
      extractedContent = contentCard.outerHTML;
      extractionMethod = 'Elemento com classe content-card';
      if (appState.debug) console.log(`Conteúdo extraído usando método: ${extractionMethod}`);
    }
  }
  
  // Estratégia 5: Buscar div principal com classe específica do conteúdo
  if (!extractedContent) {
    const contentDiv = tempDiv.querySelector(`.${sectionId}-content, .${sectionId.replace(/-/g, '_')}_content`);
    if (contentDiv) {
      extractedContent = contentDiv.innerHTML;
      extractionMethod = 'Div com classe específica do conteúdo';
      if (appState.debug) console.log(`Conteúdo extraído usando método: ${extractionMethod}`);
    }
  }
  
  // Estratégia 6: Usar todo o conteúdo do body se presente
  if (!extractedContent) {
    const bodyContent = tempDiv.querySelector('body');
    if (bodyContent) {
      extractedContent = bodyContent.innerHTML;
      extractionMethod = 'Conteúdo do body';
      if (appState.debug) console.log(`Conteúdo extraído usando método: ${extractionMethod}`);
    }
  }
  
  // Estratégia 7 (fallback): Usar todo o HTML como conteúdo
  if (!extractedContent) {
    extractedContent = html;
    extractionMethod = 'HTML completo (fallback)';
    if (appState.debug) console.log(`Conteúdo extraído usando método: ${extractionMethod}`);
  }
  
  // Verificar se o conteúdo extraído é válido
  if (!extractedContent || extractedContent.trim() === '') {
    console.error(`Não foi possível extrair conteúdo válido para ${sectionId}`);
    placeholder.innerHTML = `
      <div class="error-message">
        <h3>Estrutura do conteúdo inválida no arquivo</h3>
        <p>O sistema não conseguiu identificar o conteúdo no arquivo ${sectionContentMapping[sectionId]}.</p>
        <p>Por favor, verifique a estrutura do arquivo HTML.</p>
      </div>
    `;
    return;
  }
  
  // Log para debugging
  if (appState.debug) {
    console.log(`Conteúdo para ${sectionId} extraído com sucesso usando método: ${extractionMethod}`);
    console.log(`Tamanho do conteúdo extraído: ${extractedContent.length} caracteres`);
  }
  
  // Inserir o conteúdo extraído
  placeholder.innerHTML = extractedContent;
  
  // Executar scripts (caso necessário)
  runScripts(placeholder);
  
  // Inicializar componentes dinâmicos específicos da seção
  initializeSectionComponents(sectionId, placeholder);
  
  if (appState.debug) console.log(`Conteúdo da seção ${sectionId} inserido com sucesso`);
}

// Executar scripts contidos no HTML carregado
function runScripts(container) {
  const scripts = container.querySelectorAll('script');
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

// Inicializar componentes específicos por seção
function initializeSectionComponents(sectionId, container) {
  // Inicializar componentes com base no ID da seção
  switch (sectionId) {
    case 'analise-mercado':
      // Inicializar gráficos ou outros componentes específicos
      if (typeof initMarketCharts === 'function') {
        initMarketCharts();
      }
      break;
    case 'analise-riscos':
      // Inicializar matriz de riscos se existir
      if (typeof initRiskMatrix === 'function') {
        initRiskMatrix();
      }
      break;
    // Adicionar outros casos conforme necessário
  }
  
  // Ativar tooltips e popovers se Bootstrap estiver sendo usado
  if (typeof bootstrap !== 'undefined') {
    if (typeof bootstrap.Tooltip !== 'undefined') {
      const tooltips = container.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
      });
    }
    
    if (typeof bootstrap.Popover !== 'undefined') {
      const popovers = container.querySelectorAll('[data-bs-toggle="popover"]');
      popovers.forEach(popover => {
        new bootstrap.Popover(popover);
      });
    }
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeContentLoader); 