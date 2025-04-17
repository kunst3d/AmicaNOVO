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
    isGitHubPages: false
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
    
    // Inicializar navegação simples (sem AJAX)
    this.setupDirectNavigation();
    
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
  
  // Configurar navegação direta entre seções (sem AJAX)
  setupDirectNavigation: function() {
    // Pré-carregar todas as seções do diretório content/
    this.preloadAllSections();
    
    // Configurar links de navegação
    const navLinks = document.querySelectorAll('.sidebar-nav__link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Obter o ID da seção
        const sectionId = link.getAttribute('href').substring(1);
        
        // Atualizar links ativos
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Mostrar a seção correspondente
        this.showSection(sectionId);
        
        // Atualizar URL
        window.location.hash = sectionId;
      });
    });
    
    // Lidar com navegação por hash na URL
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1);
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
    
    // Carregar seção inicial baseada na URL ou a primeira
    this.loadInitialSection();
  },
  
  // Pré-carregar todas as seções
  preloadAllSections: function() {
    // Em uma implementação real, você carregaria todas as seções aqui
    // Para simplificar, vamos apenas exibir uma mensagem temporária em cada seção
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
      const placeholder = section.querySelector('.section-content-placeholder');
      if (placeholder) {
        placeholder.innerHTML = `
          <div class="content-card">
            <h2>Seção ${section.id}</h2>
            <p>Este é um conteúdo temporário para a seção ${section.id}.</p>
            <p>Em uma implementação completa, o conteúdo seria carregado do arquivo content/${section.id}.html.</p>
          </div>
        `;
      }
    });
  },
  
  // Mostrar uma seção específica
  showSection: function(sectionId) {
    // Ocultar todas as seções
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
      section.style.display = 'none';
    });
    
    // Mostrar a seção solicitada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.style.display = 'block';
      this.state.currentSection = sectionId;
      window.scrollTo(0, 0);
      console.log(`Seção exibida: ${sectionId}`);
    } else {
      console.error(`Seção não encontrada: ${sectionId}`);
    }
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
      // Mostrar a seção inicial
      this.showSection(initialSection);
      
      // Atualizar o link ativo
      const activeLink = document.querySelector(`.sidebar-nav__link[href="#${initialSection}"]`);
      if (activeLink) {
        document.querySelectorAll('.sidebar-nav__link').forEach(l => l.classList.remove('active'));
        activeLink.classList.add('active');
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
