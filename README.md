# Relatório Amica - Análise de Mercado de Semijoias

Relatório estratégico para a entrada da marca Amica no mercado brasileiro de semijoias, com análise de mercado, concorrência, estratégias de precificação, canais digitais e plano de expansão.

## 📊 Sobre o Relatório

Este relatório interativo apresenta uma análise completa do mercado de semijoias no Brasil, com foco em estratégias digitais para a marca Amica. O documento abrange:

- Análise do mercado de semijoias
- Benchmarking de concorrentes
- Segmentação de público-alvo
- Estratégias de precificação
- Canais de venda (marketplaces, e-commerce próprio, redes sociais)
- Estratégias de fidelização
- Plano de expansão
- Análise de riscos
- Recomendações estratégicas

## 🚀 Como Executar o Relatório

Para visualizar o relatório com todas as suas funcionalidades interativas, **é necessário executá-lo através de um servidor HTTP local**. Isso se deve às restrições de segurança dos navegadores modernos, que bloqueiam o carregamento de arquivos locais (AJAX) quando acessados diretamente via protocolo `file://`.

### Opções para Executar um Servidor Local:

#### Utilizando Python (recomendado):

```bash
# Navegue até a pasta do projeto
cd amica-relatorio

# Python 3
python -m http.server 8000

# OU Python 2
python -m SimpleHTTPServer 8000
```

Depois acesse: http://localhost:8000

#### Utilizando Node.js (opção 1 - script incluso):

```bash
# Navegue até a pasta do projeto
cd amica-relatorio

# Execute o servidor Node.js incluso
node server.js
```

Acesse: http://localhost:8000

#### Utilizando Node.js (opção 2 - via npx):

```bash
# Navegue até a pasta do projeto
cd amica-relatorio

# Instale e execute o serve (não requer instalação prévia)
npx serve
```

Acesse a URL indicada no terminal (tipicamente http://localhost:5000)

#### Utilizando PHP:

```bash
# Navegue até a pasta do projeto
cd amica-relatorio

# Inicie o servidor PHP embutido
php -S localhost:8000
```

Depois acesse: http://localhost:8000

#### Utilizando Visual Studio Code:

1. Instale a extensão "Live Server"
2. Clique com o botão direito no arquivo `index.html`
3. Selecione "Open with Live Server"

## 📁 Estrutura do Projeto

```
amica-relatorio/
├── assets/
│   ├── css/         # Estilos do relatório
│   ├── data/        # Dados JSON para gráficos
│   ├── img/         # Imagens e ícones
│   └── js/          # Scripts do relatório
├── content/         # Conteúdo HTML de cada seção do relatório
└── index.html       # Página principal
```

## 💻 Compatibilidade

O relatório foi otimizado para os seguintes navegadores:
- Google Chrome (versão 90+)
- Mozilla Firefox (versão 88+)
- Microsoft Edge (versão 90+)
- Safari (versão 14+)

O layout é responsivo e foi desenvolvido seguindo a abordagem mobile-first, funcionando adequadamente em dispositivos móveis, tablets e desktops.

## 🔧 Solução de Problemas

### Erro "Não foi possível carregar o conteúdo"

Este erro ocorre quando você tenta acessar o relatório diretamente pelo sistema de arquivos (protocolo `file://`). Para resolver:

1. Utilize um dos métodos acima para iniciar um servidor HTTP local
2. Acesse o relatório através do endereço fornecido pelo servidor (ex: http://localhost:8000)

### Gráficos não aparecem

Certifique-se de estar usando um navegador atualizado e que o JavaScript esteja habilitado. Os gráficos são renderizados utilizando Chart.js.

## Tecnologias Utilizadas

- HTML5
- CSS3 com variáveis CSS
- JavaScript (ES6+)
- Chart.js para visualização de dados

## Características

- Design responsivo
- Visualização interativa de dados
- Navegação amigável entre seções do relatório
- Gráficos dinâmicos e tabelas

## Personalização

### Dados do Relatório

Os dados do relatório estão contidos em `assets/data/data.json`. Você pode modificar este arquivo para atualizar as informações exibidas.

### Estilos e Aparência

Os estilos visuais podem ser personalizados através do arquivo `assets/css/styles.css`. As principais variáveis de estilo (cores, fontes, espaçamentos) estão definidas no início do arquivo usando variáveis CSS.

### Configuração de Gráficos

A configuração e personalização dos gráficos podem ser ajustadas em `assets/data/charts-config.json`.

## Otimização para Produção

Para ambientes de produção, recomenda-se:

1. Minificar os arquivos CSS e JavaScript
2. Otimizar as imagens
3. Implementar técnicas de cache adequadas

## Licença

Este projeto é de uso interno exclusivo da Amica e não deve ser distribuído sem autorização.

## Contato

Para mais informações, entre em contato com a equipe de desenvolvimento.
