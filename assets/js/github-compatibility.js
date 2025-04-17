/**
 * github-compatibility.js
 * Garante a compatibilidade com o GitHub Pages
 * 
 * Este script gerencia ajustes específicos para o funcionamento
 * do relatório quando hospedado no GitHub Pages, onde requisições AJAX
 * para arquivos HTML não são possíveis da mesma forma que em um servidor HTTP.
 */

// Função para verificar se estamos no GitHub Pages
function isGitHubPages() {
  return window.location.hostname.includes('github.io') || 
         window.location.hostname.includes('pages.github.com') ||
         window.location.hostname.includes('githubusercontent.com');
}

// Inicializar modo de compatibilidade apenas se estiver no GitHub Pages
function initCompatibilityMode() {
  if (!isGitHubPages()) {
    console.log('Não estamos no GitHub Pages, pulando o modo de compatibilidade.');
    return;
  }

  console.log('Iniciando modo de compatibilidade para GitHub Pages...');
  
  // Garantir que o aviso de protocolo file:// esteja escondido
  const fileProtocolWarning = document.getElementById('local-warning');
  if (fileProtocolWarning) {
    fileProtocolWarning.style.display = 'none';
  }
  
  // Também esconder o aviso importante para protocolo file://
  const importantNotice = document.getElementById('file-protocol-notice');
  if (importantNotice) {
    importantNotice.style.display = 'none';
  }
  
  // Garantir que apenas o aviso do GitHub Pages seja exibido
  const githubWarning = document.getElementById('github-warning');
  if (githubWarning) {
    githubWarning.style.display = 'block';
  }
  
  // Carregar conteúdo diretamente em vez de via AJAX
  loadContentDirectly();
  
  // Configurar navegação específica para GitHub Pages
  setupStaticNavigation();
}

// Função para carregar o conteúdo diretamente sem AJAX
function loadContentDirectly() {
  console.log('Configurando carregamento de conteúdo direto para GitHub Pages...');
  
  // Mapeamento de seções para seus respectivos arquivos HTML
  const sectionToFile = {
    'apresentacao': 'sections/apresentacao.html',
    'objetivos': 'sections/objetivos.html',
    'metodologia': 'sections/metodologia.html',
    'resultados': 'sections/resultados.html',
    'conclusoes': 'sections/conclusoes.html',
    'recomendacoes': 'sections/recomendacoes.html'
  };
  
  // Carregar o conteúdo de cada seção
  Object.keys(sectionToFile).forEach(sectionId => {
    loadSectionContent(sectionId, sectionToFile[sectionId]);
  });
}

// Carregar o conteúdo de uma seção específica
function loadSectionContent(sectionId, filePath) {
  const sectionContainer = document.getElementById(sectionId);
  if (!sectionContainer) {
    console.warn(`Contêiner para seção ${sectionId} não encontrado.`);
    return;
  }
  
  // Em um ambiente GitHub Pages, carregamos o conteúdo via fetch
  fetch(filePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      // Inserir o conteúdo HTML
      sectionContainer.innerHTML = html;
      
      // Processar scripts dentro do HTML carregado
      const scripts = sectionContainer.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        Array.from(script.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.appendChild(document.createTextNode(script.innerHTML));
        script.parentNode.replaceChild(newScript, script);
      });
      
      // Disparar evento de carregamento concluído
      document.dispatchEvent(new CustomEvent('amica:sectionLoaded', {
        detail: { section: sectionId }
      }));
      
      console.log(`Conteúdo carregado com sucesso para ${sectionId}`);
    })
    .catch(error => {
      console.error(`Erro ao carregar ${filePath}:`, error);
      
      // Em caso de erro, fornecer conteúdo estático como fallback
      sectionContainer.innerHTML = `
        <div class="error-container">
          <h2>Erro ao carregar conteúdo</h2>
          <p>Não foi possível carregar o conteúdo para a seção "${sectionId}".</p>
          <p>Detalhes do erro: ${error.message}</p>
        </div>
      `;
    });
}

// Configurar navegação estática para GitHub Pages
function setupStaticNavigation() {
  console.log('Configurando navegação estática para GitHub Pages...');
  
  // Selecionar todos os links de navegação
  const navLinks = document.querySelectorAll('nav a, .navbar a, [data-nav]');
  
  // Adicionar manipulador de eventos para cada link
  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      // Obter o ID da seção alvo do href ou data-section
      const href = link.getAttribute('href');
      const targetId = href ? href.replace('#', '') : link.getAttribute('data-section');
      
      if (targetId) {
        // Rolar até a seção
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          event.preventDefault();
          
          // Desativar todos os links ativos
          navLinks.forEach(l => l.classList.remove('active'));
          
          // Ativar este link
          link.classList.add('active');
          
          // Rolar suavemente até a seção
          targetSection.scrollIntoView({ behavior: 'smooth' });
          
          // Atualizar hash para manter a URL sincronizada
          window.history.pushState(null, null, `#${targetId}`);
          
          // Disparar evento para outros scripts
          document.dispatchEvent(new CustomEvent('amica:navigate', {
            detail: { section: targetId }
          }));
        }
      }
    });
  });
  
  // Verificar hash na URL e rolar para a seção correspondente
  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
      // Rolar para a seção com um pequeno atraso para garantir que tudo esteja carregado
      setTimeout(() => {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // Ativar o link correspondente
        const activeLink = document.querySelector(`a[href="#${targetId}"], [data-section="${targetId}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }, 500);
    }
  }
}

// Iniciar quando o evento personalizado for disparado
document.addEventListener('amica:init:github', function() {
  console.log('Evento amica:init:github recebido. Iniciando compatibilidade para GitHub Pages...');
  initCompatibilityMode();
});

// Também verificar no carregamento do documento, caso o evento já tenha sido disparado
document.addEventListener('DOMContentLoaded', function() {
  // Verificar se estamos no GitHub Pages
  if (isGitHubPages()) {
    console.log('GitHub Pages detectado no carregamento do documento.');
    
    // Verificar se AMICA já está disponível
    if (typeof AMICA !== 'undefined' && AMICA.state) {
      // Definir o flag no objeto AMICA
      AMICA.state.isGitHubPages = true;
      console.log('Estado do AMICA atualizado com flag isGitHubPages.');
    }
    
    // Iniciar modo de compatibilidade se ainda não foi iniciado
    if (!document.body.classList.contains('github-compatibility-initialized')) {
      initCompatibilityMode();
      document.body.classList.add('github-compatibility-initialized');
    }
  }
}); 