/**
 * charts.js
 * Gerencia a criação e atualização dos gráficos do relatório
 * Utilize este arquivo para customizações do Chart.js
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
  
  // Instâncias de gráficos para referência
  const chartInstances = {};
  
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
    
    // Criar e armazenar a instância
    chartInstances[chartId] = new Chart(ctx, {
      type: type,
      data: data,
      options: options
    });
    
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
    }
  };
})();

// Inicializar gráficos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  AmicaCharts.init();
});

// Atualizar gráficos quando a seção muda
document.addEventListener('amica:sectionChange', function(e) {
  const sectionId = e.detail.section;
  setTimeout(function() {
    AmicaCharts.initSectionCharts(sectionId);
  }, 100);
});
