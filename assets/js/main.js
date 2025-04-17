/**
 * main.js - Versão para Relatório Amica
 * Carregamento dinâmico com tratamento de codificação
 */

// Funções utilitárias para gráficos
const ChartUtils = {
    // Paleta de cores: Prioriza CSS, fallback elegante
    getColorPalette: function() {
        const style = getComputedStyle(document.documentElement);
        const cssPalette = [
            style.getPropertyValue('--color-chart-1')?.trim(), 
            style.getPropertyValue('--color-chart-2')?.trim(),
            style.getPropertyValue('--color-chart-3')?.trim(),
            style.getPropertyValue('--color-chart-4')?.trim(),
            style.getPropertyValue('--color-chart-5')?.trim(),
            style.getPropertyValue('--color-chart-6')?.trim(),
            style.getPropertyValue('--color-chart-7')?.trim(),
            style.getPropertyValue('--color-chart-8')?.trim()
        ].filter(color => color); 

        if (cssPalette.length >= 6) { // Exige pelo menos 6 cores do CSS
            console.log("Usando paleta de cores do CSS.");
            return cssPalette;
        }
        
        console.warn("Paleta CSS incompleta ou inválida, usando fallback.");
        // Paleta fallback mais sóbria e elegante
        return [
            '#2A4B45', // Verde Escuro
            '#A67C52', // Marrom Médio
            '#6B8E8A', // Verde Acinzentado
            '#D9C2A7', // Bege Claro
            '#E8B478', // Laranja Claro (usar com moderação)
            '#8B653E', // Marrom Dourado Escuro
            '#3D6A61', // Verde Secundário Claro
            '#C19A76'  // Marrom Primário Claro
        ];
    },

    // Aplicar paleta com mais refinamento
    applyPalette: function(datasets, chartType) {
        const palette = this.getColorPalette();
        datasets.forEach((dataset, index) => {
            const colorIndex = index % palette.length;
            const mainColor = palette[colorIndex];
            
            // Cores
            dataset.borderColor = dataset.borderColor || mainColor;
            if (dataset.backgroundColor === undefined) {
                if (['line', 'radar'].includes(chartType)) {
                    // Linha/Radar: Apenas borda colorida, fundo transparente ou leve gradiente
                    dataset.backgroundColor = this.hexToRgba(mainColor, 0.15); // Muito sutil
                    dataset.fill = true;
                } else if (chartType === 'bar') {
                    dataset.backgroundColor = this.hexToRgba(mainColor, 0.75); // Barras mais sólidas
                } else if (['pie', 'doughnut'].includes(chartType)) {
                    dataset.backgroundColor = dataset.data.map((_, dataIndex) => palette[dataIndex % palette.length]);
                    dataset.hoverOffset = dataset.hoverOffset ?? 8;
                } else {
                    dataset.backgroundColor = mainColor;
                }
            }
            
            // Estilos específicos
            if (chartType === 'line') {
                dataset.tension = dataset.tension ?? 0.4; // Linha um pouco mais suave
                dataset.borderWidth = dataset.borderWidth ?? 1.5; // Linha mais fina
                dataset.pointRadius = dataset.pointRadius ?? 2; // Pontos menores
                dataset.pointHoverRadius = dataset.pointHoverRadius ?? 4;
                dataset.pointBackgroundColor = dataset.pointBackgroundColor || mainColor;
                dataset.pointBorderColor = dataset.pointBorderColor || '#fff'; 
            }
            if (chartType === 'bar') {
                dataset.borderRadius = 0; // Remove cantos arredondados para minimalismo
                dataset.borderWidth = dataset.borderWidth ?? 0;
            }
            if (chartType === 'radar') {
                dataset.borderWidth = dataset.borderWidth ?? 1.5;
                dataset.pointRadius = dataset.pointRadius ?? 2;
                dataset.pointHoverRadius = dataset.pointHoverRadius ?? 4;
            }
        });
    },
    
    // hexToRgba (sem alterações)
    hexToRgba: function(hex, alpha) {
        let r = 0, g = 0, b = 0;
        if (hex.length == 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length == 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }
        return `rgba(${r},${g},${b},${alpha})`;
    },

    // Opções padrão - Foco em Minimalismo e Elegância
    getDefaultOptions: function() {
        const style = getComputedStyle(document.documentElement);
        const gridColor = style.getPropertyValue('--color-chart-grid')?.trim() || 'rgba(0, 0, 0, 0.05)'; // Grid ainda mais sutil
        const textColor = style.getPropertyValue('--color-chart-text')?.trim() || '#666'; // Cinza um pouco mais claro
        const fontFamily = style.getPropertyValue('--font-family-secondary')?.trim() || 'Inter, sans-serif';
        const titleFontFamily = style.getPropertyValue('--font-family-primary')?.trim() || 'Cormorant Garamond, serif';

        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    align: 'center', // Alinha itens da legenda
                    labels: {
                        color: textColor,
                        font: { family: fontFamily, size: 11 }, // Fonte menor
                        boxWidth: 10, // Caixa menor
                        boxHeight: 10, // Caixa quadrada
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: '#fff', // Fundo branco
                    borderColor: '#eee', // Borda clara
                    borderWidth: 1,
                    titleFont: { family: titleFontFamily, size: 13, weight: 'bold' },
                    titleColor: '#333', // Cor do título
                    bodyFont: { family: fontFamily, size: 11 },
                    bodyColor: '#555', // Cor do corpo
                    padding: 10,
                    cornerRadius: 2, // Menos arredondado ainda
                    displayColors: false,
                    boxPadding: 4,
                    // Callbacks para customizar (opcional)
                    // callbacks: { label: function(context) { return context.formattedValue; } }
                },
                title: { // Título do gráfico (opcional)
                    display: false, // Desabilitado por padrão, habilitar se necessário nos dados
                    text: '',
                    padding: { top: 5, bottom: 15 },
                    font: { family: titleFontFamily, size: 16, weight: '600' }, // Semibold
                    color: '#333'
                }
            },
            scales: {
                x: {
                    border: { display: false }, // Sem linha do eixo
                    grid: { display: false }, // Sem grade vertical
                    ticks: {
                        color: textColor,
                        font: { family: fontFamily, size: 10 }, // Ticks menores
                        padding: 8
                    }
                },
                y: {
                    border: { display: false }, // Sem linha do eixo
                    grid: {
                        color: gridColor, // Grade horizontal MUITO sutil
                        drawBorder: false,
                        drawTicks: false, // Remove pequenos ticks no eixo
                        // borderDash: [2, 3], // Linha tracejada se preferir
                    },
                    ticks: {
                        color: textColor,
                        font: { family: fontFamily, size: 10 }, // Ticks menores
                        padding: 10
                    }
                }
            },
            animation: {
              duration: 0 // Remove animação para visual mais estático/minimalista
            },
            layout: {
              padding: {
                top: 5, right: 5, bottom: 0, left: 0 // Menos padding interno
              }
            }
        };
    }
};

