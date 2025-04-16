/**
 * Components Loader
 * Carrega componentes HTML reutilizáveis e os insere no documento.
 * Suporta header, footer e outros componentes modulares.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Carregar header
    loadComponent('header-container', 'components/header.html');
    
    // Carregar footer
    loadComponent('footer-container', 'components/footer.html');
    
    // Configurar componentes dinâmicos
    setupDynamicComponents();
});

/**
 * Carrega um componente HTML externo e o insere no elemento alvo
 * @param {string} targetId - ID do elemento onde o componente será inserido
 * @param {string} componentPath - Caminho do arquivo do componente
 */
function loadComponent(targetId, componentPath) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    
    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar ${componentPath}: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            targetElement.innerHTML = html;
            // Disparar evento para informar que o componente foi carregado
            document.dispatchEvent(new CustomEvent('component-loaded', { detail: { id: targetId } }));
        })
        .catch(error => {
            console.error(`Falha ao carregar componente: ${error.message}`);
            // Se estiver usando o protocolo file://, mostrar uma mensagem mais amigável
            if (window.location.protocol === 'file:') {
                targetElement.innerHTML = `
                    <div class="important-notice">
                        <p>Não foi possível carregar o componente ${componentPath}.</p>
                        <p>Você está acessando através do protocolo file://, o que pode bloquear carregamentos dinâmicos.</p>
                        <p>Por favor, use um servidor HTTP local conforme instruções na página.</p>
                    </div>
                `;
            }
        });
}

/**
 * Configurar listeners e comportamento para componentes dinâmicos
 * como tabs, matriz de risco, timeline, etc.
 */
function setupDynamicComponents() {
    // Configurar depois que o conteúdo for carregado
    document.addEventListener('content-loaded', (event) => {
        const sectionId = event.detail.sectionId;
        const sectionElement = document.getElementById(sectionId);
        
        if (!sectionElement) return;
        
        // Inicializar componentes específicos com base na seção
        if (sectionId === 'analise-riscos') {
            initializeRiskMatrix(sectionElement);
        }
        
        if (sectionId === 'plano-expansao') {
            initializeTimeline(sectionElement);
        }
        
        // Inicializar gráficos e tabelas em qualquer seção
        initializeCharts(sectionElement);
        initializeTables(sectionElement);
    });
}

/**
 * Inicializa a matriz de risco quando presente na seção
 * @param {HTMLElement} sectionElement - Elemento da seção que contém a matriz
 */
function initializeRiskMatrix(sectionElement) {
    const riskMatrices = sectionElement.querySelectorAll('.risk-matrix-component');
    if (!riskMatrices.length) return;
    
    riskMatrices.forEach(matrix => {
        // Código específico para inicializar a matriz de risco
        // Este será implementado quando o arquivo risk-matrix.js for criado
        console.log('Matriz de risco encontrada e pronta para inicialização');
    });
}

/**
 * Inicializa o componente de timeline quando presente na seção
 * @param {HTMLElement} sectionElement - Elemento da seção que contém a timeline
 */
function initializeTimeline(sectionElement) {
    const timelines = sectionElement.querySelectorAll('.timeline-component');
    if (!timelines.length) return;
    
    timelines.forEach(timeline => {
        // Configurar alternância entre visualizações horizontal e vertical
        const viewToggleButtons = timeline.querySelectorAll('.btn-view-toggle');
        const horizontalView = timeline.querySelector('.horizontal-view');
        const verticalView = timeline.querySelector('.vertical-view');
        
        viewToggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover a classe 'active' de todos os botões
                viewToggleButtons.forEach(btn => btn.classList.remove('active'));
                
                // Adicionar a classe 'active' ao botão clicado
                this.classList.add('active');
                
                // Mostrar a visualização correspondente
                const viewType = this.getAttribute('data-view');
                if (viewType === 'horizontal') {
                    horizontalView.style.display = 'block';
                    verticalView.style.display = 'none';
                } else {
                    horizontalView.style.display = 'none';
                    verticalView.style.display = 'block';
                }
            });
        });
        
        // Configuração inicial - mostrar visualização horizontal em desktop e vertical em mobile
        if (window.innerWidth < 768) {
            viewToggleButtons.forEach(btn => {
                if (btn.getAttribute('data-view') === 'vertical') {
                    btn.click();
                }
            });
        }
        
        console.log('Timeline encontrada e inicializada');
    });
}

/**
 * Inicializa gráficos Chart.js quando presentes na seção
 * @param {HTMLElement} sectionElement - Elemento da seção que contém gráficos
 */
function initializeCharts(sectionElement) {
    const chartComponents = sectionElement.querySelectorAll('.chart-component');
    if (!chartComponents.length) return;
    
    chartComponents.forEach(chartComponent => {
        const canvas = chartComponent.querySelector('.chart-canvas');
        if (canvas && canvas.id) {
            // Verificar se já existe um gráfico inicializado para este canvas
            const existingChart = Chart.getChart(canvas.id);
            if (existingChart) {
                existingChart.destroy();
            }
            
            // A inicialização específica do gráfico será feita pelo charts.js
            console.log(`Gráfico encontrado: ${canvas.id}`);
        }
    });
}

/**
 * Inicializa tabelas interativas quando presentes na seção
 * @param {HTMLElement} sectionElement - Elemento da seção que contém tabelas
 */
function initializeTables(sectionElement) {
    const tableComponents = sectionElement.querySelectorAll('.table-component');
    if (!tableComponents.length) return;
    
    tableComponents.forEach(table => {
        // Configurar funcionalidades de ordenação, filtragem, etc.
        const searchInput = table.querySelector('.search-input');
        const sortButton = table.querySelector('.btn-sort');
        
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                filterTable(table, this.value);
            });
        }
        
        if (sortButton) {
            sortButton.addEventListener('click', function() {
                const currentDirection = this.getAttribute('data-sort');
                const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
                this.setAttribute('data-sort', newDirection);
                sortTable(table, newDirection);
            });
        }
    });
}

/**
 * Filtra linhas da tabela com base no termo de busca
 * @param {HTMLElement} tableComponent - Componente da tabela
 * @param {string} searchTerm - Termo de busca
 */
function filterTable(tableComponent, searchTerm) {
    const rows = tableComponent.querySelectorAll('tbody tr');
    const term = searchTerm.toLowerCase();
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
}

/**
 * Ordena a tabela com base na primeira coluna
 * @param {HTMLElement} tableComponent - Componente da tabela
 * @param {string} direction - Direção da ordenação ('asc' ou 'desc')
 */
function sortTable(tableComponent, direction) {
    const table = tableComponent.querySelector('table');
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const headers = table.querySelectorAll('th');
    const firstHeader = headers[0];
    
    if (!table || !rows.length || !firstHeader) return;
    
    const sortIndex = 0; // Primeira coluna
    
    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[sortIndex].textContent.trim();
        const cellB = rowB.cells[sortIndex].textContent.trim();
        
        if (direction === 'asc') {
            return cellA.localeCompare(cellB, 'pt-BR');
        } else {
            return cellB.localeCompare(cellA, 'pt-BR');
        }
    });
    
    // Remover linhas existentes e adicionar ordenadas
    const tbody = table.querySelector('tbody');
    rows.forEach(row => tbody.appendChild(row));
} 