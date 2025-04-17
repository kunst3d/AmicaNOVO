/**
 * main.js
 * Script principal do Relatório Amica
 * Otimizado para GitHub Pages e carregamento dinâmico de conteúdo
 */

const AMICA = {
  // Configurações principais da aplicação
  config: {
    breakpoints: {
      mobile: 576,
      tablet: 992,
      desktop: 1200
    },
    mobileBreakpoint: 768,
    tabletBreakpoint: 1024,
    desktopBreakpoint: 1440,
    transitionDuration: 300,
    debugMode: true,
    contentPath: 'content/' // Caminho para os arquivos de conteúdo
  },
  
  // Estado da aplicação
  state: {
    currentSection: null,
    isMobile: window.innerWidth <= AMICA.config.breakpoints.mobile,
    isTablet: window.innerWidth > AMICA.config.breakpoints.mobile && window.innerWidth <= AMICA.config.breakpoints.tablet,
    isDesktop: window.innerWidth > AMICA.config.breakpoints.tablet,
    sectionsLoaded: {},
    isGitHubPages: false,
    navOpen: false
  },
  
  // Inicialização da aplicação
  init: function() {
    console.log("Inicializando aplicação...");
    
    // Oculta todos os avisos inicialmente
    document.getElementById('github-notice').style.display = 'none';
    document.getElementById('local-notice').style.display = 'none';
    
    // Determina o ambiente e mostra avisos apropriados
    if (this.checkIfGitHubPages()) {
      console.log("Executando no GitHub Pages. Ativando modo de compatibilidade.");
      document.getElementById('github-notice').style.display = 'block';
      // Em GitHub Pages, carregamos o conteúdo diretamente, sem AJAX
      this.setupStaticNavigation();
    } else if (this.isFileProtocol()) {
      console.log("Protocolo file:// detectado. Exibindo aviso de acesso local.");
      document.getElementById('local-notice').style.display = 'block';
      // Para protocolo file://, também usamos navegação estática
      this.setupStaticNavigation();
    } else {
      // Em servidor HTTP normal, usamos carregamento AJAX
      console.log("Executando em servidor HTTP. Usando navegação dinâmica.");
      this.setupNavigation();
    }
    
    // Configura outros componentes da aplicação
    window.addEventListener('resize', this.handleResize);
    this.setupMobileNav();
    
    // Inicializa a primeira seção
    this.loadInitialSection();
    
    // Detectar tamanho de tela
    this.detectScreenSize();
    
    // Adicionar classe para habilitar animações após carregamento
    document.body.classList.add('is-loaded');
    
    if (this.config.debugMode) {
      console.log(`Relatório Amica inicializado. GitHub Pages: ${this.state.isGitHubPages}`);
    }
  },
  
  // Verificar se estamos no GitHub Pages
  checkIfGitHubPages: function() {
    const hostname = window.location.hostname;
    return hostname.includes('github.io') || 
           hostname.includes('githubusercontent.com') || 
           hostname.includes('pages.github.com');
  },
  
  // Verificar se está sendo acessado via protocolo file://
  isFileProtocol: function() {
    return window.location.protocol === 'file:';
  },
  
  // Configurar navegação entre seções
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
        window.history.pushState(null, null, `#${sectionId}`);
        
        // Log para debugging
        if (this.config.debugMode) {
          console.log(`Navegação: Clique em ${sectionId}`);
        }
      });
    });
    
    // Lidar com navegação através do hash na URL
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        this.loadSection(hash);
        
        // Atualizar link ativo
        const activeLink = document.querySelector(`.sidebar-nav__link[href="#${hash}"]`);
        if (activeLink) {
          const navLinks = document.querySelectorAll('.sidebar-nav__link');
          navLinks.forEach(l => l.classList.remove('active'));
          activeLink.classList.add('active');
        }
        
        // Log para debugging
        if (this.config.debugMode) {
          console.log(`Navegação: Hash alterado para ${hash}`);
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
  
  // Carregar conteúdo da seção a partir do arquivo HTML correspondente
  loadSection: function(sectionId) {
    // Atualizar estado
    this.state.currentSection = sectionId;
    
    // Log para debugging
    if (this.config.debugMode) {
      console.log(`loadSection: Tentando carregar seção ${sectionId}`);
    }
    
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
    const filePath = `${this.config.contentPath}${sectionId}.html`;
    
    // Carregar o conteúdo via AJAX
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro ao carregar ${filePath}: ${response.status}`);
        }
        return response.text();
      })
      .then(htmlContent => {
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
    
    if (this.config.debugMode) {
      console.log(`showLoadedSection: Seção ${sectionId} exibida com sucesso`);
    }
  },
  
  // Inicializar gráficos na seção
  initSectionCharts: function(section) {
    if (typeof Chart === 'undefined') return;
    
    const canvases = section.querySelectorAll('canvas[data-chart-type]');
    if (this.config.debugMode && canvases.length > 0) {
      console.log(`Inicializando ${canvases.length} gráficos na seção ${section.id}`);
    }
    
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
        
        if (this.config.debugMode) {
          console.log(`Gráfico ${canvas.id} inicializado com sucesso`);
        }
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
      if (this.config.debugMode) {
        console.log(`loadInitialSection: Usando hash da URL: ${initialSection}`);
      }
    } else {
      // Caso contrário, usar a primeira seção
      const firstLink = document.querySelector('.sidebar-nav__link');
      if (firstLink) {
        initialSection = firstLink.getAttribute('href').substring(1);
        if (this.config.debugMode) {
          console.log(`loadInitialSection: Usando primeira seção do menu: ${initialSection}`);
        }
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
        if (this.config.debugMode) {
          console.log(`loadInitialSection: Link ativo atualizado para ${initialSection}`);
        }
      }
    } else {
      console.warn('loadInitialSection: Não foi possível determinar a seção inicial');
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
  
  // Configurar navegação estática
  setupStaticNavigation: function() {
    // Quando usando file:// ou GitHub Pages, carregamos o conteúdo diretamente em vez de AJAX
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    
    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Obter o ID da seção a partir do atributo href
        const sectionId = link.getAttribute('href').substring(1);
        
        // Atualizar URL com hash
        window.location.hash = sectionId;
        
        // Rolar para a seção correspondente
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
          // Remover classe ativa de todos os links
          menuLinks.forEach(l => l.classList.remove('active'));
          
          // Adicionar classe ativa ao link clicado
          link.classList.add('active');
          
          // Rolar para a seção
          targetSection.scrollIntoView({ behavior: 'smooth' });
          
          // Atualizar estado da aplicação
          this.state.currentSection = sectionId;
          
          // Fechar menu móvel se estiver aberto
          this.closeNavIfMobile();
        }
      });
    });
    
    // Inicializar a primeira seção com base na URL
    this.loadInitialSectionStatic();
  },
  
  // Carregar seção inicial em modo estático
  loadInitialSectionStatic: function() {
    const hash = window.location.hash.substring(1);
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    
    if (hash) {
      // Se temos um hash na URL, ativar a seção correspondente
      const targetLink = document.querySelector(`.sidebar-menu a[href="#${hash}"]`);
      if (targetLink) {
        targetLink.classList.add('active');
        
        // Rolar para a seção
        const targetSection = document.getElementById(hash);
        if (targetSection) {
          targetSection.scrollIntoView();
          this.state.currentSection = hash;
        }
      }
    } else if (menuLinks.length > 0) {
      // Sem hash, ativar a primeira seção
      const firstLink = menuLinks[0];
      const firstSectionId = firstLink.getAttribute('href').substring(1);
      
      firstLink.classList.add('active');
      window.location.hash = firstSectionId;
      
      const firstSection = document.getElementById(firstSectionId);
      if (firstSection) {
        firstSection.scrollIntoView();
        this.state.currentSection = firstSectionId;
      }
    }
  },
  
  // Fechar menu móvel se estiver em modo móvel
  closeNavIfMobile: function() {
    if (this.state.isMobile && this.state.navOpen) {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.remove('open');
        this.state.navOpen = false;
      }
    }
  },
  
  // Configurar navegação mobile
  setupMobileNav: function() {
    const toggleBtn = document.querySelector('.nav-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        this.state.navOpen = !this.state.navOpen;
      });
      
      // Fechar ao clicar fora do menu
      document.addEventListener('click', (e) => {
        if (this.state.navOpen && 
            !sidebar.contains(e.target) && 
            !toggleBtn.contains(e.target)) {
          sidebar.classList.remove('open');
          this.state.navOpen = false;
        }
      });
    }
  },
  
  // Configurar navegação desktop
  setupDesktopNav: function() {
    // Implemente a lógica para navegação desktop
  },
  
  // Configurar navegação responsiva
  setupResponsiveNav: function() {
    // Implemente a lógica para navegação responsiva
  },
  
  // Tratar redimensionamento da janela
  handleResize: function() {
    const oldState = { ...this.state };
    
    // Atualizar estado baseado no tamanho atual da janela
    this.state.isMobile = window.innerWidth <= this.config.breakpoints.mobile;
    this.state.isTablet = window.innerWidth > this.config.breakpoints.mobile && window.innerWidth <= this.config.breakpoints.tablet;
    this.state.isDesktop = window.innerWidth > this.config.breakpoints.tablet;
    
    // Se mudou de tamanho (mobile/tablet/desktop), ajustar a UI
    if (oldState.isMobile !== this.state.isMobile || 
        oldState.isTablet !== this.state.isTablet || 
        oldState.isDesktop !== this.state.isDesktop) {
      this.detectScreenSize();
      
      // Fechar menu móvel quando alternar para desktop
      if (oldState.isMobile && !this.state.isMobile) {
        this.closeNavIfMobile();
      }
    }
  }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  AMICA.init();
});