const AMICA = {
  // Configurações da aplicação
  config: {
    debugMode: true,
    contentPath: 'content/' // Caminho para os arquivos de conteúdo
  },
  
  // Estado da aplicação
  state: {
    currentSection: null,
    isGitHubPages: false,
    sectionsLoaded: {} // Cache para conteúdo carregado
  },
  
  // Inicialização da aplicação
  init: function() {
    console.log("Inicializando aplicação...");
    
    // Verificar se estamos no GitHub Pages
    this.state.isGitHubPages = this.checkIfGitHubPages();
    
    // Configurar base href e mostrar avisos
    if (this.state.isGitHubPages) {
      console.log("Executando no GitHub Pages, configurando base href");
      document.getElementById('github-notice').style.display = 'block';
      this.setupBaseHref();
    } else {
      console.log("Não está no GitHub Pages, mostrando aviso local");
      document.getElementById('local-notice').style.display = 'block';
    }
    
    // Garantir codificação UTF-8 na página principal
    this.ensureUtf8Encoding();
    
    // Inicializar navegação
    this.setupNavigation();
    
    // Carregar seção inicial baseada na URL ou mostrar a primeira
    this.loadInitialSection();
    
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
    // Assegura meta tags UTF-8 no <head>
    let charsetMeta = document.querySelector('meta[charset]');
    if (!charsetMeta) {
      charsetMeta = document.createElement('meta');
      charsetMeta.setAttribute('charset', 'UTF-8');
      document.head.insertBefore(charsetMeta, document.head.firstChild);
    } else {
      charsetMeta.setAttribute('charset', 'UTF-8');
    }
    
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
    const navLinks = document.querySelectorAll('.sidebar-nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('href').substring(1);
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        this.loadSection(sectionId);
        window.location.hash = sectionId;
      });
    });

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        this.loadSection(hash);
        const activeLink = document.querySelector(`.sidebar-nav__link[href="#${hash}"]`);
        if (activeLink) {
          navLinks.forEach(l => l.classList.remove('active'));
          activeLink.classList.add('active');
        }
      }
    });
  },

  // Carregar conteúdo da seção
  loadSection: function(sectionId) {
    this.state.currentSection = sectionId;
    console.log(`Carregando seção: ${sectionId}`);

    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');

    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
        console.error(`Elemento da seção #${sectionId} não encontrado no DOM.`);
        return;
    }
    const placeholder = targetSection.querySelector('.section-content-placeholder');
    if (!placeholder) {
        console.error(`Placeholder não encontrado na seção #${sectionId}.`);
        targetSection.style.display = 'block'; // Mostra a seção mesmo sem placeholder
        return;
    }

    const loader = document.getElementById('main-loader');
    if (loader) loader.style.display = 'flex';

    // Verificar cache
    if (this.state.sectionsLoaded[sectionId]) {
        console.log(`Seção ${sectionId} encontrada no cache.`);
        this.displaySectionContent(sectionId, this.state.sectionsLoaded[sectionId]);
        return;
    }

    // Carregar do arquivo
    const filePath = `${this.config.contentPath}${sectionId}.html`;
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status} ao carregar ${filePath}`);
        }
        // Ler como ArrayBuffer para detectar codificação
        return response.arrayBuffer(); 
      })
      .then(buffer => {
        let decoder;
        let htmlContent;
        
        console.log(`[${sectionId}] Buffer recebido, verificando bytes...`);
        // Logar os primeiros bytes para diagnóstico
        const firstBytes = new Uint8Array(buffer.slice(0, 4));
        let byteString = '';
        try {
            byteString = `Bytes (hex): ${firstBytes[0]?.toString(16) ?? 'N/A'} ${firstBytes[1]?.toString(16) ?? 'N/A'} ${firstBytes[2]?.toString(16) ?? 'N/A'} ${firstBytes[3]?.toString(16) ?? 'N/A'}`;
        } catch (e) {
            byteString = "Erro ao ler bytes.";
        }
        console.log(`[${sectionId}] ${byteString}`);
        
        // Detectar BOM UTF-16 LE (ÿþ - FF FE)
        if (firstBytes.length >= 2 && firstBytes[0] === 0xFF && firstBytes[1] === 0xFE) {
            console.log(`[${sectionId}] Detectado BOM UTF-16 LE. Decodificando...`);
            // Usar UTF-16 LE e pular os 2 bytes do BOM
            decoder = new TextDecoder('utf-16le');
            htmlContent = decoder.decode(buffer.slice(2));
        } else {
            console.log(`[${sectionId}] BOM UTF-16 LE não detectado. Prosseguindo com UTF-8.`);
            // Tentar UTF-8 primeiro
            console.log(`[${sectionId}] Tentando decodificar como UTF-8...`);
            decoder = new TextDecoder('utf-8');
            htmlContent = decoder.decode(buffer); 
            
            // Fallback para Latin1 se UTF-8 falhar
            if (htmlContent.includes('\uFFFD')) { 
                console.warn(`[${sectionId}] Detecção de caracteres inválidos com UTF-8. Tentando Latin1 (ISO-8859-1)...`);
                decoder = new TextDecoder('iso-8859-1');
                htmlContent = decoder.decode(buffer);
            }
        }
        
        // Armazenar no cache
        this.state.sectionsLoaded[sectionId] = htmlContent;
        
        // Exibir conteúdo
        this.displaySectionContent(sectionId, htmlContent);
      })
      .catch(error => {
        console.error(`Falha ao carregar ou processar seção ${sectionId}:`, error);
        this.displayError(sectionId, error);
        if (loader) loader.style.display = 'none';
      });
  },

  // Exibir conteúdo da seção e inicializar gráficos
  displaySectionContent: function(sectionId, htmlContent) {
      console.log(`Exibindo conteúdo para ${sectionId}`);
      const targetSection = document.getElementById(sectionId);
      const placeholder = targetSection.querySelector('.section-content-placeholder');
      const loader = document.getElementById('main-loader');
      
      if (placeholder) {
          placeholder.innerHTML = htmlContent;
          targetSection.style.display = 'block';
          
          // Inicializar gráficos APÓS inserir o conteúdo no DOM
          this.initSectionCharts(targetSection); 
      } else {
          console.error(`Placeholder não encontrado ao tentar exibir ${sectionId}`);
          targetSection.style.display = 'block'; // Ainda mostra a seção
      }
      
      if (loader) loader.style.display = 'none';
      window.scrollTo(0, 0);
  },

  // Exibir mensagem de erro
  displayError: function(sectionId, error) {
      const targetSection = document.getElementById(sectionId);
      if (!targetSection) return;
      const placeholder = targetSection.querySelector('.section-content-placeholder');
      if (placeholder) {
          placeholder.innerHTML = `
              <div class="error-message">
                  <h2>Erro ao carregar seção '${sectionId}'</h2>
                  <p>${error.message}</p>
                  <p>Verifique se o arquivo 'content/${sectionId}.html' existe e está acessível.</p>
              </div>
          `;
      }
      targetSection.style.display = 'block';
  },

  // Inicializar gráficos na seção especificada
  initSectionCharts: function(sectionElement) {
    if (typeof Chart === 'undefined') return;
    
    const chartDataElements = sectionElement.querySelectorAll('.chart-data');
    console.log(`[${sectionElement.id}] Encontrados ${chartDataElements.length} elementos de dados de gráficos`);
    
    chartDataElements.forEach(dataElement => {
      const chartId = dataElement.getAttribute('data-chart');
      const chartType = dataElement.getAttribute('data-type') || 'bar';
      const chartCanvas = sectionElement.querySelector(`#${chartId}`); // Procura DENTRO da seção atual
      
      if (!chartCanvas) {
        console.warn(`[${sectionElement.id}] Canvas #${chartId} não encontrado`);
        return;
      }
      
      console.log(`[${sectionElement.id}] Inicializando gráfico ${chartId} (${chartType})`);
      
      try {
        let chartConfigData;
        try {
          chartConfigData = JSON.parse(dataElement.textContent.trim());
        } catch (parseError) {
          console.error(`[${sectionElement.id}] Erro ao fazer parse dos dados do gráfico ${chartId}:`, parseError, dataElement.textContent);
          return;
        }

        // Aplicar paleta de cores aos datasets
        if (chartConfigData.datasets) {
            ChartUtils.applyPalette(chartConfigData.datasets, chartType);
        }
        
        // Mesclar opções padrão com opções específicas do gráfico (se houver)
        // NOTA: Opções específicas no HTML sobrescreverão as padrão.
        const chartOptions = {
          ...ChartUtils.getDefaultOptions(), // Começa com as opções padrão
          ...(chartConfigData.options || {}) // Mescla/sobrescreve com opções do HTML
        };
        
        // Ajustar opções de escala para tipos específicos (ex: radar)
        if (chartType === 'radar') {
            chartOptions.scales = {
                r: {
                    angleLines: { color: 'rgba(0, 0, 0, 0.08)' },
                    grid: { color: 'rgba(0, 0, 0, 0.08)' },
                    pointLabels: { 
                        font: { family: ChartUtils.getDefaultOptions().plugins.legend.labels.font.family, size: 11 },
                        color: ChartUtils.getDefaultOptions().plugins.legend.labels.color
                    },
                    ticks: { 
                        backdropColor: 'transparent',
                        color: ChartUtils.getDefaultOptions().plugins.legend.labels.color,
                        font: { size: 10 }
                    }
                }
            }
        } else if (chartType === 'pie' || chartType === 'doughnut') {
            // Remove escalas para gráficos de pizza/rosca
            delete chartOptions.scales;
        }

        if (chartCanvas._chart) {
          chartCanvas._chart.destroy(); // Destroi gráfico anterior se existir
        }
        
        chartCanvas._chart = new Chart(chartCanvas, {
          type: chartType,
          data: { // Passa labels e datasets separadamente
              labels: chartConfigData.labels,
              datasets: chartConfigData.datasets
          },
          options: chartOptions // Passa as opções mescladas
        });
        console.log(`[${sectionElement.id}] Gráfico ${chartId} inicializado com sucesso`);
      } catch (error) {
        console.error(`[${sectionElement.id}] Erro ao inicializar gráfico #${chartId}:`, error);
      }
    });
  },

  // Carregar seção inicial
  loadInitialSection: function() {
    let initialSection = 'sumario-executivo'; // Padrão
    if (window.location.hash) {
      const hashSection = window.location.hash.substring(1);
      // Valida se o hash corresponde a um link existente
      if (document.querySelector(`.sidebar-nav__link[href="#${hashSection}"]`)) {
          initialSection = hashSection;
          console.log(`Usando hash da URL: ${initialSection}`);
      } else {
          console.warn(`Hash inválido #${hashSection}, usando padrão ${initialSection}`);
          window.location.hash = initialSection; // Corrige URL
      }
    } else {
      console.log(`Nenhum hash na URL, usando padrão: ${initialSection}`);
      window.location.hash = initialSection; // Define URL
    }
    
    this.loadSection(initialSection);
    
    const activeLink = document.querySelector(`.sidebar-nav__link[href="#${initialSection}"]`);
    if (activeLink) {
        document.querySelectorAll('.sidebar-nav__link').forEach(l => l.classList.remove('active'));
        activeLink.classList.add('active');
    }
  }
};

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  // Definir algumas configurações globais do Chart.js (opcional, mas bom para consistência)
  if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = getComputedStyle(document.documentElement).getPropertyValue('--font-family-secondary').trim() || 'Inter, sans-serif';
    Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--color-chart-text').trim() || '#525252';
    Chart.defaults.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-chart-grid').trim() || 'rgba(0, 0, 0, 0.08)';
  }

  AMICA.init();
});
