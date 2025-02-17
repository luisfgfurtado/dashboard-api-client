## 1. Visão Geral

**Nome do Projeto**: API Tester (Ferramenta Desktop para Teste de APIs)

**Objetivo**: Construir um aplicativo Desktop (Electron) para organizar e testar microserviços, permitindo:
- Chamar endpoints de forma inteligente.
- Organizar endpoints em containers (widgets).
- Compartilhar dados e contextos (ex.: tokens, IDs).
- Persistir configurações e histórico localmente.

**Plataforma**: Electron + React + TypeScript (usando Electron Forge como base).

---

## 2. Requisitos Funcionais

1. **Autenticação**  
   - Configurar parâmetros de OAuth2: AUTH_URL, CLIENT_ID, REDIRECT_URI, SCOPE.  
   - Ao clicar “Autenticar”, inicia um servidor local + abre navegador para login, recebe token JWT, salva globalmente.  
   - Permite exportar/importar config de autenticação em JSON.

2. **Containers (Widgets)**  
   - Agrupam endpoints de um mesmo microserviço.  
   - Permitem importar especificações OpenAPI (para facilitar configurações).  
   - Cada container pode ter componentes como:
     - **Button**: Atalho para chamar um endpoint específico (parâmetros, body, etc.).  
     - **List**: Consulta GET que retorna itens, com botão “atualizar”.  
     - **Combo (Seletor)**: Similar a List, mas permite selecionar um item e expor atributos dinamicamente para outros containers.  
   - Parametrização com valores dinâmicos (ex.: TenantId escolhido em outro container).  
   - Permite “expandir” ou “reduzir” o container, exibindo apenas itens “pinned”.  
   - Exportar/Importar configurações do container em JSON.

3. **Configuração de Chamadas**  
   - Definir método (GET, POST etc.), URL, headers, body (JSON ou texto).  
   - Suporta placeholders substituídos em tempo de execução.  
   - Integração com “schemes” do OpenAPI (exibir formulário).  
   - (Teste automatizado – fora do escopo da primeira versão.)

4. **Gerenciamento de Dashboards**  
   - Criar múltiplos dashboards, cada um com vários containers.  
   - Mover, redimensionar e remover containers (ou mantê-los fixos, se preferir).  
   - Exportar/importar dashboards em JSON.

5. **Menu Superior**  
   - Configurar o “container global” de autenticação.  
   - Listar dashboards em abas.  
   - Importar/Exportar dashboards ou o projeto inteiro.

6. **Global Store**  
   - Compartilha dados de autenticação, IDs selecionados e demais variáveis entre containers.  
   - Disponibiliza valores dinâmicos para endpoints (TenantId, PropertyId, etc.).  
   - Possibilita exportar/importar snapshot desses valores.

7. **Persistência e Logs**  
   - Armazenar configurações e tokens localmente (Electron Store ou similar).  
   - Registro de histórico local (ex.: calls, responses).  
   - Log global e log local do container (unificação).

---

## 3. Arquitetura e Componentes

1. **Electron**  
   - Processo Main: gerencia janela principal, fluxo de autenticação (servidor local Express), e `ipcMain` para comunicação.  
   - Processo Renderer: aplicação React que exibe UI (containers, botões, etc.).  
   - Preload (opcional): para exposição segura de `ipcRenderer` via `contextBridge`.

2. **React + TypeScript**  
   - **GlobalStoreProvider**: React Context para dados globais (token, variáveis).  
   - **Auth**: Componente para fluxo OAuth2/JWT.  
   - **Container**: Bloco que representa um microserviço ou parte dele, com configurações (endpoints, etc.) e subcomponentes.  
   - **Subcomponentes**: ButtonComponent, ListComponent, ComboSelectComponent etc., cada um herda ou usa BasicCallSettings.  
   - **GlobalLog**: Centraliza logs de cada container.  
   - **AppSettings**: Configurações gerais (ex.: paths, persistência).  

3. **Banco de Dados Local**  
   - **Electron Store** para persistir tokens e configs básicas (chaves/valores).  
   - (Opcional) SQLite ou LowDB para histórico mais rico.

