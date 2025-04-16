/**
 * risk-matrix.js
 * Script para manipulação e exibição da matriz de risco
 */

document.addEventListener('DOMContentLoaded', () => {
    initRiskMatrix();
});

/**
 * Inicializa todas as matrizes de risco presentes na página
 */
function initRiskMatrix() {
    // Procura por todas as matrizes de risco na página
    const riskMatrices = document.querySelectorAll('.risk-matrix');
    
    if (riskMatrices.length === 0) return;
    
    // Inicializa cada matriz encontrada
    riskMatrices.forEach(matrix => {
        setupRiskMatrixCells(matrix);
    });
}

/**
 * Configura as células da matriz de risco
 * @param {HTMLElement} matrixContainer - O container da matriz de risco
 */
function setupRiskMatrixCells(matrixContainer) {
    const cells = matrixContainer.querySelectorAll('.risk-matrix__cell');
    
    cells.forEach(cell => {
        const impact = cell.getAttribute('data-impact');
        const probability = cell.getAttribute('data-probability');
        
        // Define a classe correta com base no nível de impacto e probabilidade
        if (impact === 'high' && probability === 'high') {
            cell.setAttribute('title', 'Risco Crítico');
        } else if ((impact === 'high' && probability === 'medium') || 
                  (impact === 'medium' && probability === 'high')) {
            cell.setAttribute('title', 'Risco Alto');
        } else if ((impact === 'high' && probability === 'low') || 
                  (impact === 'medium' && probability === 'medium') || 
                  (impact === 'low' && probability === 'high')) {
            cell.setAttribute('title', 'Risco Médio');
        } else {
            cell.setAttribute('title', 'Risco Baixo');
        }
        
        // Adiciona comportamento de tooltip ou outros comportamentos se necessário
    });
}

/**
 * Função para carregar dados de risco dinamicamente
 * @param {String} dataSource - Fonte de dados para a matriz (pode ser um arquivo JSON ou endpoint)
 * @param {HTMLElement} matrixContainer - O container da matriz de risco
 */
function loadRiskData(dataSource, matrixContainer) {
    if (!dataSource) return;
    
    fetch(dataSource)
        .then(response => response.json())
        .then(data => {
            populateRiskMatrix(data, matrixContainer);
        })
        .catch(error => {
            console.error('Erro ao carregar dados da matriz de risco:', error);
        });
}

/**
 * Preenche a matriz de risco com os dados fornecidos
 * @param {Object} data - Dados de risco
 * @param {HTMLElement} matrixContainer - O container da matriz de risco
 */
function populateRiskMatrix(data, matrixContainer) {
    if (!data || !data.risks) return;
    
    const cells = matrixContainer.querySelectorAll('.risk-matrix__cell');
    
    // Limpa as células
    cells.forEach(cell => {
        const riskItems = cell.querySelector('.risk-matrix__items');
        if (riskItems) {
            riskItems.innerHTML = '';
        }
    });
    
    // Preenche as células com os riscos
    data.risks.forEach(risk => {
        const cell = matrixContainer.querySelector(`.risk-matrix__cell[data-impact="${risk.impact}"][data-probability="${risk.probability}"]`);
        
        if (cell) {
            let riskItems = cell.querySelector('.risk-matrix__items');
            
            if (!riskItems) {
                riskItems = document.createElement('div');
                riskItems.className = 'risk-matrix__items';
                cell.appendChild(riskItems);
            }
            
            // Adiciona o item de risco
            const riskText = document.createElement('div');
            riskText.className = 'risk-item';
            riskText.textContent = risk.description;
            riskItems.appendChild(riskText);
        }
    });
    
    // Atualiza o título e a fonte se fornecidos
    if (data.title) {
        const titleElement = matrixContainer.querySelector('.risk-matrix__title');
        if (titleElement) {
            titleElement.textContent = data.title;
        }
    }
    
    if (data.source) {
        const sourceElement = matrixContainer.querySelector('.risk-matrix__source');
        if (sourceElement) {
            sourceElement.textContent = data.source;
        }
    }
}
