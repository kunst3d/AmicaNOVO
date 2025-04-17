/**
 * chart-debugger.js
 * Ferramenta para verificar e depurar problemas de cores em gráficos
 */

const ChartDebugger = {
    /**
     * Verifica a consistência das cores nos gráficos da página
     */
    verificarCores: function() {
        console.log('🔍 Iniciando verificação de consistência de cores nos gráficos...');
        
        // Encontrar todos os canvas de gráficos
        const canvasElements = document.querySelectorAll('canvas');
        
        if (canvasElements.length === 0) {
            console.log('⚠️ Nenhum canvas encontrado na página.');
            return;
        }
        
        console.log(`📊 Encontrados ${canvasElements.length} elementos canvas na página.`);
        
        // Verificar cada canvas
        canvasElements.forEach((canvas, index) => {
            // Verificar se há uma instância do Chart.js associada
            const chartInstance = canvas._chart;
            
            if (!chartInstance) {
                console.log(`⚠️ Canvas #${canvas.id || index} não tem um gráfico Chart.js associado.`);
                return;
            }
            
            console.log(`📈 Analisando gráfico "${canvas.id}" (tipo: ${chartInstance.config.type})`);
            
            // Verificar datasets e cores
            const datasets = chartInstance.data.datasets;
            
            if (!datasets || datasets.length === 0) {
                console.log(`⚠️ Gráfico "${canvas.id}" não tem datasets.`);
                return;
            }
            
            console.log(`📋 Gráfico "${canvas.id}" tem ${datasets.length} datasets.`);
            
            // Verificar cores por tipo de gráfico
            if (['bar'].includes(chartInstance.config.type)) {
                this._verificarCoresBarras(canvas.id, chartInstance);
            } else if (['pie', 'doughnut'].includes(chartInstance.config.type)) {
                this._verificarCoresPie(canvas.id, chartInstance);
            } else {
                this._verificarCoresOutros(canvas.id, chartInstance);
            }
        });
        
        console.log('✅ Verificação de cores concluída.');
    },
    
    /**
     * Verifica cores em gráficos de barras
     * @private
     */
    _verificarCoresBarras: function(canvasId, chart) {
        const datasets = chart.data.datasets;
        
        console.log(`🔍 Verificando cores em gráfico de barras "${canvasId}":`);
        
        // Verificar se cada dataset tem uma cor consistente
        datasets.forEach((dataset, index) => {
            console.log(`   Dataset #${index}: "${dataset.label}"`);
            
            if (Array.isArray(dataset.backgroundColor)) {
                // Se tiver um array de cores, pode haver inconsistência
                console.log(`   ⚠️ Dataset "${dataset.label}" tem um array de cores. Verificar se é intencional.`);
                console.log(`   Cores: `, dataset.backgroundColor);
            } else {
                // Cor única é o ideal para barras agrupadas
                console.log(`   ✅ Dataset "${dataset.label}" tem cor única: ${dataset.backgroundColor}`);
            }
        });
    },
    
    /**
     * Verifica cores em gráficos de pizza/rosca
     * @private
     */
    _verificarCoresPie: function(canvasId, chart) {
        const datasets = chart.data.datasets;
        
        console.log(`🔍 Verificando cores em gráfico pie/doughnut "${canvasId}":`);
        
        // Em gráficos de pizza, cada item deve ter sua própria cor
        datasets.forEach((dataset, index) => {
            if (!Array.isArray(dataset.backgroundColor)) {
                console.log(`   ⚠️ Dataset #${index} não tem um array de cores. Todas as fatias terão a mesma cor.`);
            } else if (dataset.backgroundColor.length < dataset.data.length) {
                console.log(`   ⚠️ Dataset #${index} tem ${dataset.backgroundColor.length} cores para ${dataset.data.length} dados.`);
            } else {
                console.log(`   ✅ Dataset #${index} tem cores adequadas para todos os segmentos.`);
            }
        });
    },
    
    /**
     * Verifica cores em outros tipos de gráficos
     * @private
     */
    _verificarCoresOutros: function(canvasId, chart) {
        const datasets = chart.data.datasets;
        
        console.log(`🔍 Verificando cores em gráfico "${chart.config.type}" (${canvasId}):`);
        
        // Para outros tipos de gráficos (linha, área, etc.)
        datasets.forEach((dataset, index) => {
            console.log(`   Dataset #${index}: "${dataset.label}"`);
            console.log(`   Cor de fundo: ${dataset.backgroundColor}`);
            console.log(`   Cor de borda: ${dataset.borderColor}`);
        });
    },
    
    /**
     * Corrige problemas comuns de cores em gráficos
     */
    corrigirCores: function() {
        console.log('🔧 Iniciando correção automática de cores...');
        
        // Encontrar todos os canvas de gráficos
        const canvasElements = document.querySelectorAll('canvas');
        
        canvasElements.forEach((canvas) => {
            const chartInstance = canvas._chart;
            
            if (!chartInstance) return;
            
            const chartType = chartInstance.config.type;
            
            // Foco especial em gráficos de barras (onde ocorrem mais problemas de cores)
            if (chartType === 'bar') {
                this._corrigirCoresBarras(canvas.id, chartInstance);
                chartInstance.update();
            }
        });
        
        console.log('✅ Correção de cores concluída. Recarregue a página para ver as mudanças.');
    },
    
    /**
     * Corrige cores em gráficos de barras
     * @private
     */
    _corrigirCoresBarras: function(canvasId, chart) {
        const datasets = chart.data.datasets;
        const cssColors = [
            getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--color-tertiary').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--color-accent1').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--color-accent2').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--color-light-gray').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--color-success').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--color-warning').trim(),
            getComputedStyle(document.documentElement).getPropertyValue('--color-danger').trim()
        ].filter(Boolean);
        
        console.log(`🔧 Aplicando correção em gráfico de barras "${canvasId}"`);
        
        // Para cada dataset, garantir cor única
        datasets.forEach((dataset, index) => {
            // Se tiver um array de cores, substituir por cor única
            if (Array.isArray(dataset.backgroundColor)) {
                const colorIndex = index % cssColors.length;
                const color = cssColors[colorIndex];
                
                console.log(`   📝 Substituindo array de cores em "${dataset.label}" por cor única: ${color}`);
                
                dataset.backgroundColor = this._hexToRgba(color, 0.7);
                dataset.borderColor = color;
            }
        });
    },
    
    /**
     * Converte cor hex para rgba
     * @private
     */
    _hexToRgba: function(hex, alpha = 1) {
        if (!hex) return 'rgba(0, 0, 0, 1)';
        
        // Remover o # se existir
        hex = hex.replace('#', '');
        
        // Expandir formato abreviado
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }
        
        // Converter para valores RGB
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
};

// Adicionar ao objeto window para acesso via console
window.ChartDebugger = ChartDebugger;

// Log para indicar que o debugger foi carregado
console.log('🛠️ ChartDebugger carregado. Use ChartDebugger.verificarCores() ou ChartDebugger.corrigirCores() no console para análise.'); 