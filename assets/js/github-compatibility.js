/**
 * github-compatibility.js
 * Script para garantir compatibilidade quando hospedado no GitHub Pages
 */

// Detectar se estamos no GitHub Pages
function isGitHubPages() {
    const hostname = window.location.hostname;
    return hostname.includes('github.io') || 
           hostname.includes('githubusercontent.com') || 
           hostname.includes('pages.github.com');
}

// Inicializar o modo compatibilidade para GitHub Pages
function initCompatibilityMode() {
    // Somente ativar se estivermos no GitHub Pages
    if (!isGitHubPages()) {
        console.log('Não está no GitHub Pages, pulando configuração de compatibilidade');
        return;
    }
    
    console.log('Ativando modo de compatibilidade para GitHub Pages');
    
    // 1. Configurar base href
    setupBaseHref();
    
    // 2. Ativar aviso de GitHub Pages
    document.getElementById('github-notice').style.display = 'block';
    
    // 3. Esconder aviso de acesso local
    const localNotice = document.getElementById('local-notice');
    if (localNotice) {
        localNotice.style.display = 'none';
    }
    
    // 4. Disparar evento para informar que estamos no modo GitHub Pages
    document.dispatchEvent(new CustomEvent('amica:githubPages', {
        detail: { isGitHubPages: true }
    }));
    
    console.log('Modo de compatibilidade para GitHub Pages ativado');
}

// Configurar base href para o repositório GitHub Pages
function setupBaseHref() {
    try {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1) {
            const repoName = pathParts[1];
            if (repoName && repoName !== '') {
                // Verificar se já existe um elemento base
                let baseTag = document.querySelector('base');
                
                if (!baseTag) {
                    baseTag = document.createElement('base');
                    document.head.prepend(baseTag);
                }
                
                baseTag.href = `/${repoName}/`;
                console.log(`Base href configurada para: /${repoName}/`);
            }
        }
    } catch (error) {
        console.error('Erro ao configurar base href:', error);
    }
}

// Configurar carregamento assíncrono de scripts
function loadScriptAsync(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = true;
        
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Falha ao carregar script: ${url}`));
        
        document.head.appendChild(script);
    });
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    initCompatibilityMode();
}); 