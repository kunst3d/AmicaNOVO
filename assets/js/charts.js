/**
 * charts.js
 * Gerencia a criação e atualização dos gráficos do relatório
 * Integra utilidades para configuração de cores e renderização
 */

// Módulo de Gráficos
const AmicaCharts = (function() {
  // Configurações globais de estilo para todos os gráficos
  const globalChartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          color: '#333333',
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(42, 75, 69, 0.8)',
        titleFont: {
          family: "'Cormorant Garamond', serif",
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12
        },
        padding: 10,
        cornerRadius: 4,
        displayColors: false
      }
    },
    elements: {
      line: {
        tension: 0.3
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };
  
  // Paleta de cores para gráficos
  const chartColors = {
    primary: 'rgb(166, 124, 82)',
    primaryLight: 'rgba(166, 124, 82, 0.7)',
    primaryLighter: 'rgba(166, 124, 82, 0.2)',
    secondary: 'rgb(42, 75, 69)',
    secondaryLight: 'rgba(42, 75, 69, 0.7)',
    tertiary: 'rgb(217, 194, 167)',
    accent1: 'rgb(101, 142, 133)',
    accent2: 'rgb(191, 172, 143)',
    success: 'rgb(46, 125, 50)',
    warning: 'rgb(251, 140, 0)',
    danger: 'rgb(211, 47, 47)'
  };
  
  // Paleta de cores vibrantes para gráficos de pizza/rosca
  const vibrantPalette = [
    'rgba(255, 99, 132, 0.8)',    // Rosa
    'rgba(54, 162, 235, 0.8)',    // Azul
    'rgba(255, 206, 86, 0.8)',    // Amarelo
    'rgba(75, 192, 192, 0.8)',    // Verde-água
    'rgba(153, 102, 255, 0.8)',   // Roxo
    'rgba(255, 159, 64, 0.8)',    // Laranja
    'rgba(46, 204, 113, 0.8)',    // Verde
    'rgba(52, 152, 219, 0.8)',    // Azul claro
    'rgba(155, 89, 182, 0.8)',    // Roxo médio
    'rgba(241, 196, 15, 0.8)',    // Amarelo ouro
    'rgba(231, 76, 60, 0.8)',     // Vermelho
    'rgba(26, 188, 156, 0.8)'     // Turquesa
  ];
  
  // Instâncias de gráficos para referência
  const chartInstances = {};
  
  // Utilitário: Obter uma paleta de cores do CSS ou usar a padrão
  function getColorPalette() {
    // Paleta padrão para fallback
    const defaultPalette = [
      '#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f',
      '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
    ];
    
    try {
      const style = getComputedStyle(document.documentElement);
      
      // Tentar obter cores das variáveis do tema Amica
      const baseColors = [
        style.getPropertyValue('--color-primary').trim(),
        style.getPropertyValue('--color-secondary').trim(),
        style.getPropertyValue('--color-tertiary').trim(),
        style.getPropertyValue('--color-accent1').trim(),
        style.getPropertyValue('--color-accent2').trim(),
        style.getPropertyValue('--color-success').trim(),
        style.getPropertyValue('--color-warning').trim(),
        style.getPropertyValue('--color-danger').trim(),
      ].filter(Boolean);
      
      if (baseColors.length > 0) {
        return baseColors;
      }
    } catch (error) {
      console.warn('Erro ao buscar paleta de cores:', error);
    }
    
    return defaultPalette;
  }
  
  // Utilitário: Converter hex para rgba
  function hexToRgba(hex, alpha = 1) {
    if (!hex) return 'rgba(0, 0, 0, 1)';
    
    // Remover o # se existir
    hex = hex.replace('#', '');
    
    // Expandir formato abreviado (ex: #abc para #aabbcc)
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    // Converter para valores RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  // Utilitário: Tornar uma cor mais brilhante para efeitos de hover
  function brightenColor(color, percent) {
    if (!color) return '#ffffff';
    
    // Remover # e validar formato
    color = color.replace('#', '');
    if (color.length === 3) {
      color = color.split('').map(c => c + c).join('');
    }
    
    // Converter para RGB
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);
    
    // Aumentar brilho
    r = Math.min(255, Math.floor(r * (100 + percent) / 100));
    g = Math.min(255, Math.floor(g * (100 + percent) / 100));
    b = Math.min(255, Math.floor(b * (100 + percent) / 100));
    
    // Converter de volta para hex
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  
  // Aplicar cores apropriadas para cada tipo de gráfico
  function applyColors(config) {
    const palette = getColorPalette();
    const type = config.type;
    
    // Aplicar cores específicas para gráficos de pizza/rosca
    if (type === 'pie' || type === 'doughnut') {
      config.data.datasets.forEach(function(dataset) {
        // Gerar cores para cada segmento
        const numPoints = dataset.data.length;
        const bgColors = [];
        const borderColors = [];
        
        for (let i = 0; i < numPoints; i++) {
          bgColors.push(vibrantPalette[i % vibrantPalette.length]);
          borderColors.push(vibrantPalette[i % vibrantPalette.length].replace('0.8', '1'));
        }
        
        dataset.backgroundColor = bgColors;
        dataset.borderColor = borderColors;
        dataset.borderWidth = dataset.borderWidth || 2;
        dataset.hoverOffset = 15;
        dataset.hoverBorderWidth = 3;
      });
      
      return config;
    }
    
    // Para outros tipos de gráfico, aplicar cores da paleta base
    config.data.datasets.forEach((dataset, index) => {
      const colorIndex = index % palette.length;
      const color = palette[colorIndex];
      
      // Configuração específica para cada tipo
      if (type === 'bar') {
        dataset.backgroundColor = dataset.backgroundColor || hexToRgba(color, 0.7);
        dataset.borderColor = dataset.borderColor || color;
        dataset.borderWidth = dataset.borderWidth || 1;
      } 
      else if (type === 'line') {
        dataset.borderColor = dataset.borderColor || color;
        dataset.backgroundColor = dataset.backgroundColor || hexToRgba(color, 0.1);
        dataset.pointBackgroundColor = dataset.pointBackgroundColor || color;
        dataset.pointBorderColor = dataset.pointBorderColor || '#fff';
      } 
      else if (type === 'radar') {
        dataset.borderColor = dataset.borderColor || color;
        dataset.backgroundColor = dataset.backgroundColor || hexToRgba(color, 0.2);
        dataset.pointBackgroundColor = dataset.pointBackgroundColor || color;
        dataset.pointBorderColor = dataset.pointBorderColor || '#fff';
      }
      else {
        // Outros tipos
        dataset.borderColor = dataset.borderColor || color;
        dataset.backgroundColor = dataset.backgroundColor || hexToRgba(color, 0.7);
      }
    });
    
    return config;
  }
  
  // Melhorar responsividade para dispositivos móveis
  function improveResponsiveness(config) {
    const isMobile = window.innerWidth < 768;
    
    // Ajustar posição da legenda para melhor visualização
    if (config.type === 'pie' || config.type === 'doughnut') {
      config.options = config.options || {};
      config.options.plugins = config.options.plugins || {};
      config.options.plugins.legend = config.options.plugins.legend || {};
      config.options.plugins.legend.position = isMobile ? 'bottom' : 'right';
    }
    
    return config;
  }
  
  // Inicialização
  function init() {
    console.log('Inicializando gráficos...');
    
    // Aplicar configurações globais ao Chart.js
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#666666';
    Chart.defaults.scale.grid.color = 'rgba(0, 0, 0, 0.05)';
    
    // Inicializar todos os gráficos
    initializeCharts();
    
    // Ajustar em caso de redimensionamento
    window.addEventListener('resize', function() {
      Object.keys(chartInstances).forEach(function(chartId) {
        if (chartInstances[chartId]) {
          chartInstances[chartId].resize();
        }
      });
    });
    
    console.log('Gráficos inicializados com sucesso!');
  }
  
  // Inicializar todos os gráficos
  function initializeCharts() {
    // Procurar todos os elementos de gráficos com dados
    document.querySelectorAll('.chart-data').forEach(function(dataElement) {
      const chartId = dataElement.getAttribute('data-chart');
      const chartType = dataElement.getAttribute('data-type');
      const canvasEl = document.getElementById(chartId);
      
      if (canvasEl) {
        try {
          const chartData = JSON.parse(dataElement.textContent);
          createChart(canvasEl, chartType, chartData);
        } catch (error) {
          console.error(`Erro ao processar dados do gráfico ${chartId}:`, error);
        }
      }
    });
  }
  
  // Criar um gráfico
  function createChart(canvas, type, data) {
    const ctx = canvas.getContext('2d');
    const chartId = canvas.id;
    
    // Verificar se já existe uma instância e destruí-la
    if (chartInstances[chartId]) {
      chartInstances[chartId].destroy();
    }
    
    // Configurações específicas por tipo de gráfico
    let options = {...globalChartConfig};
    
    // Ajustar opções específicas por tipo
    switch (type) {
      case 'bar':
        options = {
          ...options,
          plugins: {
            ...options.plugins,
            legend: {
              ...options.plugins.legend,
              position: 'top'
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true
            }
          }
        };
        break;
        
      case 'pie':
      case 'doughnut':
        options = {
          ...options,
          plugins: {
            ...options.plugins,
            legend: {
              ...options.plugins.legend,
              position: 'right'
            }
          },
          cutout: type === 'doughnut' ? '60%' : 0
        };
        break;
        
      case 'radar':
        options = {
          ...options,
          plugins: {
            ...options.plugins
          },
          scales: {
            r: {
              beginAtZero: true,
              ticks: {
                stepSize: 2
              }
            }
          }
        };
        break;
    }
    
    // Criar configuração completa
    const config = {
      type: type,
      data: data,
      options: options
    };
    
    // Aplicar cores e melhorias de responsividade
    const enhancedConfig = improveResponsiveness(applyColors(config));
    
    // Criar e armazenar a instância
    chartInstances[chartId] = new Chart(ctx, enhancedConfig);
    
    return chartInstances[chartId];
  }
  
  // Função para inicializar gráficos quando uma seção é carregada
  function initSectionCharts(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const chartDataElements = section.querySelectorAll('.chart-data');
      chartDataElements.forEach(function(dataElement) {
        const chartId = dataElement.getAttribute('data-chart');
        const chartType = dataElement.getAttribute('data-type');
        const canvasEl = document.getElementById(chartId);
        
        if (canvasEl) {
          try {
            const chartData = JSON.parse(dataElement.textContent);
            createChart(canvasEl, chartType, chartData);
          } catch (error) {
            console.error(`Erro ao processar dados do gráfico ${chartId}:`, error);
          }
        }
      });
    }
  }
  
  // API pública
  return {
    init: init,
    initializeCharts: initializeCharts,
    initSectionCharts: initSectionCharts,
    getChartInstance: function(chartId) {
      return chartInstances[chartId] || null;
    },
    updateChartData: function(chartId, newData) {
      if (chartInstances[chartId]) {
        chartInstances[chartId].data = newData;
        chartInstances[chartId].update();
      }
    },
    globalChartConfig: globalChartConfig,
    storeChartInstance: function(chartId, chartInstance) {
      chartInstances[chartId] = chartInstance;
    },
    // Disponibilizar utilidades
    utils: {
      hexToRgba: hexToRgba,
      brightenColor: brightenColor,
      getColorPalette: getColorPalette
    }
  };
})();

