# ESPECIFICAÇÃO TÉCNICA - RELATÓRIO AMICA

## 1. VISÃO GERAL

O projeto consiste em uma apresentação web interativa do Relatório Amica, permitindo a visualização dinâmica de dados de mercado e análises estratégicas para o lançamento da marca de semijoias.

**Objetivo Principal:**
Transformar o relatório textual em uma plataforma digital interativa que facilite a compreensão dos dados e recomendações.

**Tecnologias Base:**
- HTML5: Estruturação semântica do conteúdo
- CSS3: Estilização responsiva com variáveis CSS
- JavaScript: Interatividade e visualizações dinâmicas (Chart.js)

**Estrutura do Conteúdo:**
1. Sumário Executivo (content/sumario-executivo.html)
2. Análise do Mercado (content/analise-mercado.html)
3. Análise de Concorrência (content/analise-concorrencia.html)
4. Público-Alvo (content/publico-alvo.html)
5. Precificação e Custos (content/precificacao-custos.html)
6. Marketplaces (content/marketplaces.html)
7. E-commerce Próprio (content/ecommerce-proprio.html)
8. Redes Sociais (content/redes-sociais.html)
9. Fidelização de Clientes (content/fidelizacao-clientes.html)
10. Plano de Expansão (content/plano-expansao.html)
11. Análise de Riscos (content/analise-riscos.html)
12. Conclusão e Recomendações (content/conclusao-recomendacoes.html)

## 2. ARQUITETURA DE ARQUIVOS

### 2.1 Estrutura de Diretórios

```
amica-relatorio/
├── index.html               # Ponto de entrada principal
├── content/                 # Arquivos HTML de cada seção
│   ├── sumario-executivo.html        # Seção 1: Sumário Executivo
│   ├── analise-mercado.html          # Seção 2: Análise do Mercado
│   ├── analise-concorrencia.html     # Seção 3: Análise de Concorrência
│   ├── publico-alvo.html             # Seção 4: Público-Alvo
│   ├── precificacao-custos.html      # Seção 5: Precificação e Custos
│   ├── marketplaces.html             # Seção 6: Marketplaces
│   ├── ecommerce-proprio.html        # Seção 7: E-commerce Próprio
│   ├── redes-sociais.html            # Seção 8: Redes Sociais
│   ├── fidelizacao-clientes.html     # Seção 9: Fidelização de Clientes
│   ├── plano-expansao.html           # Seção 10: Plano de Expansão
│   ├── analise-riscos.html           # Seção 11: Análise de Riscos
│   └── conclusao-recomendacoes.html  # Seção 12: Conclusão e Recomendações
├── components/              # Componentes reutilizáveis
│   ├── header.html          # Cabeçalho comum
│   ├── footer.html          # Rodapé comum
│   ├── section.html         # Template base para seções
│   ├── table.html           # Template para tabelas
│   ├── chart.html           # Wrapper para gráficos
│   ├── risk-matrix.html     # Matriz de riscos interativa
│   └── timeline.html        # Visualização de timeline Gantt
├── assets/
│   ├── css/                 # Arquivos CSS por função
│   │   ├── base.css         # Estilos base e variáveis
│   │   ├── layout.css       # Sistema de grid e layouts
│   │   ├── sections.css     # Estilos para seções
│   │   ├── tables.css       # Estilos para tabelas
│   │   ├── charts.css       # Estilos para gráficos
│   │   ├── risk-matrix.css  # Estilos para matriz de riscos
│   │   ├── timeline.css     # Estilos para timeline Gantt
│   │   ├── navigation.css   # Estilos de navegação
│   │   ├── components.css   # Estilos de componentes menores
│   │   └── responsive.css   # Adaptações responsivas específicas
│   ├── js/                  # Scripts JavaScript
│   │   ├── main.js          # Inicialização e configuração
│   │   ├── navigation.js    # Controle de navegação
│   │   ├── charts.js        # Configuração de gráficos
│   │   ├── data-loader.js   # Carregamento de dados JSON
│   │   ├── risk-matrix.js   # Lógica da matriz de riscos
│   │   └── timeline.js      # Lógica da timeline
│   ├── data/                # Dados em formato JSON
│   │   ├── data.json        # Dados principais do relatório
│   │   └── charts-config.json # Configurações dos gráficos
│   ├── fonts/               # Tipografia
│   │   ├── inter/           # Fonte para corpo do texto
│   │   └── cormorant/       # Fonte para títulos
│   └── img/                 # Imagens e ícones
│       ├── icons/           # Ícones de interface
│       ├── logos/           # Logos da Amica
│       └── graphics/        # Elementos gráficos adicionais
└── README.md                # Documentação
```

### 2.2 Função Detalhada de Cada Arquivo

#### Arquivos HTML

