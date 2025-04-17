/**
 * main.js
 * Script principal do Relatório Amica
 * Otimizado exclusivamente para GitHub Pages
 */

const AMICA = {
  // Configuração da aplicação
  config: {
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024,
    desktopBreakpoint: 1440,
    transitionDuration: 300,
    debugMode: false
  },
  
  // Estado da aplicação
  state: {
    currentSection: null,
    isMobile: window.innerWidth < 768,
    sectionsLoaded: {}
  },
  
  // Inicialização da aplicação
  init: function() {
    // Configuração específica para GitHub Pages
    this.setupBaseHref();
    
    // Mostrar aviso do GitHub Pages
    this.showGitHubPagesNotice();
    
    // Inicializar navegação
    this.setupNavigation();
    
    // Detectar tamanho de tela
    this.detectScreenSize();
    
    // Carregar seção inicial baseada na URL ou mostrar a primeira
    this.loadInitialSection();
    
    // Adicionar classe para habilitar animações após carregamento
    document.body.classList.add('is-loaded');
    
    if (this.config.debugMode) {
      console.log('Relatório Amica inicializado para GitHub Pages');
    }
  },
  
  // Configurar base href para GitHub Pages
  setupBaseHref: function() {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1) {
      const repoName = pathParts[1];
      // Verificar se não estamos na raiz e se um nome de repositório válido foi encontrado
      if (repoName && repoName !== '') {
        const baseTag = document.createElement('base');
        baseTag.href = `/${repoName}/`;
        document.head.appendChild(baseTag);
        
        if (this.config.debugMode) {
          console.log(`Base href configurada para: /${repoName}/`);
        }
      }
    }
  },
  
  // Mostrar aviso simples do GitHub Pages
  showGitHubPagesNotice: function() {
    const githubNotice = document.getElementById('github-notice');
    if (githubNotice) {
      githubNotice.style.display = 'block';
    }
  },
  
  // Configurar navegação entre seções
  setupNavigation: function() {
    // Selecionar links de navegação
    const navLinks = document.querySelectorAll('.sidebar-nav__link');
    
    // Adicionar evento de clique a cada link
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remover classe ativa de todos os links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Adicionar classe ativa ao link clicado
        link.classList.add('active');
        
        // Obter o ID da seção do atributo href
        const sectionId = link.getAttribute('href').substring(1);
        
        // Mostrar a seção correspondente
        this.showSection(sectionId);
        
        // Atualizar URL
        window.history.pushState(null, null, `#${sectionId}`);
      });
    });
    
    // Lidar com navegação através do hash na URL
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
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
  
  // Detectar tamanho da tela e aplicar classes apropriadas
  detectScreenSize: function() {
    const checkScreenSize = () => {
      this.state.isMobile = window.innerWidth < this.config.mobileBreakpoint;
      document.body.classList.toggle('is-mobile', this.state.isMobile);
      
      if (window.innerWidth < this.config.tabletBreakpoint) {
        document.body.classList.add('is-tablet');
        document.body.classList.remove('is-desktop');
      } else {
        document.body.classList.remove('is-tablet');
        document.body.classList.add('is-desktop');
      }
    };
    
    // Verificar inicialmente
    checkScreenSize();
    
    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkScreenSize);
  },
  
  // Mostrar seção específica e ocultar as demais
  showSection: function(sectionId) {
    // Atualizar estado
    this.state.currentSection = sectionId;
    
    // Selecionar todas as seções
    const sections = document.querySelectorAll('.content-section');
    
    // Ocultar todas as seções
    sections.forEach(section => {
      section.style.display = 'none';
    });
    
    // Mostrar a seção solicitada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.style.display = 'block';
      
      // Rolar para o topo da seção
      window.scrollTo(0, 0);
      
      // Inicializar gráficos se presentes nesta seção
      this.initSectionCharts(targetSection);
    }
  },
  
  // Inicializar gráficos na seção
  initSectionCharts: function(section) {
    if (typeof Chart === 'undefined') return;
    
    const canvases = section.querySelectorAll('canvas[data-chart-type]');
    canvases.forEach(canvas => {
      try {
        // Verificar se o canvas já tem um gráfico
        if (canvas._chart) {
          canvas._chart.destroy();
        }
        
        // Obter os dados e opções do gráfico
        const chartType = canvas.getAttribute('data-chart-type');
        const chartData = JSON.parse(canvas.getAttribute('data-chart-data') || '{}');
        const chartOptions = JSON.parse(canvas.getAttribute('data-chart-options') || '{}');
        
        // Criar o gráfico
        canvas._chart = new Chart(canvas, {
          type: chartType,
          data: chartData,
          options: chartOptions
        });
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
    } else {
      // Caso contrário, usar a primeira seção
      const firstLink = document.querySelector('.sidebar-nav__link');
      if (firstLink) {
        initialSection = firstLink.getAttribute('href').substring(1);
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
    }
  }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  AMICA.init();
});
