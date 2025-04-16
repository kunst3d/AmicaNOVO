# Estrutura CSS do Relatório Amica

Este documento explica a organização dos arquivos CSS do relatório Amica, adotando a metodologia BEM (Block, Element, Modifier) para manter o código limpo, modular e de fácil manutenção.

## Arquivos Principais

O CSS do projeto está dividido em vários arquivos, cada um com uma responsabilidade específica:

- **variables.css**: Define variáveis para cores, espaçamentos, tipografia, etc.
- **reset.css**: Normaliza os estilos entre diferentes navegadores.
- **layout.css**: Define a estrutura geral da página, grid, containers.
- **typography.css**: Estilos para textos, títulos, parágrafos.
- **components.css**: Componentes reutilizáveis como cards, botões, tabelas.
- **sections.css**: Estilos específicos para as seções do relatório.
- **utilities.css**: Classes utilitárias para espaçamento, alinhamento, etc.
- **risk-matrix.css**: Estilos específicos para o componente de matriz de riscos.

## Metodologia BEM

BEM (Block, Element, Modifier) é uma metodologia para nomear classes CSS que facilita a manutenção e evita conflitos.

### Convenções de Nomenclatura

- **Block**: Representam componentes independentes (`.card`, `.button`).
- **Element**: Partes do bloco, usando dois sublinhados (`.card__title`, `.button__icon`).
- **Modifier**: Variações do bloco ou elemento, usando dois hífens (`.card--highlighted`, `.button--primary`).

### Exemplos no Código

```css
/* Block */
.content-card {
  background-color: var(--color-white);
  border-radius: var(--border-radius-m);
}

/* Element */
.content-card__title {
  font-size: var(--font-size-l);
}

/* Modifier */
.content-card--highlight {
  border-left: var(--border-width-thick) solid var(--color-primary);
}
```

## Organização de Componentes vs. Seções

- **components.css**: Contém estilos para componentes genéricos e reutilizáveis que podem ser usados em qualquer parte do relatório.
- **sections.css**: Contém estilos específicos para cada seção, como layout e componentes únicos daquela seção.

## Responsividade

O design é responsivo com breakpoints principais:

```css
/* Desktop first - breakpoints para tablets */
@media (max-width: 768px) {
  /* estilos para tablets */
}

/* Breakpoints para dispositivos móveis */
@media (max-width: 480px) {
  /* estilos para celulares */
}
```

## Variáveis CSS

Todas as cores, espaçamentos e outros valores são definidos como variáveis CSS em `variables.css`:

```css
:root {
  --color-primary: #FFDC00;
  --color-secondary: #0057B8;
  --space-s: 0.5rem;
  --font-size-m: 1rem;
  /* etc. */
}
```

Isto facilita a manutenção e garante consistência visual em todo o relatório.

## Como Contribuir

Ao adicionar novos estilos ao projeto:

1. Determine se o estilo é para um componente reutilizável (components.css) ou específico de uma seção (sections.css)
2. Siga a nomenclatura BEM
3. Use as variáveis CSS existentes para manter a consistência
4. Adicione os estilos responsivos quando necessário
5. Documente componentes complexos com comentários

## Performance

Para garantir a performance ideal:

- Evite aninhamento excessivo de seletores CSS
- Utilize classes em vez de IDs ou seletores de elementos quando possível
- Minimize o uso de !important
- Agrupe media queries por breakpoint 