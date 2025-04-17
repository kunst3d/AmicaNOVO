/**
 * main.js
 * Script principal do Relatório Amica
 * Responsável pela inicialização e configuração geral da aplicação
 */

// Configurações globais
const AMICA = {
  // Configuração da aplicação
  config: {
    apiBaseUrl: './assets/data/',
    animationDuration: 300,
    defaultTransition: 'ease',
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024,
    desktopBreakpoint: 1440,
    debugMode: true // Habilita logs detalhados no console
  },
  
  // Estado da aplicação
  state: {
    currentSection: null,
    isMobile: window.innerWidth < 768,
    navOpen: false,
    dataLoaded: false,
    isFileProtocol: window.location.protocol === 'file:',
    isGitHubPages: false,
    hasFixedFileProtocolIssue: false // Flag para controlar se já tentamos resolver problemas de protocolo file://
  },
  
  // Inicialização da aplicação
  init: function() {
    if (this.config.debugMode) console.log('Inicializando Relatório Amica...');
    
    // Função definitiva para verificar GitHub Pages
    this.state.isGitHubPages = this.checkIfGitHubPages();
    
    // Verificar ambiente e configurar avisos
    this.checkEnvironment();
    
    // Detectar dispositivo
    this.detectDevice();
    
    if (this.state.isGitHubPages) {
      if (this.config.debugMode) console.log('GitHub Pages detectado: ajustando inicialização para compatibilidade');
      
      // Configurar manipuladores de eventos específicos para GitHub Pages
      this.setupEventListeners();
      
      // Disparar evento específico para GitHub Pages
      document.dispatchEvent(new CustomEvent('amica:init:github'));
      
      if (this.config.debugMode) console.log('Inicialização para GitHub Pages concluída em main.js.');
      return; // O restante da inicialização será feita pelo github-compatibility.js
    }
    
    // Continuar com a inicialização normal para ambiente local
    this.setupEventListeners();
    this.loadInitialData();
    
    // Inicializar componentes
    document.dispatchEvent(new CustomEvent('amica:init'));
    
    if (this.config.debugMode) console.log('Aplicação inicializada com sucesso!');
  },
  
  // Verificar se estamos no GitHub Pages
  checkIfGitHubPages: function() {
    return window.location.hostname.includes('github.io') || 
           window.location.hostname.includes('pages.github.com') ||
           window.location.hostname.includes('githubusercontent.com');
  },
  
  // Verificar ambiente de execução
  checkEnvironment: function() {
    // Função para esconder todos os avisos
    const hideAllWarnings = () => {
      const warnings = [
        document.getElementById('local-warning'),
        document.getElementById('github-warning'),
        document.getElementById('file-protocol-notice')
      ];
      
      warnings.forEach(warning => {
        if (warning) warning.style.display = 'none';
      });
      
      if (this.config.debugMode) console.log('Todos os avisos foram ocultados inicialmente');
    };
    
    // Esconder todos os avisos inicialmente
    hideAllWarnings();
    
    // Verificar GitHub Pages PRIMEIRO (prioridade mais alta)
    if (this.state.isGitHubPages) {
      document.body.classList.add('is-github-pages');
      
      // Mostrar APENAS o aviso do GitHub Pages
      const githubWarning = document.getElementById('github-warning');
      if (githubWarning) {
        githubWarning.style.display = 'block';
        if (this.config.debugMode) console.log('GitHub Pages detectado, exibindo aviso específico');
      }
      
      return; // Sair da função para evitar que outros avisos sejam exibidos
    }
    
    // Verificar se está sendo acessado via protocolo file:// (APENAS se não for GitHub Pages)
    if (this.state.isFileProtocol) {
      console.warn('Aviso: Este relatório está sendo acessado via protocolo file://. ' +
                   'Algumas funcionalidades, como carregamento dinâmico de conteúdo, podem não funcionar corretamente. ' +
                   'Recomendamos o uso de um servidor HTTP local.');
      
      // Adicionar classe para estilização específica
      document.body.classList.add('is-file-protocol');
      
      // Mostrar o aviso de protocolo file
      const fileProtocolWarning = document.getElementById('local-warning');
      if (fileProtocolWarning) {
        fileProtocolWarning.style.display = 'block';
        if (this.config.debugMode) console.log('Protocolo file:// detectado, exibindo aviso apropriado');
      }
      
      // Mostrar o aviso importante com instruções
      const importantNotice = document.getElementById('file-protocol-notice');
      if (importantNotice) {
        importantNotice.style.display = 'block';
        if (this.config.debugMode) console.log('Exibindo instruções detalhadas para acesso local');
      }
      
      // Configurar compatibilidade com protocolo file://
      this.setupFileProtocolCompatibility();
      
      // Disparar evento para possíveis ajustes em outros módulos
      document.dispatchEvent(new CustomEvent('amica:fileProtocolDetected'));
    }
  },
  
  // Configurar compatibilidade com protocolo file://
  setupFileProtocolCompatibility: function() {
    // Se já foi consertado ou estamos no GitHub Pages, não fazer novamente
    if (this.state.hasFixedFileProtocolIssue || this.state.isGitHubPages) return;
    
    // Marcar como consertado
    this.state.hasFixedFileProtocolIssue = true;
    
    if (this.config.debugMode) console.log('Configuração de compatibilidade para protocolo file:// aplicada');
  },
  
  // Detectar tipo de dispositivo
  detectDevice: function() {
    const checkMobile = () => {
      this.state.isMobile = window.innerWidth < this.config.mobileBreakpoint;
      document.body.classList.toggle('is-mobile', this.state.isMobile);
    };
    
    // Verificar no carregamento
    checkMobile();
    
    // Verificar no redimensionamento
    window.addEventListener('resize', () => {
      checkMobile();
      document.dispatchEvent(new CustomEvent('amica:resize'));
    });
  },
  
  // Configurar handlers de eventos
  setupEventListeners: function() {
    // Manipular navegação via hash
    window.addEventListener('hashchange', () => {
      this.handleHashChange();
    });
    
    // Injetar classe para habilitar animações após carregamento
    window.addEventListener('load', () => {
      document.body.classList.add('is-loaded');
      
      // Inicializar scripts de visualização após carregamento completo
      setTimeout(() => {
        if (typeof AmicaCharts !== 'undefined' && AmicaCharts.initializeCharts) {
          AmicaCharts.initializeCharts();
        }
        
        // Disparar evento de carregamento completo
        document.dispatchEvent(new CustomEvent('amica:loaded'));
      }, 500);
    });
    
    // Ouvir eventos personalizados de navegação para compatibilidade entre ambientes
    document.addEventListener('amica:navigate', (event) => {
      if (event.detail && event.detail.section) {
        this.state.currentSection = event.detail.section;
        
        // Atualizar URL com hash para manter consistência
        if (window.location.hash !== `#${event.detail.section}`) {
          window.history.pushState(null, null, `#${event.detail.section}`);
        }
      }
    });
  },
  
  // Carregar dados iniciais
  loadInitialData: function() {
    // Aqui poderíamos carregar dados JSON ou outras configurações
    if (this.config.debugMode) console.log('Carregando dados iniciais...');
    
    // Simular carregamento
    setTimeout(() => {
      this.state.dataLoaded = true;
      document.dispatchEvent(new CustomEvent('amica:dataLoaded'));
    }, 300);
  },
  
  // Manipular mudança de hash para navegação
  handleHashChange: function() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      this.state.currentSection = hash;
      document.dispatchEvent(new CustomEvent('amica:sectionChange', {
        detail: { section: hash }
      }));
    }
  },
  
  // Verificar se uma seção está visível na viewport
  isSectionVisible: function(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return false;
    
    const rect = section.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) && 
      rect.bottom >= 0
    );
  }
};

// Inicializar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  AMICA.init();
});
