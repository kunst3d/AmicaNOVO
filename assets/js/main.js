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
    
    // ---> ALTERAÇÃO: Verificação direta do hostname
    const isGithubPages = window.location.hostname.includes('github.io');
    this.state.isGitHubPages = isGithubPages; // Ainda mantemos a variável de estado para compatibilidade
    
    if (isGithubPages) {
      if (this.config.debugMode) console.log('GitHub Pages detectado: pulando inicialização padrão de eventos/dados em main.js');
      this.checkEnvironment(); // Ainda checar e adicionar classe
      this.detectDevice(); // Detectar mobile ainda é útil
      // NÃO chamar setupEventListeners() nem loadInitialData()
      document.dispatchEvent(new CustomEvent('amica:init:github')); // Evento específico para GH Pages
      if (this.config.debugMode) console.log('Inicialização para GitHub Pages concluída em main.js.');
      return; // Interrompe a inicialização padrão
    }
    // <--- FIM DA ALTERAÇÃO
    
    // Verificar ambiente
    this.checkEnvironment();
    
    // Detectar dispositivo
    this.detectDevice();
    
    // Configurar manipuladores de eventos
    this.setupEventListeners();
    
    // Carregar dados iniciais
    this.loadInitialData();
    
    // Inicializar componentes
    document.dispatchEvent(new CustomEvent('amica:init'));
    
    if (this.config.debugMode) console.log('Aplicação inicializada com sucesso!');
  },
  
  // Verificar ambiente de execução
  checkEnvironment: function() {
    // Verificar se está sendo acessado via protocolo file://
    if (this.state.isFileProtocol && !this.state.isGitHubPages) {
      console.warn('Aviso: Este relatório está sendo acessado via protocolo file://. ' +
                   'Algumas funcionalidades, como carregamento dinâmico de conteúdo, podem não funcionar corretamente. ' +
                   'Recomendamos o uso de um servidor HTTP local.');
      
      // Adicionar classe para estilização específica
      document.body.classList.add('is-file-protocol');
      
      // Configurar compatibilidade com protocolo file://
      this.setupFileProtocolCompatibility();
      
      // Disparar evento para possíveis ajustes em outros módulos
      document.dispatchEvent(new CustomEvent('amica:fileProtocolDetected'));
    }
    
    // Verificar se está no GitHub Pages
    if (this.state.isGitHubPages) {
      document.body.classList.add('is-github-pages');
      if (this.config.debugMode) console.log('GitHub Pages detectado, modo de compatibilidade será aplicado');
      
      // Quando estamos no GitHub Pages, esconder o aviso de protocolo file
      const fileProtocolWarning = document.querySelector('.file-protocol-warning');
      if (fileProtocolWarning) {
        fileProtocolWarning.style.display = 'none';
      }
      
      // Esconder também o aviso importante
      const importantNotice = document.querySelector('.important-notice');
      if (importantNotice) {
        importantNotice.style.display = 'none';
      }
    }
  },
  
  // Configurar compatibilidade com protocolo file://
  setupFileProtocolCompatibility: function() {
    // Se já foi consertado ou estamos no GitHub Pages, não fazer novamente
    if (this.state.hasFixedFileProtocolIssue || this.state.isGitHubPages) return;
    
    // Mostrar aviso de protocolo file:// apenas se não estiver no GitHub Pages
    const fileProtocolWarning = document.querySelector('.file-protocol-warning');
    if (fileProtocolWarning && !this.state.isGitHubPages) {
      fileProtocolWarning.style.display = 'block';
    }
    
    // Mostrar aviso importante apenas se não estiver no GitHub Pages
    const importantNotice = document.querySelector('.important-notice');
    if (importantNotice && !this.state.isGitHubPages) {
      importantNotice.style.display = 'block';
    }
    
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
      }, 500);
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
