# FocusTimer

> Aplicativo mobile de produtividade para estudos baseado na Técnica Pomodoro.

[![Expo](https://img.shields.io/badge/Expo-SDK%2058-000020?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB?logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Sobre o projeto

O **FocusTimer** é um aplicativo de organização e produtividade para estudos que aplica a **Técnica Pomodoro** para auxiliar na manutenção do foco em sessões de estudo cronometradas, com intervalos programados.

O projeto foi desenvolvido como trabalho final da disciplina de **Desenvolvimento Mobile com React Native**, aplicando na prática conceitos de navegação, hooks, componentização, ciclo de vida, notificações, requisições a Web Services e persistência de dados.

A proposta vai além de um cronômetro: o app permite ao usuário **vincular sessões de foco a tarefas específicas**, **organizar o conteúdo em coleções de flashcards** com sessões de revisão configuráveis, e **acompanhar a constância de estudo** por meio de um calendário mensal com heatmap de intensidade.

Três pilares orientam a arquitetura:

| Pilar | Funcionalidade |
|---|---|
| **Foco** | Timer Pomodoro com ciclos configuráveis, alarme sonoro, notificações e vínculo com tarefas |
| **Retenção** | Flashcards em SQLite com revisão configurável e repetição automática de erros |
| **Constância** | Agenda com calendário mensal, heatmap de estudo e resumo de produtividade |

---

## Tecnologias

| Categoria | Tecnologia |
|---|---|
| Framework | React Native 0.88 |
| Plataforma | Expo SDK 58 (Nova Arquitetura · Hermes) |
| Linguagem | TypeScript 6.0 (`strict: true`) |
| Navegação | React Navigation (Bottom Tabs com tab bar customizada) |
| Persistência | `expo-sqlite` (cards) · AsyncStorage (tarefas e config) |
| Notificações | `expo-notifications` |
| Áudio e feedback | `expo-audio` · `expo-haptics` |
| Gráficos vetoriais | `react-native-svg` |
| Ícones | `@expo/vector-icons` (Ionicons) |
| Build | EAS Build (configurado, não publicado) |
| Versionamento | Git + GitHub (Git Flow) |

---

## Status do desenvolvimento

Tabela consolidada das funcionalidades, refletindo o **estado atual do código**. Itens marcados como *Pendente* não foram implementados nesta entrega e estão listados como próximos passos.

| Área | Funcionalidade | Descrição | Prioridade | Status |
|---|---|---|---|---|
| **Infra** | Configuração base | Projeto Expo SDK 58 com template TypeScript, React Navigation e dependências nativas | Alta | ✅ Concluído |
| **Infra** | Git Flow | Estrutura de branches `main`, `develop` e `feature/*` | Alta | ✅ Concluído |
| **Infra** | Deploy via EAS | Configuração presente em `eas.json`; publicação em loja não realizada | Baixa | ✅ Configurado |
| **Navegação** | Navegação por abas | `TabNavigator` com 3 abas (Cards, Timer, Agenda) e `initialRouteName` no Timer | Alta | ✅ Concluído |
| **Navegação** | Tab bar customizada | `CustomTabBar` com `TAB_CONFIG`, `useSafeAreaInsets` e `Platform.select` (elevation/shadow) | Média | ✅ Concluído |
| **Timer** | Tela Timer | Cronômetro com 3 modos, progresso circular SVG e layout responsivo | Alta | ✅ Concluído |
| **Timer** | Controles do timer | Botões Iniciar, Pausar e Reiniciar com feedback háptico | Alta | ✅ Concluído |
| **Timer** | Rotinas personalizadas | Configuração de foco, pausa curta, pausa longa e número de ciclos | Alta | ✅ Concluído |
| **Timer** | Persistência da rotina | Configuração salva via AsyncStorage (`timerConfig.ts`) | Alta | ✅ Concluído |
| **Timer** | Notificação de ciclo | Agendamento de notificação local ao iniciar foco; cancelamento ao pausar | Alta | ✅ Concluído |
| **Timer** | Pausa em background | `AppState` pausa o timer e cancela notificação ao ir para background | Média | ✅ Concluído |
| **Timer** | Vínculo Pomodoro-tarefa | Seleção de tarefa que incrementa `completedPomodoros` e `tempoEstudadoMinutos` ao fim do foco | Média | ✅ Concluído |
| **Timer** | Layout responsivo | Círculo e fonte adaptam-se com `useWindowDimensions` | Alta | ✅ Concluído |
| **Tarefas** | CRUD de tarefas | Criar, listar, editar e excluir via AsyncStorage | Alta | ✅ Concluído |
| **Tarefas** | Metadados de tarefa | Prioridade, matéria, estimativa e pomodoros concluídos | Alta | ✅ Concluído |
| **Tarefas** | Modal de tarefa | Criação/edição com dupla confirmação de exclusão | Alta | ✅ Concluído |
| **Cards** | CRUD de coleções | SQLite com foreign key `ON DELETE CASCADE` | Alta | ✅ Concluído |
| **Cards** | CRUD de flashcards | Pergunta, resposta e dificuldade (fácil/médio/difícil) | Alta | ✅ Concluído |
| **Cards** | Sessão de revisão | Ordem sequencial/aleatória, nível por dificuldade e repetição de erros | Alta | ✅ Concluído |
| **Cards** | Resumo de sessão | Total, concluídos, pendentes, acertos de primeira e tentativas | Alta | ✅ Concluído |
| **Agenda** | Calendário mensal | Navegação entre meses, "Voltar para hoje" e destaque de hoje/selecionado | Média | ✅ Concluído |
| **Agenda** | Heatmap de estudo | 5 níveis de intensidade baseados em pomodoros completados por dia | Média | ✅ Concluído |
| **Agenda** | Resumo mensal | Tempo estudado, dias ativos e tarefas concluídas no mês | Média | ✅ Concluído |
| **Sistema** | Web Service (GET) | Frases motivacionais via API com timeout de 5s e fallback local | Alta | ✅ Concluído |
| **Sistema** | Ciclo de vida de tela | `useFocusEffect` recarrega tarefas ao focar a aba | Média | ✅ Concluído |
| **Sistema** | Suporte web (opcional) | SQLite via OPFS com COOP/COEP configurados em `metro.config.js` | Baixa | ✅ Concluído |

---

## Funcionalidades em detalhe

### Timer Pomodoro

Três modos alternáveis por toque (**Foco**, **Pausa Curta**, **Pausa Longa**) com duração configurável via modal. Ao iniciar o foco, o app agenda uma notificação local; ao terminar, dispara alarme sonoro (`expo-audio`), vibração (`Vibration`) e feedback háptico (`expo-haptics`), e abre um modal com frase motivacional obtida de uma API externa.

O ciclo segue a lógica clássica: após `N` ciclos de foco (padrão 4), o app entra em pausa longa automaticamente. O timer é pausado quando o app vai para background (`AppState`), e a notificação agendada é cancelada.

### Vínculo Pomodoro-tarefa

Antes de iniciar o foco, o usuário pode selecionar uma tarefa pendente (de qualquer data) em um *bottom sheet*. Ao fim de cada sessão de foco, o app incrementa automaticamente:

- `completedPomodoros` da tarefa vinculada
- `tempoEstudadoMinutos` (em minutos do ciclo de foco)

Essa integração é o que alimenta o heatmap da agenda.

### Flashcards com repetição de erros

Coleções e flashcards são persistidos em SQLite com `ON DELETE CASCADE` (excluir coleção remove todos os seus cards). A sessão de revisão é configurável:

- **Ordem**: sequencial (por criação) ou aleatória (Fisher-Yates)
- **Nível**: todos, fácil, médio ou difícil

Cards errados voltam ao fim da fila e são contabilizados separadamente — não contam como "acerto de primeira" mesmo que o usuário acerte na segunda passada. Ao final, um resumo exibe métricas de desempenho e a lista dos cards que tiveram erro.

### Agenda com heatmap

Calendário mensal navegável, com 5 níveis de intensidade por dia baseados no total de pomodoros completados. Cada dia mostra:

- Cor proporcional ao volume de estudo (branco → verde-escuro)
- Ponto âmbar quando há tarefa pendente
- Borda dupla diferenciando "hoje" (verde) de "selecionado" (âmbar)

Abaixo do calendário, três cards resumem o mês (tempo estudado, dias ativos, tarefas concluídas/total), seguidos da lista de tarefas do dia selecionado (pendentes primeiro).

### Web Service

`services/frasesMotivacionais.ts` consome `GET https://rodrigoborges.dev/api/frases/random` com:

- `AbortController` para timeout de 5 segundos
- `try/catch` com fallback para 10 frases locais em caso de falha (rede, HTTP não-2xx ou formato inesperado)
- `finally` para limpar o timer

A UX nunca quebra: se a API estiver fora, o usuário recebe uma frase do fallback sem ver erro.

---

## Arquitetura

O projeto adota uma arquitetura em camadas com dependências unidirecionais:

```
UI (routes/ + components/)
        │
        ▼
Lógica de domínio (utils/)
        │
        ▼
Persistência (database/ + storage/)
        │
        ▼
Serviços externos (services/)
```

**Princípios aplicados:**

- **A UI não conhece a origem dos dados.** `cardsRepository.ts` esconde SQL; `tasks.ts` esconde AsyncStorage. Nenhum componente importa `expo-sqlite` ou `AsyncStorage` diretamente.
- **`utils/` é puro.** `revisao.ts` implementa uma máquina de estados sem dependência de React, testável sem render. `tempo.ts` e `validacao.ts` também são funções puras.
- **Defesa em profundidade.** Validação no JS (`validarId`, `validarCard`) **e** no SQL (`WHERE id = ? AND colecao_id = ?`).
- **Retorno booleano nas mutações.** Toda operação de escrita retorna `changes > 0`, permitindo que a UI trate o caso "registro não existe mais" sem `try/catch` genérico.

**Padrões defensivos recorrentes:**

| Padrão | Onde | Objetivo |
|---|---|---|
| `montada.current` (useRef) | `CardsScreen`, `ColecaoCards` | Evita `setState` após unmount |
| `envioEmAndamento.current` | `CardForm`, `ColecaoForm` | Guard síncrono contra duplo-toque |
| Contador `atualizacao` | `CardsScreen`, `ColecaoCards` | Refetch determinístico — uma fonte de verdade |
| Type guard `isTask` | `storage/tasks.ts` | Valida `JSON.parse` (AsyncStorage) campo a campo |
| `PRAGMA foreign_keys = ON` | `database/connection.ts` | Ativa `ON DELETE CASCADE` (SQLite ignora sem isso) |
| Conexão singleton com retry | `database/connection.ts` | Falha transitória não bloqueia chamadas futuras |

---

## Estrutura do projeto

```
focusTimer/
├── App.tsx                        # Raiz: SafeAreaProvider + NavigationContainer + TabNavigator
├── index.ts                       # Ponto de entrada do Expo (registerRootComponent)
├── app.json                       # Metadados e configuração do Expo
├── eas.json                       # Perfis de build EAS
├── metro.config.js                # Config do Metro + COOP/COEP para SQLite na web
├── package.json                   # Dependências e scripts
├── tsconfig.json                  # Config do TypeScript (strict)
├── AGENTS.md                      # Diretrizes para agentes de código
├── LICENSE                        # MIT
├── README.md                      # Este arquivo
├── assets/
│   ├── icon.png                   # Ícone do aplicativo
│   ├── splash-icon.png            # Imagem da splash screen
│   ├── favicon.png                # Ícone para web
│   ├── android-icon-background.png
│   ├── android-icon-foreground.png
│   └── android-icon-monochrome.png
└── src/
    ├── components/
    │   ├── CustomTabBar.tsx       # Tab bar customizada (filtra por TAB_CONFIG)
    │   ├── Header.tsx             # Cabeçalho comum com back opcional
    │   ├── ModalFimSessao.tsx     # Modal de fim de sessão com frase motivacional
    │   └── cards/
    │       ├── CardForm.tsx       # Formulário de criação/edição de flashcard
    │       ├── CardItem.tsx       # Item da lista de flashcards
    │       ├── ColecaoCards.tsx   # Orquestrador do fluxo de coleção
    │       ├── ColecaoForm.tsx    # Formulário de criação/edição de coleção
    │       ├── ColecaoItem.tsx    # Item da lista de coleções
    │       ├── Revisao.tsx        # Orquestrador do fluxo de revisão
    │       ├── RevisaoConfig.tsx  # Configuração da sessão
    │       ├── RevisaoResumo.tsx  # Resumo pós-sessão
    │       ├── RevisaoSessao.tsx  # Sessão ativa (pergunta/resposta)
    │       ├── formStyles.ts      # Estilos compartilhados dos formulários
    │       └── revisaoStyles.ts   # Estilos compartilhados da revisão
    ├── database/
    │   ├── cardsRepository.ts     # CRUD de coleções e cards (SQLite)
    │   └── connection.ts          # Conexão singleton com schema e retry
    ├── navigation/
    │   └── TabNavigator.tsx       # Bottom tabs (3 abas)
    ├── routes/
    │   ├── agenda/
    │   │   ├── AgendaScreen.tsx   # Calendário mensal + heatmap + resumo
    │   │   └── TarefaModal.tsx    # Modal de criação/edição de tarefa
    │   ├── cards/
    │   │   └── CardsScreen.tsx    # Lista de coleções
    │   └── timer/
    │       └── TimerScreen.tsx    # Tela principal — Pomodoro funcional
    ├── services/
    │   ├── alarme.ts              # Som + vibração + háptico no fim do ciclo
    │   ├── frasesMotivacionais.ts # GET com timeout e fallback local
    │   └── notificacoes.ts        # Agendamento de notificações locais
    ├── storage/
    │   ├── tasks.ts               # CRUD de tarefas (AsyncStorage + type guard)
    │   └── timerConfig.ts         # Configuração do timer (AsyncStorage)
    ├── theme/
    │   └── colors.ts              # Paleta centralizada (emerald + amber)
    ├── types/
    │   ├── cards.ts               # Tipagens de coleção/card/dificuldade
    │   └── index.ts               # Tipagem de Task
    └── utils/
        ├── alertas.ts             # Wrappers cross-platform de Alert
        ├── revisao.ts             # Máquina de estados pura da revisão
        ├── tempo.ts               # Formatação e conversão de tempo
        └── validacao.ts           # Validação de coleção, card e id
```

---

## Como executar

### Pré-requisitos

- Node.js 18+ ([download](https://nodejs.org/))
- npm ou yarn
- Expo Go instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) · [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Celular e computador na **mesma rede Wi-Fi**

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/filipesilva-dev/FocusTimer
cd FocusTimer

# 2. Instalar dependências
npm install

# 3. Iniciar o servidor de desenvolvimento
npx expo start
```

### Scripts disponíveis

| Script | Comando | Uso |
|---|---|---|
| `npm start` | `expo start` | Servidor de desenvolvimento (QR code) |
| `npm run android` | `expo run:android` | Build nativo no emulador Android |
| `npm run ios` | `expo run:ios` | Build nativo no simulador iOS (macOS) |
| `npm run web` | `expo start --web` | Execução no navegador |

### Executar em cada plataforma

| Plataforma | Como abrir |
|---|---|
| Android (físico) | Escanear QR code com Expo Go |
| iOS (físico) | Escanear QR code com a câmera nativa |
| Emulador Android | Pressionar `a` no terminal |
| Simulador iOS (macOS) | Pressionar `i` no terminal |
| Navegador (web) | Pressionar `w` no terminal |

> **Nota sobre a web:** o `expo-sqlite` na web usa OPFS (Origin Private File System), que requer `SharedArrayBuffer` e, portanto, *cross-origin isolation*. Os headers `Cross-Origin-Opener-Policy` e `Cross-Origin-Embedder-Policy` já estão configurados em `metro.config.js`, e `connection.ts` valida `isSecureContext` antes de abrir o banco.

---

## Boas práticas adotadas

- **TypeScript strict** em todo o código — sem `any` implícito
- **Componentização** com separação entre telas (`routes/`) e componentes reutilizáveis (`components/`)
- **Lógica pura em `utils/`** — máquina de estados da revisão testável sem React
- **Hooks** para estado, efeitos colaterais e ciclo de vida de tela (`useFocusEffect`)
- **Cleanup de efeitos** no `useEffect` (evita *memory leaks* e *setState* após unmount)
- **Type guards** para dados vindos de fontes externas (AsyncStorage, `JSON.parse`)
- **Defesa em profundidade** na persistência (validação no JS + `WHERE` restritivo no SQL)
- **Acessibilidade** com `accessibilityRole`, `accessibilityLabel` e `accessibilityState` em botões, cabeçalhos e alerts
- **Layout responsivo** com `useWindowDimensions`
- **Commits pequenos e descritivos** (padrão Conventional Commits)

### Padrão de branches (Git Flow)

| Branch | Finalidade |
|---|---|
| `main` | Código em produção (versão estável) |
| `develop` | Integração contínua |
| `feature/*` | Desenvolvimento de funcionalidades |
| `release/*` | Preparação de versão |
| `hotfix/*` | Correções urgentes em produção |

---

## Débitos técnicos

Itens reconhecidos como melhorias pendentes, documentados para transparência:

1. **Timer resiliente em background** — o `setInterval` é recriado a cada segundo (`useEffect` depende de `timeLeft`). Funciona, mas seria mais robusto calcular o tempo restante por `Date.now()` para que o timer continue correto mesmo após longos períodos em background.
2. **Migração de tarefas para SQLite** — tarefas estão em AsyncStorage enquanto cards estão em SQLite. Unificar a persistência traria consistência e habilitaria queries relacionais (ex.: tarefas por matéria).
3. **Extração de `@FocusTimer/focoHoje`** — o contador de sessões do dia está manipulado inline em `TimerScreen.tsx`. Extrair para `storage/focoHoje.ts` alinharia com o padrão de `timerConfig.ts`.
4. **Som do alarme depende de URL remota** — `services/alarme.ts` usa uma URL pública do Google Actions. O ideal é incluir o arquivo `.ogg` localmente via `require()`. Hoje, se a rede cair, o fallback é vibração + háptico.
5. **`react-native-paper` e `expo-checkbox`** estão em `package.json` mas não são importados por nenhum arquivo — podem ser removidos para reduzir o bundle.

---

## Autores

Desenvolvido por:
 **Filipe Silva Fonseca**;
 **Caian Dieter**;
 **João Pedro Nunes Neto**;
 **André Luiz Borges Aguiar**;
como trabalho final da disciplina de Desenvolvimento Mobile com React Native.

---

## Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE) para mais informações.
