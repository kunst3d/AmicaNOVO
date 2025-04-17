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
  
  if (appState.isFileProtocol) {
    fileProtocolNotice.style.display = 'block';
    if (appState.debug) console.log('Protocolo file:// detectado, exibindo aviso');
  } else {
    fileProtocolNotice.style.display = 'none';
    if (appState.debug) console.log('Protocolo HTTP detectado, ocultando aviso');
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
  if (appState.isGitHubPages) {
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
          if (xhr.status === 200) {
            if (appState.debug) console.log(`XMLHttpRequest: Conteúdo recebido para ${sectionId}, processando...`);
            insertContent(xhr.responseText, contentPlaceholder, sectionId);
            appState.loadedSections[sectionId] = true;
          } else {
            // Falha, tentar carregar conteúdo estático
            loadStaticFallbackContent(sectionId, contentPlaceholder);
          }
        }
      };
      xhr.send();
    } catch (e) {
      console.error("Erro ao usar XMLHttpRequest:", e);
      loadStaticFallbackContent(sectionId, contentPlaceholder);
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
      loadStaticFallbackContent(sectionId, contentPlaceholder);
    });
}

// NOVA FUNÇÃO: Carregar conteúdo estático de fallback para protocolo file://
function loadStaticFallbackContent(sectionId, contentPlaceholder) {
  if (appState.debug) console.log(`Usando conteúdo estático para ${sectionId}`);
  
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
    // Adicione conteúdo para as outras seções seguindo o mesmo padrão
  };
  
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