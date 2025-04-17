/**
 * main.js - Versão para Relatório Amica
 * Carregamento dinâmico com tratamento de codificação
 */

// Definição de ChartUtils removida - agora importada de chart-utils.js

const AMICA = {
  // Configurações da aplicação
  config: {
    debugMode: true,
    contentPath: 'content/', // Caminho para os arquivos de conteúdo
    enableFileProtocolFallback: true // Habilitar fallback para protocolo file://
  },
  
  // Estado da aplicação
  state: {
    currentSection: null,
    isGitHubPages: false,
    isFileProtocol: false,
    sectionsLoaded: {}, // Cache para conteúdo carregado
    fetchAttempts: {} // Contador de tentativas de carregamento
  },
  
  // Inicialização da aplicação
  init: function() {
    console.log("Inicializando aplicação...");
    
    // Verificar ambiente
    this.detectEnvironment();
    
    // Configurar base href e mostrar avisos adequados
    this.setupEnvironment();
    
    // Garantir codificação UTF-8 na página principal
    this.ensureUtf8Encoding();
    
    // Inicializar navegação
    this.setupNavigation();
    
    // Carregar seção inicial baseada na URL ou mostrar a primeira
    this.loadInitialSection();
    
    // Adicionar classe para habilitar animações após carregamento
    document.body.classList.add('is-loaded');
    
    console.log("Relatório Amica inicializado com sucesso.");
  },
  
  // Detectar ambiente de execução
  detectEnvironment: function() {
    // Detectar GitHub Pages
    const hostname = window.location.hostname;
    this.state.isGitHubPages = hostname.includes('github.io') || 
           hostname.includes('githubusercontent.com') || 
           hostname.includes('pages.github.com');
    
    // Detectar protocolo file://
    this.state.isFileProtocol = window.location.protocol === 'file:';
    
    console.log(`Ambiente detectado: GitHub Pages: ${this.state.isGitHubPages}, File Protocol: ${this.state.isFileProtocol}`);
  },
  
  // Configurar ambiente baseado na detecção
  setupEnvironment: function() {
    // Esconder todos os avisos inicialmente
    document.getElementById('github-notice').style.display = 'none';
    document.getElementById('local-notice').style.display = 'none';
    
    if (this.state.isGitHubPages) {
      console.log("Executando no GitHub Pages, configurando base href");
      document.getElementById('github-notice').style.display = 'block';
      this.setupBaseHref();
    } 
    else if (this.state.isFileProtocol) {
      console.log("Executando via protocolo file://, mostrando aviso local");
      document.getElementById('local-notice').style.display = 'block';
    }
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
  
  // Garantir que a codificação UTF-8 esteja definida
  ensureUtf8Encoding: function() {
    // Assegura meta tags UTF-8 no <head>
    let charsetMeta = document.querySelector('meta[charset]');
    if (!charsetMeta) {
      charsetMeta = document.createElement('meta');
      charsetMeta.setAttribute('charset', 'UTF-8');
      document.head.insertBefore(charsetMeta, document.head.firstChild);
    } else {
      charsetMeta.setAttribute('charset', 'UTF-8');
    }
    
    let contentTypeMeta = document.querySelector('meta[http-equiv="Content-Type"]');
    if (!contentTypeMeta) {
      contentTypeMeta = document.createElement('meta');
      contentTypeMeta.setAttribute('http-equiv', 'Content-Type');
      contentTypeMeta.setAttribute('content', 'text/html; charset=utf-8');
      document.head.insertBefore(contentTypeMeta, document.head.firstChild);
    } else {
      contentTypeMeta.setAttribute('content', 'text/html; charset=utf-8');
    }
  },

  // Configurar navegação
  setupNavigation: function() {
    const navLinks = document.querySelectorAll('.sidebar-nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        this.loadSection(sectionId);
        window.location.hash = sectionId;
      });
    });

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        this.loadSection(hash);
        const activeLink = document.querySelector(`.sidebar-nav__link[href="#${hash}"]`);
        if (activeLink) {
          navLinks.forEach(l => l.classList.remove('active'));
          activeLink.classList.add('active');
        }
      }
    });
  },

  // Carregar conteúdo da seção
  loadSection: function(sectionId) {
    if (!sectionId) {
      console.error("ID de seção inválido");
      return;
    }
    
    this.state.currentSection = sectionId;
    console.log(`Carregando seção: ${sectionId}`);

    // Esconder todas as seções primeiro
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');

    // Encontrar a seção alvo
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
        console.error(`Elemento da seção #${sectionId} não encontrado no DOM.`);
        return;
    }
    
    const placeholder = targetSection.querySelector('.section-content-placeholder');
    if (!placeholder) {
        console.error(`Placeholder não encontrado na seção #${sectionId}.`);
        targetSection.style.display = 'block'; // Mostra a seção mesmo sem placeholder
        return;
    }

    // Exibir loader
    const loader = document.getElementById('main-loader');
    if (loader) loader.style.display = 'flex';

    // Verificar cache
    if (this.state.sectionsLoaded[sectionId]) {
        console.log(`Seção ${sectionId} encontrada no cache.`);
        this.displaySectionContent(sectionId, this.state.sectionsLoaded[sectionId]);
        return;
    }

    // Resetar contagem de tentativas para esta seção
    if (!this.state.fetchAttempts[sectionId]) {
        this.state.fetchAttempts[sectionId] = 0;
    }
    
    // Incrementar tentativa
    this.state.fetchAttempts[sectionId]++;
    
    // Carregar do arquivo usando a estratégia apropriada
    if (this.state.isFileProtocol && this.config.enableFileProtocolFallback) {
        this.loadSectionContentFileProtocol(sectionId);
    } else {
        this.loadSectionContentFetch(sectionId);
    }
  },
  
  // Carregar conteúdo usando fetch (método padrão)
  loadSectionContentFetch: function(sectionId) {
    const filePath = `${this.config.contentPath}${sectionId}.html`;
    
    console.log(`Carregando ${filePath} via fetch (tentativa ${this.state.fetchAttempts[sectionId]})`);
    
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status} ao carregar ${filePath}`);
        }
        // Ler como ArrayBuffer para detectar codificação
        return response.arrayBuffer(); 
      })
      .then(buffer => {
        let decoder;
        let htmlContent;
        
        console.log(`[${sectionId}] Buffer recebido, verificando codificação...`);
        
        // Verificar primeiros bytes para detectar BOM
        const firstBytes = new Uint8Array(buffer.slice(0, 4));
        let byteString = '';
        try {
            byteString = `Bytes (hex): ${firstBytes[0]?.toString(16) ?? 'N/A'} ${firstBytes[1]?.toString(16) ?? 'N/A'} ${firstBytes[2]?.toString(16) ?? 'N/A'} ${firstBytes[3]?.toString(16) ?? 'N/A'}`;
        } catch (e) {
            byteString = "Erro ao ler bytes.";
        }
        console.log(`[${sectionId}] ${byteString}`);
        
        // Detectar BOM UTF-16 LE (FF FE)
        if (firstBytes.length >= 2 && firstBytes[0] === 0xFF && firstBytes[1] === 0xFE) {
            console.log(`[${sectionId}] Detectado BOM UTF-16 LE. Decodificando...`);
            decoder = new TextDecoder('utf-16le');
            htmlContent = decoder.decode(buffer.slice(2)); // Pular BOM
        } 
        // Detectar BOM UTF-8 (EF BB BF)
        else if (firstBytes.length >= 3 && firstBytes[0] === 0xEF && firstBytes[1] === 0xBB && firstBytes[2] === 0xBF) {
            console.log(`[${sectionId}] Detectado BOM UTF-8. Decodificando...`);
            decoder = new TextDecoder('utf-8');
            htmlContent = decoder.decode(buffer.slice(3)); // Pular BOM
        }
        // Sem BOM, assumir UTF-8 com fallback para Latin1
        else {
            console.log(`[${sectionId}] Sem BOM detectado. Tentando UTF-8...`);
            decoder = new TextDecoder('utf-8');
            htmlContent = decoder.decode(buffer); 
            
            // Se UTF-8 falhar (caracteres de substituição), tentar Latin1
            if (htmlContent.includes('\uFFFD')) { 
                console.warn(`[${sectionId}] Caracteres inválidos com UTF-8. Tentando Latin1...`);
                decoder = new TextDecoder('iso-8859-1');
                htmlContent = decoder.decode(buffer);
            }
        }
        
        // Armazenar no cache
        this.state.sectionsLoaded[sectionId] = htmlContent;
        
        // Exibir conteúdo
        this.displaySectionContent(sectionId, htmlContent);
      })
      .catch(error => {
        console.error(`Falha ao carregar ou processar seção ${sectionId}:`, error);
        
        // Tentar carregar com método alternativo se estiver no protocolo file://
        if (this.state.isFileProtocol && this.config.enableFileProtocolFallback && 
            this.state.fetchAttempts[sectionId] < 2) {
            console.log(`Tentando método alternativo para protocolo file://`);
            this.loadSectionContentFileProtocol(sectionId);
            return;
        }
        
        this.displayError(sectionId, error);
        const loader = document.getElementById('main-loader');
        if (loader) loader.style.display = 'none';
      });
  },
  
  // Método alternativo para carregar conteúdo (para protocolo file://)
  loadSectionContentFileProtocol: function(sectionId) {
    console.log(`Carregando ${sectionId} via método alternativo para file://`);
    
    // Solução temporária: conteúdo embutido para evitar problemas CORS com file://
    // Em ambientes de produção, use um servidor HTTP local ou GitHub Pages.
    const embedContent = `
      <div class="section-header">
        <h1>${this.formatSectionTitle(sectionId)}</h1>
        <div class="section-message warning">
          <p>⚠️ O conteúdo desta seção não pode ser carregado devido a restrições do protocolo file://.</p>
          <p>Para visualizar o relatório completo, utilize um dos métodos abaixo:</p>
          <ul>
            <li>Acesse através de um servidor HTTP local</li>
            <li>Utilize o GitHub Pages (caso disponível)</li>
          </ul>
        </div>
      </div>
    `;
    
    // Armazenar no cache e exibir
    this.state.sectionsLoaded[sectionId] = embedContent;
    this.displaySectionContent(sectionId, embedContent);
  },
  
  // Formatar título da seção a partir do ID
  formatSectionTitle: function(sectionId) {
    if (!sectionId) return 'Seção';
    
    // Converter ID para título legível
    return sectionId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  // Exibir conteúdo da seção e inicializar gráficos
  displaySectionContent: function(sectionId, htmlContent) {
      console.log(`Exibindo conteúdo para ${sectionId}`);
      const targetSection = document.getElementById(sectionId);
      const placeholder = targetSection.querySelector('.section-content-placeholder');
      const loader = document.getElementById('main-loader');
      
      if (placeholder) {
          // Utilizar innerHTML com manipulação segura do conteúdo
          placeholder.innerHTML = htmlContent;
          targetSection.style.display = 'block';
          
          // Inicializar gráficos APÓS inserir o conteúdo no DOM
          setTimeout(() => {
              this.initSectionCharts(targetSection);
              
              // Disparar evento para notificar que a seção foi carregada
              document.dispatchEvent(new CustomEvent('amica:sectionLoaded', {
                  detail: { sectionId: sectionId }
              }));
          }, 100);
      } else {
          console.error(`Placeholder não encontrado ao tentar exibir ${sectionId}`);
          targetSection.style.display = 'block'; // Ainda mostra a seção
      }
      
      if (loader) loader.style.display = 'none';
      window.scrollTo(0, 0);
  },

  // Exibir mensagem de erro
  displayError: function(sectionId, error) {
      const targetSection = document.getElementById(sectionId);
      if (!targetSection) return;
      const placeholder = targetSection.querySelector('.section-content-placeholder');
      if (placeholder) {
          placeholder.innerHTML = `
              <div class="error-message">
                  <h2>Erro ao carregar seção '${this.formatSectionTitle(sectionId)}'</h2>
                  <p>${error.message}</p>
                  <p>Possíveis soluções:</p>
                  <ul>
                      <li>Verifique se o arquivo 'content/${sectionId}.html' existe</li>
                      <li>Utilize um servidor HTTP local (recomendado)</li>
                      <li>Se estiver usando o protocolo file://, tente abrir em outro navegador</li>
                  </ul>
              </div>
          `;
      }
      targetSection.style.display = 'block';
  },

  // Inicializar gráficos na seção especificada
  initSectionCharts: function(sectionElement) {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js não está disponível. Gráficos não serão renderizados.');
      return;
    }
    
    const chartDataElements = sectionElement.querySelectorAll('.chart-data');
    console.log(`[${sectionElement.id}] Encontrados ${chartDataElements.length} elementos de dados de gráficos`);
    
    chartDataElements.forEach(dataElement => {
      const chartId = dataElement.getAttribute('data-chart');
      const chartType = dataElement.getAttribute('data-type') || 'bar';
      const chartCanvas = sectionElement.querySelector(`#${chartId}`); // Procura DENTRO da seção atual
      
      if (!chartCanvas) {
        console.warn(`[${sectionElement.id}] Canvas #${chartId} não encontrado`);
        return;
      }
      
      console.log(`[${sectionElement.id}] Inicializando gráfico ${chartId} (${chartType})`);
      
      try {
        let chartConfigData;
        try {
          chartConfigData = JSON.parse(dataElement.textContent.trim());
        } catch (parseError) {
          console.error(`[${sectionElement.id}] Erro ao fazer parse dos dados do gráfico ${chartId}:`, parseError, dataElement.textContent);
          return;
        }

        // Criar configuração de gráfico
        const config = {
          type: chartType,
          data: {
            labels: chartConfigData.labels,
            datasets: chartConfigData.datasets
          },
          options: chartConfigData.options || {}
        };
        
        // Destruir gráfico anterior se existir
        if (chartCanvas._chart) {
          chartCanvas._chart.destroy();
        }
        
        // Criar o gráfico usando ChartUtils (se disponível) ou diretamente
        if (typeof ChartUtils !== 'undefined') {
          console.log(`[${sectionElement.id}] Usando ChartUtils para criar gráfico ${chartId}`);
          chartCanvas._chart = ChartUtils.createChart(chartId, config);
        } else {
          console.log(`[${sectionElement.id}] Usando Chart.js diretamente para criar gráfico ${chartId}`);
          chartCanvas._chart = new Chart(chartCanvas, config);
        }
        
        console.log(`[${sectionElement.id}] Gráfico ${chartId} inicializado com sucesso`);
      } catch (error) {
        console.error(`[${sectionElement.id}] Erro ao inicializar gráfico #${chartId}:`, error);
      }
    });
  },

  // Carregar seção inicial
  loadInitialSection: function() {
    let initialSection = 'sumario-executivo'; // Padrão
    if (window.location.hash) {
      const hashSection = window.location.hash.substring(1);
      // Valida se o hash corresponde a um link existente
      if (document.querySelector(`.sidebar-nav__link[href="#${hashSection}"]`)) {
          initialSection = hashSection;
          console.log(`Usando hash da URL: ${initialSection}`);
      } else {
          console.warn(`Hash inválido #${hashSection}, usando padrão ${initialSection}`);
          window.location.hash = initialSection; // Corrige URL
      }
    } else {
      console.log(`Nenhum hash na URL, usando padrão: ${initialSection}`);
      window.location.hash = initialSection; // Define URL
    }
    
    this.loadSection(initialSection);
    
    const activeLink = document.querySelector(`.sidebar-nav__link[href="#${initialSection}"]`);
    if (activeLink) {
        document.querySelectorAll('.sidebar-nav__link').forEach(l => l.classList.remove('active'));
        activeLink.classList.add('active');
    }
  }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Definir algumas configurações globais do Chart.js (opcional, mas bom para consistência)
  if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = getComputedStyle(document.documentElement).getPropertyValue('--font-family-secondary').trim() || 'Inter, sans-serif';
    Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--color-chart-text').trim() || '#525252';
    Chart.defaults.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-chart-grid').trim() || 'rgba(0, 0, 0, 0.08)';
  }

  AMICA.init();
});
