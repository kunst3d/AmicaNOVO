/**
 * Utilitários para renderização e personalização de gráficos
 */
const ChartUtils = {
    /**
     * Obtém a paleta de cores definida em variáveis CSS
     * @returns {Array} - Paleta de cores
     */
    getColorPalette: function() {
        const defaultPalette = [
            '#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f',
            '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
        ];
        
        try {
            const style = getComputedStyle(document.documentElement);
            const paletteVars = [];
            
            // Tentar obter cores das variáveis CSS
            for (let i = 1; i <= 10; i++) {
                const colorVar = style.getPropertyValue(`--chart-color-${i}`).trim();
                if (colorVar) {
                    paletteVars.push(colorVar);
                }
            }
            
            // Tentar obter da base.css
            if (paletteVars.length === 0) {
                const baseColors = [
                    style.getPropertyValue('--color-primary').trim(),
                    style.getPropertyValue('--color-secondary').trim(),
                    style.getPropertyValue('--color-tertiary').trim(),
                    style.getPropertyValue('--color-accent').trim(),
                    style.getPropertyValue('--color-success').trim(),
                    style.getPropertyValue('--color-warning').trim(),
                    style.getPropertyValue('--color-danger').trim()
                ].filter(Boolean);
                
                if (baseColors.length > 0) {
                    console.log('Usando cores base do CSS');
                    return baseColors;
                }
            }
            
            if (paletteVars.length > 0) {
                console.log('Usando paleta de cores do CSS');
                return paletteVars;
            }
        } catch (error) {
            console.warn('Erro ao buscar paleta de cores do CSS:', error);
        }
        
        console.log('Usando paleta de cores padrão (fallback)');
        return defaultPalette;
    },
    
    /**
     * Converte uma cor hex para rgba
     * @param {string} hex - Cor em formato hexadecimal
     * @param {number} alpha - Valor de transparência
     * @returns {string} - Cor em formato rgba
     */
    hexToRgba: function(hex, alpha = 1) {
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
    },
    
    /**
     * Aplica uma paleta de cores aos datasets de um gráfico
     * @param {Object} config - Configuração do gráfico
     * @returns {Object} - Configuração atualizada
     */
    applyPalette: function(config) {
        if (!config || !config.data || !config.data.datasets) {
            return config;
        }
        
        const chartType = config.type;
        const palette = this.getColorPalette();
        
        console.log(`Aplicando paleta para gráfico ${chartType}`, palette);
        
        // Processar cada dataset
        config.data.datasets.forEach((dataset, datasetIndex) => {
            // Caso especial para gráficos pie e doughnut
            if (['pie', 'doughnut'].includes(chartType)) {
                if (dataset.data && Array.isArray(dataset.data)) {
                    console.log(`Tipo de gráfico ${chartType} com ${dataset.data.length} segmentos`);
                    
                    // CORREÇÃO: Aplicar cores sólidas (não usar alpha/transparência)
                    dataset.backgroundColor = dataset.data.map((_, dataIndex) => {
                        const color = palette[dataIndex % palette.length];
                        console.log(`Segmento ${dataIndex}: cor ${color}`);
                        return color; // Cores sólidas para melhor visualização
                    });
                    
                    // Usar bordas brancas para contraste
                    dataset.borderColor = '#ffffff';
                    dataset.borderWidth = 2;
                    
                    // Melhorar a interatividade
                    dataset.hoverBackgroundColor = dataset.data.map((_, dataIndex) => {
                        // Destacar no hover com cor ligeiramente mais brilhante
                        const color = palette[dataIndex % palette.length];
                        return this.brightenColor(color, 20);
                    });
                    dataset.hoverBorderColor = '#ffffff';
                    dataset.hoverBorderWidth = 3;
                    dataset.hoverOffset = 10;
                }
            } 
            // Caso geral para gráficos de barra
            else if (chartType === 'bar') {
                // Se não for um array, criar array com cores distintas
                if (dataset.data && Array.isArray(dataset.data) && !Array.isArray(dataset.backgroundColor)) {
                    dataset.backgroundColor = dataset.data.map((_, dataIndex) => 
                        this.hexToRgba(palette[(datasetIndex + dataIndex) % palette.length], 0.7));
                    
                    dataset.borderColor = dataset.data.map((_, dataIndex) => 
                        palette[(datasetIndex + dataIndex) % palette.length]);
                    
                    dataset.borderWidth = dataset.borderWidth ?? 1;
                } else {
                    // Cor única para dataset
                    const colorIndex = datasetIndex % palette.length;
                    dataset.backgroundColor = this.hexToRgba(palette[colorIndex], 0.7);
                    dataset.borderColor = palette[colorIndex];
                    dataset.borderWidth = dataset.borderWidth ?? 1;
                }
            }
            // Outros tipos de gráficos (line, radar, etc)
            else {
                const colorIndex = datasetIndex % palette.length;
                const baseColor = palette[colorIndex];
                
                // Configuração específica por tipo
                if (chartType === 'line') {
                    dataset.borderColor = baseColor;
                    dataset.backgroundColor = this.hexToRgba(baseColor, 0.1);
                    dataset.pointBackgroundColor = baseColor;
                    dataset.pointBorderColor = '#fff';
                    dataset.pointHoverBackgroundColor = '#fff';
                    dataset.pointHoverBorderColor = baseColor;
                } else if (chartType === 'radar') {
                    dataset.borderColor = baseColor;
                    dataset.backgroundColor = this.hexToRgba(baseColor, 0.2);
                    dataset.pointBackgroundColor = baseColor;
                    dataset.pointBorderColor = '#fff';
                } else {
                    // Configuração genérica
                    dataset.borderColor = baseColor;
                    dataset.backgroundColor = this.hexToRgba(baseColor, 0.7);
                }
            }
        });
        
        return config;
    },
    
    /**
     * Torna uma cor mais brilhante para efeitos de hover
     * @param {string} color - Cor no formato hex
     * @param {number} percent - Percentual de brilho a aumentar
     * @returns {string} - Cor ajustada
     */
    brightenColor: function(color, percent) {
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
    },
    
    /**
     * Melhora a responsividade dos gráficos
     * @param {Object} config - Configuração do gráfico
     * @returns {Object} - Configuração atualizada
     */
    improveResponsiveness: function(config) {
        if (!config) return config;
        
        // Garantir que as opções existam
        config.options = config.options || {};
        
        // Responsividade básica
        config.options.responsive = true;
        config.options.maintainAspectRatio = false;
        
        // Melhorar as legendas
        config.options.plugins = config.options.plugins || {};
        config.options.plugins.legend = config.options.plugins.legend || {};
        config.options.plugins.legend.position = config.options.plugins.legend.position || 'top';
        
        // Configuração específica por tipo de gráfico
        if (['pie', 'doughnut'].includes(config.type)) {
            // Manter legenda visível em gráficos circulares
            config.options.plugins.legend.display = true;
            // Adicionar labels aos gráficos circulares
            config.options.plugins.tooltip = config.options.plugins.tooltip || {};
            config.options.plugins.tooltip.callbacks = config.options.plugins.tooltip.callbacks || {};
            config.options.plugins.tooltip.callbacks.label = function(context) {
                const label = context.label || '';
                const value = context.formattedValue;
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((context.raw / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
            };
        }
        
        return config;
    },
    
    /**
     * Inicializa um gráfico com todas as melhorias aplicadas
     * @param {string} canvasId - ID do elemento canvas
     * @param {Object} config - Configuração do gráfico
     * @returns {Chart} - Instância do gráfico
     */
    createChart: function(canvasId, config) {
        if (!config || !canvasId) {
            console.error('ID do canvas ou configuração não fornecidos');
            return null;
        }
        
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error(`Canvas com ID ${canvasId} não encontrado`);
            return null;
        }
        
        // Aplicar todas as melhorias
        config = this.applyPalette(config);
        config = this.improveResponsiveness(config);
        
        try {
            return new Chart(canvas, config);
        } catch (error) {
            console.error('Erro ao criar gráfico:', error);
            return null;
        }
    }
}; 