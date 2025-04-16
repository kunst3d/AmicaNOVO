/**
 * tab-navigation.js
 * Gerencia a navegação entre seções do relatório usando um sistema de tabs
 * Esta abordagem é mais simples e funciona sem servidor HTTP
 */

// Módulo de navegação por tabs
const AmicaTabNavigation = (function() {
  // Elementos DOM
  let tabLinks = [];
  let allSections = [];
  
  // Estado
  let currentSection = '';
  
  // Inicialização
  function init() {
    console.log('Inicializando navegação por tabs...');
    
    // Obter referências DOM
    tabLinks = document.querySelectorAll('.sidebar-nav__link');
    allSections = document.querySelectorAll('.content-section');
    
    if (tabLinks.length === 0 || allSections.length === 0) {
      console.error('Erro: Links de navegação ou seções não encontrados!');
      return;
    }
    
    // Configurar eventos de clique
    setupEventListeners();
    
    // Verificar hash inicial
    checkInitialHash();
    
    console.log('Navegação por tabs inicializada com sucesso!');
  }
  
  // Configurar eventos de clique
  function setupEventListeners() {
    tabLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('href').replace('#', '');
        showSection(sectionId);
        
        // Atualizar URL sem recarregar (opcional)
        history.pushState(null, null, `#${sectionId}`);
      });
    });
    
    // Ouvir mudanças na hash da URL
    window.addEventListener('hashchange', function() {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        showSection(hash);
      }
    });
  }
  
  // Verificar hash inicial na URL
  function checkInitialHash() {
    const hash = window.location.hash.replace('#', '');
    const initialSection = hash || 'analise-mercado'; // Seção padrão
    showSection(initialSection);
  }
  
  // Mostrar a seção selecionada e ocultar as outras
  function showSection(sectionId) {
    if (currentSection === sectionId) return; // Evitar redefinir a mesma seção
    
    console.log(`Navegando para seção: ${sectionId}`);
    currentSection = sectionId;
    
    // Ocultar todas as seções
    allSections.forEach(section => {
      section.style.display = 'none';
    });
    
    // Exibir apenas a seção selecionada
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
      activeSection.style.display = 'block';
      
      // Disparar evento para outros módulos (carregador de conteúdo, gráficos, etc.)
      document.dispatchEvent(new CustomEvent('amica:sectionChange', {
        detail: { section: sectionId }
      }));
      
      // Se o conteúdo ainda não foi carregado, tente carregar usando o AmicaContentLoader
      if (typeof AmicaContentLoader !== 'undefined' && AmicaContentLoader.loadSection) {
        AmicaContentLoader.loadSection(sectionId);
      }
    } else {
      console.error(`Erro: Seção #${sectionId} não encontrada no DOM!`);
    }
    
    // Atualizar classes ativas nos links
    tabLinks.forEach(link => {
      const linkSectionId = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', linkSectionId === sectionId);
    });
  }
  
  // API pública
  return {
    init: init,
    showSection: showSection
  };
})();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  AmicaTabNavigation.init();
}); 