- **index.html**: 
  - Ponto de entrada da aplicação
  - Carregamento de recursos essenciais
  - Container principal para injeção de conteúdo
  - Menus de navegação global

- **content/*.html** (12 arquivos):
  - Conteúdo específico de cada seção do relatório
  - Estrutura semântica com headings hierárquicos
  - Pontos de injeção para visualizações dinâmicas
  - Referências a componentes compartilhados

- **components/header.html**:
  - Cabeçalho consistente entre seções
  - Elementos de navegação principal
  - Logotipo e identidade visual
  - Controles de acessibilidade

- **components/footer.html**:
  - Rodapé padronizado
  - Informações de copyright
  - Links para fontes e referências
  - Controles de navegação secundária

- **components/section.html**:
  - Template base para estrutura de seções
  - Padrão de heading, descrição e conteúdo
  - Espaços para inserção de visualizações
  - Classes para CSS consistente

- **components/table.html**:
  - Template para dados tabulares
  - Estrutura responsiva para diferentes dispositivos
  - Hooks para ordenação e filtragem
  - Classes para variações visuais por tipo de dado

- **components/chart.html**:
  - Wrapper para visualizações Chart.js
  - Containers adaptáveis para diferentes tipos de gráfico
  - Espaços para legendas e descrições
  - Controles de interatividade

- **components/risk-matrix.html**:
  - Implementação específica da matriz de risco 5x5
  - Grid interativo com eixos probabilidade/impacto
  - Filtros por categoria de risco
  - Tooltips detalhados para planos de mitigação

- **components/timeline.html**:
  - Visualização Gantt para fases do projeto
  - Marcadores de marcos e dependências
  - Controles para expansão/colapso de detalhes
  - Adaptação entre visualização horizontal e vertical

#### Arquivos CSS

- **base.css**:
  - Reset CSS para normalização entre navegadores
  - Variáveis globais (cores, espaçamentos, tipografia)
  - Estilos base para elementos HTML
  - Utilitários de uso global
  - Classes auxiliares para flexbox e grid

- **layout.css**:
  - Sistema de grid responsivo
  - Containers e wrappers de conteúdo
  - Estruturas de layout para diferentes breakpoints
  - Controles para sidebar e áreas de conteúdo
  - Classes para divisão de espaço na tela

- **sections.css**:
  - Estilos específicos para cada tipo de seção
  - Cabeçalhos e divisores de seção
  - Espaçamentos e alinhamentos
  - Variações por tipo de conteúdo
  - Transições entre seções

- **tables.css**:
  - Formatação de tabelas e dados tabulares
  - Estilos responsivos (scroll horizontal em mobile)
  - Variações visuais para diferentes tipos de dados
  - Cabeçalhos fixos e células estilizadas
  - Controles visuais para ordenação e filtragem

- **charts.css**:
  - Containers e proporções para gráficos
  - Estilos para legendas e rótulos
  - Personalização dos temas do Chart.js
  - Tooltips e elementos interativos
  - Adaptações para diferentes resoluções

- **risk-matrix.css**:
  - Grid específico para matriz de riscos
  - Gradiente de cores para níveis de risco
  - Estilização de filtros e controles
  - Tooltips especializados para detalhes
  - Adaptações para visualização mobile

- **timeline.css**:
  - Layout tipo Gantt para fases do projeto
  - Estilização de marcos e dependências
  - Código de cores para status de atividades
  - Controles para expansão/colapso
  - Transições entre visualização horizontal e vertical

- **navigation.css**:
  - Menus laterais e navegação principal
  - Variação entre desktop (lateral) e mobile (hambúrguer)
  - Indicadores de seção atual
  - Breadcrumbs e trilhas de navegação
  - Transições e animações para navegação

#### Arquivos JavaScript

- **main.js**:
  - Inicialização da aplicação
  - Carregamento de componentes
  - Gestão de estado global
  - Detecção de dispositivo e capacidades
  - Configurações gerais do sistema

- **navigation.js**:
  - Controle de navegação entre seções
  - Implementação de menu hambúrguer
  - Scroll suave entre âncoras
  - Highlight da seção atual
  - Histórico de navegação

- **charts.js**:
  - Inicialização e configuração do Chart.js
  - Funções para criar diferentes tipos de gráficos
  - Carregamento e formatação de dados
  - Handlers para interatividade
  - Adaptação responsiva de visualizações

- **risk-matrix.js**:
  - Lógica da matriz de riscos 5x5
  - Filtros por categoria e severidade
  - Cálculo de pontuações de risco
  - Interatividade para tooltips e detalhes
  - Atualização dinâmica de visualização

- **timeline.js**:
  - Implementação do cronograma Gantt
  - Lógica para dependências entre atividades
  - Controles de expansão e colapso
  - Cálculos de datas e durações
  - Alternância entre views

## 3. DESIGN E COMPONENTES VISUAIS

### 3.1 Princípios Visuais

- Design minimalista e profissional
- Hierarquia visual clara (títulos, subtítulos, conteúdo)
- Paleta de cores a definir
- Tipografia combinando serif (títulos) e sans-serif (corpo)
- Uso estratégico de espaço em branco

### 3.2 Componentes Visuais Prioritários

| Componente | Descrição | Prioridade |
|------------|-----------|------------|
| Matriz de Riscos | Grid 5x5 interativo com filtros | Alta |
| Timeline | Visualização Gantt das 3 fases | Alta |
| Comp. Concorrentes | Tabela comparativa com filtros | Alta |
| Gráficos de Mercado | Visualizações de crescimento | Alta |
| Jornada do Cliente | Fluxo horizontal interativo | Média |
| Calculadora ROI | Ferramenta para simulações | Média |
| Quiz de Personas | Identificação com segmentos | Baixa |

### 3.3 Visualizações de Dados Prioritárias

| Seção | Visualização | Tipo | Interatividade |
|-------|--------------|------|----------------|
| 2.1 | Preço médio/categoria | Barras | Ordenação, filtro |
| 3.1 | Fatores decisão/persona | Radar | Seleção múltipla |
| 5.1 | Participação marketplaces | Pizza | Destaque ao hover |
| 8.1 | Impacto fidelização | Barras | Ordenação |
| 9.3 | Matriz de riscos | Grid 5x5 | Filtros, tooltips |
| 10.2 | Roadmap implementação | Gantt | Expansão/colapso |

## 4. RESPONSIVIDADE E ACESSIBILIDADE

### 4.1 Estratégia Responsiva

- Abordagem mobile-first
- Breakpoints principais: 768px, 1024px, 1440px
- Adaptações específicas para cada componente:
  - Menu: lateral (desktop) → hambúrguer (mobile)
  - Tabelas: scroll horizontal e versões simplificadas
  - Gráficos: simplificação e empilhamento
  - Timeline: vertical em mobile, horizontal em desktop

### 4.2 Acessibilidade

- Semântica HTML correta e ARIA landmarks
- Contraste adequado (WCAG AA)
- Navegação por teclado completa
- Textos alternativos para elementos visuais
- Compatibilidade com leitores de tela

## 5. IMPLEMENTAÇÃO

### 5.1 Prioridades de Desenvolvimento

1. Estrutura base e navegação
2. Componentes de visualização de dados essenciais:
   - Tabelas comparativas (concorrentes, marketplaces)
   - Gráficos de barras e pizza para dados de mercado
   - Matriz de riscos 5x5
   - Timeline de implementação
3. Componentes interativos secundários
4. Recursos avançados de personalização

### 5.2 Conjuntos de Dados Principais

Os dados para implementação estão disponíveis no Relatorio.md e incluem:
- Preços médios por categoria e concorrente
- Fatores de decisão por persona
- Participação de mercado por marketplace
- Métricas de impacto de estratégias de fidelização
- Taxas de engajamento por tipo de conteúdo

### 5.3 Entregas e Validação

- Validação de markup HTML (W3C)
- Teste em múltiplos navegadores (Chrome, Firefox, Safari, Edge)
- Verificação de responsividade em diversos dispositivos
- Avaliação de acessibilidade (WCAG)
- Teste de performance e otimização

## 6. COMPONENTES ESPECÍFICOS PARA O RELATÓRIO AMICA

### 6.1 Visualizações Customizadas

- **Timeline das Fases de Implementação**:
  - Visualização das três fases do projeto com marcos
  - Expansão de detalhes para cada atividade
  - Código de cores para status e responsáveis

- **Matriz de Comparação Competitiva**:
  - Comparação lado a lado dos concorrentes
  - Filtros por atributos e métricas
  - Destaque visual para vantagens da Amica

- **Visualizador de Jornada do Cliente**:
  - Fluxo horizontal das etapas da jornada
  - Pontos de contato críticos destacados
  - Métricas de conversão por etapa

- **Calculadora de ROI de Fidelização**:
  - Simulador interativo para estratégias
  - Projeções de impacto no LTV
  - Comparação visual de abordagens

### 6.2 Ordem de Implementação Visual

1. Roadmap de implementação faseado (10.2)
2. Comparativo de concorrentes (2.1)
3. Gráfico de crescimento de mercado (1.2)
4. Matriz de segmentação de personas (3.1)
5. Participação de marketplaces (5.1)
6. Impacto de estratégias de fidelização (8.1)
7. Matriz de riscos estratégicos (9.3)

Todas as visualizações devem seguir a identidade visual da Amica, priorizando clareza, simplicidade e estilo minimalista moderno.
