/**
 * chart-fixer.js
 * Script para verificar e corrigir automaticamente problemas de cores em gráficos
 * Executar no console: ChartFixer.corrigirTodos()
 */

const ChartFixer = {
    // Mapeamento de variáveis CSS para valores RGB
    coresRgb: {
        'var(--color-primary)': 'rgba(166, 124, 82, 0.7)',
        'var(--color-primary-rgb)': 'rgba(166, 124, 82, 0.7)',
        'var(--color-secondary)': 'rgba(42, 75, 69, 0.7)',
        'var(--color-secondary-rgb)': 'rgba(42, 75, 69, 0.7)',
        'var(--color-tertiary)': 'rgba(217, 194, 167, 0.7)',
        'var(--color-tertiary-rgb)': 'rgba(217, 194, 167, 0.7)',
        'var(--color-accent1)': 'rgba(101, 142, 133, 0.7)',
        'var(--color-accent2)': 'rgba(191, 172, 143, 0.7)',
        'var(--color-success)': 'rgba(46, 125, 50, 0.7)',
        'var(--color-warning)': 'rgba(251, 140, 0, 0.7)',
        'var(--color-danger)': 'rgba(211, 47, 47, 0.7)',
        'var(--color-light-gray)': 'rgba(180, 180, 180, 0.7)'
    },
    
    // Mapeamento de variáveis CSS para valores RGB sólidos (para bordas)
    coresSolidas: {
        'var(--color-primary)': 'rgb(166, 124, 82)',
        'var(--color-primary-rgb)': 'rgb(166, 124, 82)',
        'var(--color-secondary)': 'rgb(42, 75, 69)',
        'var(--color-secondary-rgb)': 'rgb(42, 75, 69)',
        'var(--color-tertiary)': 'rgb(217, 194, 167)',
        'var(--color-tertiary-rgb)': 'rgb(217, 194, 167)',
        'var(--color-accent1)': 'rgb(101, 142, 133)',
        'var(--color-accent2)': 'rgb(191, 172, 143)',
        'var(--color-success)': 'rgb(46, 125, 50)',
        'var(--color-warning)': 'rgb(251, 140, 0)',
        'var(--color-danger)': 'rgb(211, 47, 47)',
        'var(--color-light-gray)': 'rgb(180, 180, 180)'
    },
    
    // Valores diferentes para transparência por tipo de gráfico
    transparencia: {
        'bar': 0.7,
        'radar': 0.2,
        'line': 0.1,
        'pie': 0.8,
        'doughnut': 0.8,
        'default': 0.5
    },
    
    /**
     * Procura e corrige todos os gráficos na página atual
     */
    corrigirTodos: function() {
        console.log('🔍 Iniciando verificação de gráficos...');
        
        // Encontrar todos os elementos canvas
        const canvasElements = document.querySelectorAll('canvas');
        let contagemCorrigidos = 0;
        
        if (canvasElements.length === 0) {
            console.log('⚠️ Nenhum canvas encontrado na página.');
            return;
        }
        
        console.log(`📊 Encontrados ${canvasElements.length} elementos canvas.`);
        
        // Verificar cada canvas
        canvasElements.forEach((canvas) => {
            // Verificar se tem uma instância de gráfico
            const chartInstance = canvas._chart;
            
            if (!chartInstance) {
                console.log(`Canvas #${canvas.id || 'sem-id'} não tem um gráfico Chart.js associado.`);
                return;
            }
            
            const chartType = chartInstance.config.type;
            let corrigido = false;
            
            if (chartType === 'bar') {
                corrigido = this.corrigirGraficoBarras(canvas.id, chartInstance);
            } else if (chartType === 'radar') {
                corrigido = this.corrigirGraficoRadar(canvas.id, chartInstance);
            }
            
            if (corrigido) {
                contagemCorrigidos++;
            }
        });
        
        console.log(`✅ Verificação concluída. ${contagemCorrigidos} gráficos corrigidos.`);
        
        // Se nenhum gráfico foi corrigido nesta página, tentar encontrar elementos de dados
        if (contagemCorrigidos === 0) {
            this.corrigirElementosDados();
        }
    },
    
    /**
     * Corrige elementos de dados que ainda não foram renderizados como gráficos
     */
    corrigirElementosDados: function() {
        console.log('🔍 Procurando elementos de dados de gráficos não renderizados...');
        
        const dataElements = document.querySelectorAll('.chart-data[data-type]');
        let contagemCorrigidos = 0;
        
        if (dataElements.length === 0) {
            console.log('⚠️ Nenhum elemento de dados encontrado.');
            return;
        }
        
        console.log(`📋 Encontrados ${dataElements.length} elementos de dados para gráficos.`);
        
        // Verificar cada elemento de dados
        dataElements.forEach((dataElement) => {
            try {
                // Obter tipo e ID do gráfico
                const chartType = dataElement.getAttribute('data-type');
                const chartId = dataElement.getAttribute('data-chart');
                
                // Verificar apenas tipos que podem ter problemas
                if (!['bar', 'radar'].includes(chartType)) {
                    return;
                }
                
                const chartDataText = dataElement.textContent.trim();
                let chartData = JSON.parse(chartDataText);
                
                if (!chartData.datasets || !Array.isArray(chartData.datasets)) {
                    console.log(`⚠️ Dados inválidos para o gráfico ${chartId}.`);
                    return;
                }
                
                console.log(`🔍 Verificando dados para gráfico ${chartType} - ${chartId}...`);
                
                let foiModificado = false;
                const transparencia = this.transparencia[chartType] || this.transparencia.default;
                
                // Verificar datasets
                chartData.datasets.forEach((dataset, index) => {
                    if (typeof dataset.backgroundColor === 'string' && dataset.backgroundColor.includes('var(--')) {
                        // Substituir variável CSS por valor RGB
                        const corRgb = this.coresRgb[dataset.backgroundColor] || 
                                       `rgba(100, 100, 100, ${transparencia})`;
                        console.log(`🔧 Dataset "${dataset.label}" alterando backgroundColor de ${dataset.backgroundColor} para ${corRgb}`);
                        dataset.backgroundColor = corRgb;
                        foiModificado = true;
                    }
                    
                    // Verificar se precisa adicionar borderColor
                    if (!dataset.borderColor || dataset.borderColor.includes('var(--')) {
                        // Processar cor de borda com variável CSS
                        if (dataset.borderColor && dataset.borderColor.includes('var(--')) {
                            const corSolida = this.coresSolidas[dataset.borderColor] || 'rgb(100, 100, 100)';
                            console.log(`🔧 Dataset "${dataset.label}" alterando borderColor para: ${corSolida}`);
                            dataset.borderColor = corSolida;
                            foiModificado = true;
                        }
                        // Adicionar cor de borda se não existir
                        else if (!dataset.borderColor) {
                            let corBorda;
                            
                            if (typeof dataset.backgroundColor === 'string' && dataset.backgroundColor.includes('rgba(')) {
                                // Criar cor sólida a partir da cor de fundo
                                corBorda = dataset.backgroundColor.replace('rgba', 'rgb').replace(/,\s*[\d.]+\)/, ')');
                            } else if (typeof dataset.backgroundColor === 'string' && dataset.backgroundColor.includes('var(--')) {
                                // Usar cor sólida correspondente à variável
                                corBorda = this.coresSolidas[dataset.backgroundColor] || 'rgb(100, 100, 100)';
                            } else {
                                // Cor baseada no índice
                                const coresList = Object.values(this.coresSolidas);
                                corBorda = coresList[index % coresList.length];
                            }
                            
                            console.log(`🔧 Dataset "${dataset.label}" adicionando borderColor: ${corBorda}`);
                            dataset.borderColor = corBorda;
                            foiModificado = true;
                        }
                    }
                });
                
                if (foiModificado) {
                    // Atualizar o conteúdo do elemento
                    dataElement.textContent = JSON.stringify(chartData, null, 4);
                    contagemCorrigidos++;
                    console.log(`✅ Dados para o gráfico ${chartId} corrigidos.`);
                } else {
                    console.log(`✓ Dados para o gráfico ${chartId} já estão corretos.`);
                }
            } catch (error) {
                console.error('Erro ao processar elemento de dados:', error);
            }
        });
        
        console.log(`✅ Verificação de elementos concluída. ${contagemCorrigidos} elementos corrigidos.`);
        
        if (contagemCorrigidos > 0) {
            console.log('⚠️ Recarregue a seção ou a página para aplicar as correções.');
        }
    },
    
    /**
     * Corrige as cores em um gráfico de barras específico
     * @param {string} chartId - ID do canvas do gráfico
     * @param {Chart} chartInstance - Instância do gráfico
     * @returns {boolean} - Indica se alguma correção foi aplicada
     */
    corrigirGraficoBarras: function(chartId, chartInstance) {
        console.log(`🔍 Verificando gráfico de barras: ${chartId}`);
        
        const datasets = chartInstance.data.datasets;
        let foiModificado = false;
        
        // Verificar cada dataset
        datasets.forEach((dataset, index) => {
            // Verificar se algum dataset tem um array de cores
            if (Array.isArray(dataset.backgroundColor)) {
                console.log(`⚠️ Dataset "${dataset.label}" tem um array de cores para backgroundColor.`);
                
                // Para gráficos de barras agrupadas, é melhor ter uma cor por dataset
                // Escolher uma cor única baseada no índice do dataset
                const coresList = Object.values(this.coresRgb);
                const corRgb = coresList[index % coresList.length];
                
                console.log(`🔧 Aplicando cor única: ${corRgb}`);
                dataset.backgroundColor = corRgb;
                foiModificado = true;
            }
            
            // Verificar se precisa de cor de borda
            if (!dataset.borderColor) {
                let corBorda;
                
                if (typeof dataset.backgroundColor === 'string' && dataset.backgroundColor.includes('rgba(')) {
                    // Criar cor sólida a partir da cor de fundo
                    corBorda = dataset.backgroundColor.replace('rgba', 'rgb').replace(/,\s*[\d.]+\)/, ')');
                } else {
                    // Usar cor baseada no índice
                    const coresList = Object.values(this.coresSolidas);
                    corBorda = coresList[index % coresList.length];
                }
                
                console.log(`🔧 Adicionando borderColor: ${corBorda}`);
                dataset.borderColor = corBorda;
                foiModificado = true;
            }
        });
        
        if (foiModificado) {
            console.log(`✅ Aplicando mudanças no gráfico: ${chartId}`);
            chartInstance.update();
            return true;
        } else {
            console.log(`✓ Gráfico ${chartId} não precisou de correções.`);
            return false;
        }
    },
    
    /**
     * Corrige as cores em um gráfico de radar específico
     * @param {string} chartId - ID do canvas do gráfico
     * @param {Chart} chartInstance - Instância do gráfico
     * @returns {boolean} - Indica se alguma correção foi aplicada
     */
    corrigirGraficoRadar: function(chartId, chartInstance) {
        console.log(`🔍 Verificando gráfico de radar: ${chartId}`);
        
        const datasets = chartInstance.data.datasets;
        let foiModificado = false;
        
        // Verificar cada dataset
        datasets.forEach((dataset, index) => {
            // Corrigir backgroundColor se for variável CSS
            if (typeof dataset.backgroundColor === 'string' && dataset.backgroundColor.includes('var(--')) {
                const corBase = this.coresSolidas[dataset.backgroundColor] || 
                                Object.values(this.coresSolidas)[index % Object.values(this.coresSolidas).length];
                // Para radar, usar transparência mais baixa (0.2)
                const corRgba = this.hexToRgba(corBase, 0.2);
                
                console.log(`🔧 Dataset "${dataset.label}" alterando backgroundColor para: ${corRgba}`);
                dataset.backgroundColor = corRgba;
                foiModificado = true;
            }
            
            // Corrigir borderColor se for variável CSS ou inexistente
            if (!dataset.borderColor || (typeof dataset.borderColor === 'string' && dataset.borderColor.includes('var(--'))) {
                let corBorda;
                
                if (dataset.borderColor && dataset.borderColor.includes('var(--')) {
                    corBorda = this.coresSolidas[dataset.borderColor];
                } else if (typeof dataset.backgroundColor === 'string' && dataset.backgroundColor.includes('rgba(')) {
                    // Usar cor sólida baseada na cor de fundo
                    corBorda = dataset.backgroundColor.replace('rgba', 'rgb').replace(/,\s*[\d.]+\)/, ')');
                } else {
                    // Usar cor do índice
                    corBorda = Object.values(this.coresSolidas)[index % Object.values(this.coresSolidas).length];
                }
                
                console.log(`🔧 Dataset "${dataset.label}" ${dataset.borderColor ? 'corrigindo' : 'adicionando'} borderColor: ${corBorda}`);
                dataset.borderColor = corBorda;
                foiModificado = true;
            }
            
            // Adicionar cores de pontos se necessário
            if (!dataset.pointBackgroundColor) {
                const corPonto = dataset.borderColor || Object.values(this.coresSolidas)[index % Object.values(this.coresSolidas).length];
                console.log(`🔧 Dataset "${dataset.label}" adicionando pointBackgroundColor: ${corPonto}`);
                dataset.pointBackgroundColor = corPonto;
                foiModificado = true;
            }
            
            if (!dataset.pointBorderColor) {
                console.log(`🔧 Dataset "${dataset.label}" adicionando pointBorderColor: #ffffff`);
                dataset.pointBorderColor = '#ffffff';
                foiModificado = true;
            }
        });
        
        if (foiModificado) {
            console.log(`✅ Aplicando mudanças no gráfico de radar: ${chartId}`);
            chartInstance.update();
            return true;
        } else {
            console.log(`✓ Gráfico de radar ${chartId} não precisou de correções.`);
            return false;
        }
    },
    
    /**
     * Converte cor hex para rgba
     * @private
     */
    hexToRgba: function(hex, alpha = 1) {
        if (!hex) return `rgba(100, 100, 100, ${alpha})`;
        
        // Se já for rgba, apenas ajustar transparência
        if (hex.startsWith('rgba(')) {
            return hex.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/, `rgba($1, $2, $3, ${alpha})`);
        }
        
        // Se for rgb, converter para rgba
        if (hex.startsWith('rgb(')) {
            return hex.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/, `rgba($1, $2, $3, ${alpha})`);
        }
        
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
window.ChartFixer = ChartFixer;

// Log para indicar que o fixer foi carregado
console.log('🔧 ChartFixer carregado. Use ChartFixer.corrigirTodos() no console para corrigir todos os gráficos.');

// Registrar evento para auto-corrigir quando a seção é carregada
document.addEventListener('amica:sectionLoaded', function(e) {
    console.log(`Seção ${e.detail.sectionId} carregada, verificando gráficos...`);
    
    // Aguardar um pouco para garantir que os gráficos foram renderizados
    setTimeout(function() {
        ChartFixer.corrigirTodos();
    }, 500);
}); 