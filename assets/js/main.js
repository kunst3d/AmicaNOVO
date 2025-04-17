/**
 * main.js
 * Script simplificado para o Relatório Amica
 * Otimizado para funcionamento no GitHub Pages
 */

const AMICA = {
  // Configurações da aplicação
  config: {
    debugMode: true
  },
  
  // Estado da aplicação
  state: {
    currentSection: null,
    isGitHubPages: false,
    sectionsLoaded: {}
  },
  
  // Inicialização da aplicação
  init: function() {
    console.log("Inicializando aplicação...");
    
    // Verificar se estamos no GitHub Pages
    this.state.isGitHubPages = this.checkIfGitHubPages();
    
    // Configurar para GitHub Pages se necessário
    if (this.state.isGitHubPages) {
      console.log("Executando no GitHub Pages, configurando base href");
      document.getElementById('github-notice').style.display = 'block';
      this.setupBaseHref();
    } else {
      document.getElementById('local-notice').style.display = 'block';
    }
    
    // Adicionar meta tag de codificação UTF-8 se não existir
    this.ensureUtf8Encoding();
    
    // Inicializar navegação
    this.setupNavigation();
    
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
  
  // Garantir que a codificação UTF-8 esteja definida
  ensureUtf8Encoding: function() {
    // Verificar se já existe meta tag charset
    let charsetMeta = document.querySelector('meta[charset]');
    
    // Se não existir, criar uma
    if (!charsetMeta) {
      charsetMeta = document.createElement('meta');
      charsetMeta.setAttribute('charset', 'UTF-8');
      document.head.insertBefore(charsetMeta, document.head.firstChild);
    } else {
      // Garantir que seja UTF-8
      charsetMeta.setAttribute('charset', 'UTF-8');
    }
    
    // Verificar também http-equiv Content-Type
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
        
        // Carregar e mostrar a seção correspondente
        this.loadSection(sectionId);
        
        // Atualizar URL
        window.location.hash = sectionId;
        
        // Log para debugging
        if (this.config.debugMode) {
          console.log(`Navegação: Clique em ${sectionId}`);
        }
      });
    });
    
    // Lidar com navegação através do hash na URL
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        this.loadSection(hash);
        
        // Atualizar link ativo
        const activeLink = document.querySelector(`.sidebar-nav__link[href="#${hash}"]`);
        if (activeLink) {
          const navLinks = document.querySelectorAll('.sidebar-nav__link');
          navLinks.forEach(l => l.classList.remove('active'));
          activeLink.classList.add('active');
        }
      }
    });
    
    // Carregar seção inicial baseada na URL ou mostrar a primeira
    this.loadInitialSection();
  },
  
  // Carregar conteúdo da seção a partir do arquivo HTML correspondente
  loadSection: function(sectionId) {
    // Atualizar estado
    this.state.currentSection = sectionId;
    
    // Log para debugging
    console.log(`Carregando seção: ${sectionId}`);
    
    // Primeiro, ocultar todas as seções
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
      section.style.display = 'none';
    });
    
    // Mostrar o indicador de carregamento
    const loader = document.getElementById('main-loader');
    if (loader) {
      loader.style.display = 'flex';
    }
    
    // Verificar se a seção já foi carregada antes
    if (this.state.sectionsLoaded[sectionId]) {
      this.showLoadedSection(sectionId);
      return;
    }
    
    // Caminho para o arquivo HTML
    const filePath = `content/${sectionId}.html`;
    
    // Carregar o conteúdo via AJAX
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao carregar ${filePath}: ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then(buffer => {
        // Tentar decodificar o buffer como UTF-8
        let htmlContent = this.decodeContent(buffer);
        
        // Armazenar o conteúdo no estado
        this.state.sectionsLoaded[sectionId] = htmlContent;
        
        // Mostrar a seção
        this.showLoadedSection(sectionId);
      })
      .catch(error => {
        console.error(`Erro ao carregar seção ${sectionId}:`, error);
        
        // Mostrar mensagem de erro na seção
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
          const placeholder = targetSection.querySelector('.section-content-placeholder');
          if (placeholder) {
            placeholder.innerHTML = `
              <div class="error-message">
                <h2>Erro ao carregar conteúdo</h2>
                <p>${error.message}</p>
                <p>Tente recarregar a página ou acessar através de um servidor web local.</p>
              </div>
            `;
          }
          targetSection.style.display = 'block';
        }
        
        // Ocultar loader
        if (loader) {
          loader.style.display = 'none';
        }
      });
  },
  
  // Decodificar o conteúdo do buffer, tentando diferentes codificações
  decodeContent: function(buffer) {
    let text;
    // Tentar UTF-8 primeiro
    try {
      text = new TextDecoder('utf-8').decode(buffer);
      // Verificar se há caracteres estranhos que indicam que pode não ser UTF-8
      if (!text.includes('\uFFFD')) {
        return text;
      }
    } catch (e) {
      console.warn("Erro ao decodificar como UTF-8, tentando ISO-8859-1", e);
    }
    
    // Se UTF-8 falhar ou tiver caracteres estranhos, tentar ISO-8859-1 (Latin1)
    try {
      text = new TextDecoder('iso-8859-1').decode(buffer);
      // Limpar caracteres estranhos
      text = this.cleanupCharacters(text);
      return text;
    } catch (e) {
      console.warn("Erro ao decodificar como ISO-8859-1", e);
    }
    
    // Se tudo falhar, tentar windows-1252
    try {
      text = new TextDecoder('windows-1252').decode(buffer);
      text = this.cleanupCharacters(text);
      return text;
    } catch (e) {
      console.warn("Erro ao decodificar como windows-1252, usando UTF-8 como fallback", e);
    }
    
    // Fallback para UTF-8 se tudo falhar
    return new TextDecoder('utf-8').decode(buffer);
  },
  
  // Limpar caracteres estranhos
  cleanupCharacters: function(text) {
    // Substituir códigos HTML de caracteres acentuados
    const replacements = {
      '\u00E1': 'á', '\u00E9': 'é', '\u00ED': 'í', '\u00F3': 'ó', '\u00FA': 'ú',
      '\u00E2': 'â', '\u00EA': 'ê', '\u00EE': 'î', '\u00F4': 'ô', '\u00FB': 'û',
      '\u00E0': 'à', '\u00E8': 'è', '\u00EC': 'ì', '\u00F2': 'ò', '\u00F9': 'ù',
      '\u00E3': 'ã', '\u00F5': 'õ', '\u00F1': 'ñ',
      '\u00E7': 'ç', '\u00C7': 'Ç',
      '\u00C1': 'Á', '\u00C9': 'É', '\u00CD': 'Í', '\u00D3': 'Ó', '\u00DA': 'Ú',
      '\u00C2': 'Â', '\u00CA': 'Ê', '\u00CE': 'Î', '\u00D4': 'Ô', '\u00DB': 'Û',
      '\u00C0': 'À', '\u00C8': 'È', '\u00CC': 'Ì', '\u00D2': 'Ò', '\u00D9': 'Ù',
      '\u00C3': 'Ã', '\u00D5': 'Õ', '\u00D1': 'Ñ',
      '\u00BA': 'º', '\u00AA': 'ª',
      '\u00B0': '°', '\u00B2': '²', '\u00B3': '³',
      '\u20AC': '€', '\u00A3': '£',
      '\u201C': '"', '\u201D': '"', '\u2018': '\'', '\u2019': '\'',
      '\u2013': '–', '\u2014': '—', '\u2022': '•',
      '\u2122': '™', '\u00AE': '®', '\u00A9': '©',
      '\u00A0<': '<', '>\u00A0': '>'
    };
    
    // Substituir cada caractere encontrado
    for (const [char, replacement] of Object.entries(replacements)) {
      text = text.replace(new RegExp(char, 'g'), replacement);
    }
    
    // Tentar corrigir tags HTML
    text = text.replace(/\uFFFD<(!--|!DOCTYPE|html|head|body|div|p|span|h[1-6]|section|script|link|meta|style|[a-zA-Z]+)/g, '<$1');
    text = text.replace(/(<\/[a-zA-Z]+)\uFFFD>/g, '$1>');
    
    return text;
  },
  
  // Mostrar seção já carregada
  showLoadedSection: function(sectionId) {
    // Obter elemento da seção
    const section = document.getElementById(sectionId);
    if (!section) {
      console.error(`Seção não encontrada: ${sectionId}`);
      return;
    }
    
    // Obter placeholder de conteúdo
    const placeholder = section.querySelector('.section-content-placeholder');
    if (placeholder) {
      // Inserir HTML carregado no placeholder
      placeholder.innerHTML = this.state.sectionsLoaded[sectionId];
      
      // Inicializar gráficos se presentes
      this.initSectionCharts(section);
    }
    
    // Mostrar a seção
    section.style.display = 'block';
    
    // Ocultar o indicador de carregamento
    const loader = document.getElementById('main-loader');
    if (loader) {
      loader.style.display = 'none';
    }
    
    // Rolar para o topo
    window.scrollTo(0, 0);
    
    console.log(`Seção ${sectionId} exibida com sucesso`);
  },
  
  // Inicializar gráficos na seção
  initSectionCharts: function(section) {
    if (typeof Chart === 'undefined') return;
    
    const chartDataElements = section.querySelectorAll('.chart-data');
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
          chartData = JSON.parse(dataElement.textContent);
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
      // Carregar a seção inicial
      this.loadSection(initialSection);
      
      // Atualizar o link ativo
      const activeLink = document.querySelector(`.sidebar-nav__link[href="#${initialSection}"]`);
      if (activeLink) {
        document.querySelectorAll('.sidebar-nav__link').forEach(l => l.classList.remove('active'));
        activeLink.classList.add('active');
        console.log(`Link ativo atualizado para ${initialSection}`);
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
