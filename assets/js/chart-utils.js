/**
 * Utilitários para renderização e personalização de gráficos
 */
const ChartUtils = {
    /**
     * Obtém a paleta de cores definida em variáveis CSS
     * @returns {Array} - Paleta de cores
     */
    getColorPalette: function() {
        // Paleta mais vibrante por padrão
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
                    style.getPropertyValue('--color-accent1').trim(),
                    style.getPropertyValue('--color-accent2').trim(),
                    style.getPropertyValue('--color-success').trim(),
                    style.getPropertyValue('--color-warning').trim(),
                    style.getPropertyValue('--color-danger').trim(),
                    style.getPropertyValue('--color-light-gray').trim()
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
     * Processa variáveis CSS em strings de cores
     * @param {string} colorVar - String contendo possivelmente uma variável CSS
     * @returns {string} - Cor processada (substituída ou a original)
     */
    processCssVar: function(colorVar) {
        if (!colorVar || typeof colorVar !== 'string') return colorVar;
        
        // Verificar se é uma variável CSS (var(--xxx))
        if (colorVar.includes('var(')) {
            try {
                // Extrair nome da variável
                const varName = colorVar.match(/var\((.*?)\)/)[1];
                if (varName) {
                    // Obter valor da variável CSS
                    const cssValue = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
                    if (cssValue) {
                        return cssValue;
                    }
                }
            } catch (e) {
                console.warn('Erro ao processar variável CSS:', e);
            }
        }
        
        return colorVar;
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
            // Primeiro, processar qualquer variável CSS nas cores já definidas
            if (dataset.backgroundColor && typeof dataset.backgroundColor === 'string') {
                dataset.backgroundColor = this.processCssVar(dataset.backgroundColor);
            }
            if (dataset.borderColor && typeof dataset.borderColor === 'string') {
                dataset.borderColor = this.processCssVar(dataset.borderColor);
            }
            
            // Caso especial para gráficos pie e doughnut
            if (['pie', 'doughnut'].includes(chartType)) {
                if (dataset.data && Array.isArray(dataset.data)) {
                    console.log(`Tipo de gráfico ${chartType} com ${dataset.data.length} segmentos`);
                    
                    // Aplicar cores mais vibrantes para segmentos (80% opacidade para melhor visualização)
                    if (!Array.isArray(dataset.backgroundColor)) {
                        dataset.backgroundColor = dataset.data.map((_, dataIndex) => {
                            const color = palette[dataIndex % palette.length];
                            return this.hexToRgba(color, 0.8); // Usar 80% opacidade para melhor visual
                        });
                    }
                    
                    // Definir bordas para dar melhor contorno aos segmentos
                    if (!Array.isArray(dataset.borderColor)) {
                        dataset.borderColor = dataset.data.map((_, dataIndex) => {
                            return palette[dataIndex % palette.length]; // Cor sólida para borda
                        });
                    }
                    dataset.borderWidth = dataset.borderWidth || 1.5;
                    
                    // Melhorar a interatividade no hover
                    if (!Array.isArray(dataset.hoverBackgroundColor)) {
                        dataset.hoverBackgroundColor = dataset.data.map((_, dataIndex) => {
                            // Destacar no hover com cor ligeiramente mais brilhante
                            const color = palette[dataIndex % palette.length];
                            return this.brightenColor(color, 15);
                        });
                    }
                    dataset.hoverBorderColor = dataset.hoverBorderColor || '#ffffff';
                    dataset.hoverBorderWidth = dataset.hoverBorderWidth || 2;
                    dataset.hoverOffset = dataset.hoverOffset || 10; // Aumentar deslocamento no hover
                    
                    // Registrar cores aplicadas para debug
                    console.log(`Cores aplicadas ao dataset para ${chartType}:`, dataset.backgroundColor);
                }
            } 
            // Caso geral para gráficos de barra
            else if (chartType === 'bar') {
                // IMPORTANTE: Para barras agrupadas, manter consistência de cores
                // Respeitar as cores definidas manualmente no dataset
                if (dataset.backgroundColor) {
                    // Se já tiver cores definidas, não modificar
                    if (Array.isArray(dataset.backgroundColor)) {
                        // Processar variáveis CSS em arrays
                        dataset.backgroundColor = dataset.backgroundColor.map(color => 
                            this.processCssVar(color));
                    } 
                    // Se for cor única, processar mas manter
                    else {
                        const processedColor = this.processCssVar(dataset.backgroundColor);
                        dataset.backgroundColor = processedColor;
                    }
                } else {
                    // Se não tiver cor definida, aplicar da paleta pelo índice do dataset
                    const colorIndex = datasetIndex % palette.length;
                    dataset.backgroundColor = this.hexToRgba(palette[colorIndex], 0.7);
                }
                
                // Mesmo tratamento para bordas
                if (dataset.borderColor) {
                    if (Array.isArray(dataset.borderColor)) {
                        dataset.borderColor = dataset.borderColor.map(color => 
                            this.processCssVar(color));
                    } else {
                        const processedColor = this.processCssVar(dataset.borderColor);
                        dataset.borderColor = processedColor;
                    }
                } else {
                    // Aplicar cor de borda baseada na cor de fundo
                    if (typeof dataset.backgroundColor === 'string') {
                        dataset.borderColor = dataset.backgroundColor.replace(/rgba?\(.*,\s*[\d.]+\)/, match => {
                            return match.replace(/,\s*[\d.]+\)/, ', 1)');
                        });
                    } else {
                        const colorIndex = datasetIndex % palette.length;
                        dataset.borderColor = palette[colorIndex];
                    }
                }
                
                dataset.borderWidth = dataset.borderWidth ?? 1;
            }
            // Outros tipos de gráficos (line, radar, etc)
            else {
                const colorIndex = datasetIndex % palette.length;
                const baseColor = palette[colorIndex];
                
                // Respeitar cores já definidas
                if (!dataset.backgroundColor) {
                    // Configuração específica por tipo
                    if (chartType === 'line') {
                        dataset.borderColor = dataset.borderColor || baseColor;
                        dataset.backgroundColor = dataset.backgroundColor || this.hexToRgba(baseColor, 0.1);
                        dataset.pointBackgroundColor = dataset.pointBackgroundColor || baseColor;
                        dataset.pointBorderColor = dataset.pointBorderColor || '#fff';
                        dataset.pointHoverBackgroundColor = dataset.pointHoverBackgroundColor || '#fff';
                        dataset.pointHoverBorderColor = dataset.pointHoverBorderColor || baseColor;
                    } else if (chartType === 'radar') {
                        dataset.borderColor = dataset.borderColor || baseColor;
                        dataset.backgroundColor = dataset.backgroundColor || this.hexToRgba(baseColor, 0.2);
                        dataset.pointBackgroundColor = dataset.pointBackgroundColor || baseColor;
                        dataset.pointBorderColor = dataset.pointBorderColor || '#fff';
                    } else {
                        // Configuração genérica
                        dataset.borderColor = dataset.borderColor || baseColor;
                        dataset.backgroundColor = dataset.backgroundColor || this.hexToRgba(baseColor, 0.7);
                    }
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
        
        // Processar variável CSS se necessário
        color = this.processCssVar(color);
        
        // Converter rgba para hex
        if (color.startsWith('rgba') || color.startsWith('rgb')) {
            const rgbValues = color.match(/\d+/g);
            if (rgbValues && rgbValues.length >= 3) {
                const r = parseInt(rgbValues[0]);
                const g = parseInt(rgbValues[1]);
                const b = parseInt(rgbValues[2]);
                color = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            }
        }
        
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
        
        // Melhorar responsividade
        config.options.responsive = true;
        config.options.maintainAspectRatio = false;
        
        // Definir altura mínima para o container (prevenção de gráficos muito pequenos)
        if (['pie', 'doughnut'].includes(config.type)) {
            // Gráficos circulares precisam de mais espaço vertical
            config.options.aspectRatio = 1;
        } else {
            // Outros tipos de gráficos
            config.options.aspectRatio = window.innerWidth < 768 ? 1 : 2;
        }
        
        // Melhorar as legendas
        config.options.plugins = config.options.plugins || {};
        config.options.plugins.legend = config.options.plugins.legend || {};
        
        // Posição da legenda adaptativa ao tipo de dispositivo
        const isMobile = window.innerWidth < 768;
        if (['pie', 'doughnut'].includes(config.type)) {
            config.options.plugins.legend.position = isMobile ? 'bottom' : 'right';
        } else {
            config.options.plugins.legend.position = isMobile ? 'bottom' : 'top';
        }
        
        // Melhorar tooltips
        config.options.plugins.tooltip = config.options.plugins.tooltip || {};
        
        // Configuração específica por tipo de gráfico
        if (['pie', 'doughnut'].includes(config.type)) {
            // Manter legenda visível em gráficos circulares
            config.options.plugins.legend.display = true;
            
            // Adicionar labels com percentagens aos gráficos circulares
            config.options.plugins.tooltip.callbacks = config.options.plugins.tooltip.callbacks || {};
            config.options.plugins.tooltip.callbacks.label = function(context) {
                const label = context.label || '';
                const value = context.formattedValue;
                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((context.raw / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
            };
            
            // Melhorar layout para pie/doughnut em dispositivos móveis
            if (isMobile) {
                config.options.layout = config.options.layout || {};
                config.options.layout.padding = {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                };
            }
        } else if (config.type === 'bar') {
            // Configurações específicas para gráficos de barras agrupadas
            // Garantir cores consistentes entre grupos
            config.options.plugins.tooltip = config.options.plugins.tooltip || {};
            config.options.plugins.tooltip.callbacks = config.options.plugins.tooltip.callbacks || {};
            
            // Melhorar visualização em dispositivos móveis
            if (isMobile && config.data && config.data.datasets && config.data.datasets.length > 3) {
                config.options.plugins.legend.display = true;
            }
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
            // Criar e retornar a instância do gráfico
            const chart = new Chart(canvas, config);
            
            // Adicionar listener para redimensionamento (adaptação a orientação e tamanho de tela)
            window.addEventListener('resize', () => {
                if (chart) {
                    setTimeout(() => {
                        chart.resize();
                    }, 100);
                }
            });
            
            return chart;
        } catch (error) {
            console.error('Erro ao criar gráfico:', error);
            return null;
        }
    }
}; 