4. **Fluxo de Autenticação** (exemplo)  
   - Botão “Autenticar” → main.ts (Express) → abre browser → callback → envia token ao Renderer via IPC → Renderer armazena token no GlobalStore.

5. **Chamada de API Inteligente**  
   - Ao chamar endpoint (ex.: ButtonComponent), recupera token, IDs e placeholders do GlobalStore.  
   - Executa via Axios ou fetch no Renderer ou no Main (dependendo do design) e gera log.

---

## 4. Estrutura de Pastas (Exemplo com Electron Forge)

```txt
my-api-tester/
├── forge.config.js           # Configurações do Electron Forge
├── package.json
├── tsconfig.json
├── webpack.main.config.js    # Compila main.ts
├── webpack.renderer.config.js # Compila renderer.tsx
├── src/
│   ├── main.ts               # Processo principal do Electron
│   ├── preload.ts            # (opcional) se usar contextBridge
│   ├── renderer.tsx          # Ponto de entrada do React
│   ├── index.html            # HTML usado pelo renderer
│   ├── App.tsx               # Componente principal React
│   ├── components/
│   │   ├── auth/
│   │   │   └── Auth.tsx
│   │   ├── container/
│   │   │   ├── Container.tsx
│   │   │   ├── ContainerSettings.tsx
│   │   │   ├── ContainerLog.tsx
│   │   │   └── components/
│   │   │       ├── ButtonComponent.tsx
│   │   │       ├── ListComponent.tsx
│   │   │       └── ComboSelectComponent.tsx
│   │   ├── globalStore/
│   │   │   └── GlobalStoreProvider.tsx
│   │   ├── globalLog/
│   │   │   └── GlobalLog.tsx
│   │   └── settings/
│   │       └── AppSettings.tsx
│   ├── services/
│   │   └── api.ts            # Axios/fetch config, interceptors
│   └── styles/
│       └── ...
└── ...
```

*(Essa estrutura é flexível; você pode reorganizar conforme necessidade.)*

---

## 5. Tecnologias

1. **Electron Forge**  
   - Facilita scripts de dev (`npm start`) e geração de instaladores multiplataforma (`npm run make`).

2. **React + TypeScript**  
   - UI declarativa, tipagem forte, escalabilidade.

3. **Axios ou fetch**  
   - Realizar requisições HTTP.  
   - Possível usar interceptors para incluir token automaticamente.

4. **Electron Store**  
   - Persistência simples de dados chave-valor (tokens, configs).

5. **OpenAPI** (Swagger JSON)  
   - Importar especificações e mapear endpoints.

---

## 6. Resumo do Fluxo do Usuário

1. **Login (Auth)**: Usuário insere credenciais, recebe token OAuth2.  
2. **Configuração de Containers**: Cada container refere-se a um microserviço, podendo importar OpenAPI, criar botões (endpoints favoritos), listas e seletores.  
3. **Seleção de Valores**: Quando um usuário escolhe um item num container, seu ID (ou atributos) viram variáveis globais para outros containers.  
4. **Chamada de Endpoint**: Botão ou lista chama a API, logs são gerados.  
5. **Exportar/Importar**: Tanto containers quanto dashboards e projeto inteiro podem ser salvos em JSON.

---

## 7. Status e Próximos Passos

- **Configuração Inicial**: Sugere-se usar `electron-forge init --template=webpack-typescript` e então instalar React (`npm install react react-dom` + `@types/...`).  
- **Migrar Código Existente**: Copiar componentes Auth, GlobalStore, Containers, etc. para a pasta `src/` do projeto gerado.  
- **Teste de Execução**: Verificar se a janela do Electron abre e o React funciona sem erros de polyfill.

---

## 8. Como Exportar Este Resumo

1. **Copie e Cole** todo este texto (ou gere um PDF/Markdown) em seu sistema de documentação, wiki ou outro local de referência.  
2. **Compartilhe** o arquivo (ou a URL) com quem for trabalhar no projeto.  
3. Quando iniciar novos chats de desenvolvimento no ChatGPT, você pode “colar” este resumo (ou parte dele) como contexto inicial para que o assistente entenda os requisitos e a estrutura do seu projeto.