// Inicializar gráficos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  if (!window.location.hostname.includes('github.io')) {
    AmicaCharts.init();
  } else {
    // console.log('AmicaCharts.init() ignorado no modo GitHub Pages.');
  }
});

// Atualizar gráficos quando a seção muda
document.addEventListener('amica:sectionChange', function(e) {
  if (!window.location.hostname.includes('github.io')) {
    const sectionId = e.detail.section;
    setTimeout(function() {
      AmicaCharts.initSectionCharts(sectionId);
    }, 100);
  } else {
    // console.log('AmicaCharts.initSectionCharts() ignorado no modo GitHub Pages.');
  }
});

// Evento personalizado para inicializar gráficos mesmo no modo GitHub Pages
document.addEventListener('amica:initCharts', function(e) {
  const container = e.detail && e.detail.container ? e.detail.container : document;
  
  // Detectar e inicializar gráficos definidos via atributos data-* nos elementos canvas
  container.querySelectorAll('canvas[data-chart-type]').forEach(function(canvas) {
    try {
      const chartId = canvas.id;
      const chartType = canvas.getAttribute('data-chart-type');
      
      // Verificar se já existe uma instância
      if (AmicaCharts.getChartInstance(chartId)) {
        return;
      }
      
      let chartData = {};
      let chartOptions = {};
      
      // Tentar obter dados e opções dos atributos
      try {
        if (canvas.hasAttribute('data-chart-data')) {
          chartData = JSON.parse(canvas.getAttribute('data-chart-data'));
        }
        
        if (canvas.hasAttribute('data-chart-options')) {
          chartOptions = JSON.parse(canvas.getAttribute('data-chart-options'));
        }
      } catch (parseError) {
        console.error(`Erro ao analisar dados do gráfico ${chartId}:`, parseError);
        return;
      }
      
      // Criar o gráfico com as opções combinadas
      const ctx = canvas.getContext('2d');
      const mergedOptions = {...AmicaCharts.globalChartConfig, ...chartOptions};
      
      const chartInstance = new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: mergedOptions
      });
      
      // Armazenar a instância para referência
      AmicaCharts.storeChartInstance(chartId, chartInstance);
      
      console.log(`Gráfico ${chartId} inicializado via data-attributes`);
    } catch (error) {
      console.error(`Erro ao inicializar gráfico via data-attributes:`, error);
    }
  });
});
