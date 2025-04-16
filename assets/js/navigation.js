/**
 * navigation.js
 * Gerencia a navegação entre seções do relatório
 * Controla o menu lateral, navegação móvel e destacamento de seções ativas
 */

// Módulo de Navegação
const AmicaNavigation = (function() {
  // Elementos do DOM
  let nav = null;
  let navLinks = [];
  let navToggle = null;
  let contentContainer = null;
  
  // Estado
  let activeSection = '';
  let isNavOpen = false;
  
  // Inicialização
  function init() {
    console.log('Inicializando navegação...');
    
    // Capturar elementos
    nav = document.querySelector('.main-nav');
    navLinks = document.querySelectorAll('.sidebar-nav__link');
    navToggle = document.querySelector('.nav-toggle') || createNavToggle();
    contentContainer = document.getElementById('content-container');
    
    // Configurar listeners de eventos
    setupEventListeners();
    
    // Verificar hash inicial
    checkInitialHash();
    
    console.log('Navegação inicializada com sucesso!');
  }
  
  // Criar botão de toggle para mobile (se não existir no HTML)
  function createNavToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Abrir menu');
    
    for (let i = 0; i < 3; i++) {
      const line = document.createElement('span');
      line.className = 'nav-toggle__line';
      toggle.appendChild(line);
    }
    
    // Inserir antes da navegação principal
    if (nav && nav.parentNode) {
      nav.parentNode.insertBefore(toggle, nav);
    }
    
    return toggle;
  }
  
  // Configurar manipuladores de eventos
  function setupEventListeners() {
    // Eventos para links de navegação
    navLinks.forEach(link => {
      link.addEventListener('click', handleNavLinkClick);
    });
    
    // Toggle do menu em dispositivos móveis
    if (navToggle) {
      navToggle.addEventListener('click', toggleMobileNav);
    }
    
    // Fechar menu ao clicar fora em dispositivos móveis
    document.addEventListener('click', (e) => {
      const isClickInside = nav.contains(e.target) || navToggle.contains(e.target);
      
      if (!isClickInside && isNavOpen && AMICA.state.isMobile) {
        closeMobileNav();
      }
    });
    
    // Atualizar navegação ao mudar de seção
    document.addEventListener('amica:sectionChange', (e) => {
      if (e.detail && e.detail.section) {
        updateActiveNavLink(e.detail.section);
      }
    });
    
    // Ajustar navegação em resize
    document.addEventListener('amica:resize', () => {
      if (!AMICA.state.isMobile && isNavOpen) {
        resetMobileNav();
      }
    });
  }
  
  // Verificar hash na URL inicial
  function checkInitialHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      updateActiveNavLink(hash);
    } else if (navLinks.length > 0) {
      // Ativar primeiro link se não houver hash
      const firstSection = navLinks[0].getAttribute('href').replace('#', '');
      updateActiveNavLink(firstSection);
    }
  }
  
  // Manipular clique em link de navegação
  function handleNavLinkClick(e) {
    const sectionId = this.getAttribute('href').replace('#', '');
    updateActiveNavLink(sectionId);
    
    // Fechar menu em dispositivos móveis após clicar
    if (AMICA.state.isMobile) {
      closeMobileNav();
    }
  }
  
  // Atualizar link ativo na navegação
  function updateActiveNavLink(sectionId) {
    // Armazenar seção ativa
    activeSection = sectionId;
    
    // Remover classe ativa de todos os links
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // Adicionar classe ativa ao link correspondente
    const activeLink = document.querySelector(`.sidebar-nav__link[href="#${sectionId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
  
  // Alternar navegação móvel
  function toggleMobileNav() {
    if (isNavOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }
  
  // Abrir navegação móvel
  function openMobileNav() {
    nav.classList.add('active');
    document.body.classList.add('nav-open');
    navToggle.classList.add('active');
    isNavOpen = true;
    AMICA.state.navOpen = true;
  }
  
  // Fechar navegação móvel
  function closeMobileNav() {
    nav.classList.remove('active');
    document.body.classList.remove('nav-open');
    navToggle.classList.remove('active');
    isNavOpen = false;
    AMICA.state.navOpen = false;
  }
  
  // Resetar estado da navegação
  function resetMobileNav() {
    closeMobileNav();
  }
  
  // API pública
  return {
    init: init,
    updateActiveLink: updateActiveNavLink,
    openNav: openMobileNav,
    closeNav: closeMobileNav,
    toggleNav: toggleMobileNav
  };
})();

// Inicializar navegação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  AmicaNavigation.init();
});
