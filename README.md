# FocusTimer

> Aplicativo mobile de produtividade para estudos baseado na Técnica Pomodoro.

[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB?logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## Sobre o projeto

O **FocusTimer** é um aplicativo de organização e produtividade para estudos que aplica a **Técnica Pomodoro** para auxiliar na manutenção do foco em sessões de estudo cronometradas, com intervalos programados.

O projeto está sendo desenvolvido como trabalho final da disciplina de **Desenvolvimento Mobile com React Native**, com o objetivo de aplicar na prática os conceitos vistos em sala: navegação, hooks, componentização, ciclo de vida, notificações, requisições a Web Services e persistência de dados.

A proposta vai além de um cronômetro simples: o app permitirá que o usuário organize tarefas, crie coleções de flashcards, acompanhe o progresso semanal e receba notificações para manter a constância nos estudos.

---

## Tecnologias

| Categoria | Tecnologia |
|---|---|
| Framework | React Native |
| Plataforma | Expo SDK |
| Linguagem | TypeScript |
| Navegação | React Navigation (Bottom Tabs) |
| Ícones | @expo/vector-icons (Ionicons) |
| Versionamento | Git + GitHub (Git Flow) |

---

## Status do desenvolvimento

Tabela consolidada de todas as funcionalidades do projeto, ordenada por prioridade. Itens pendentes terão data e responsável preenchidos conforme forem sendo executados.

| Área | Funcionalidade | Descrição | Prioridade | Status | Data | Responsável |
|---|---|---|---|---|---|---|
| **Infra** | Configuração base | Criação do projeto Expo com template TypeScript e instalação das dependências de navegação | Alta |  Concluído | 09/11/2026 | Filipe |
| **Infra** | Configuração de Git Flow | Estrutura de branches `main`, `develop` e `feature/*` | Alta |  Pendente | — | — |
| **Navegação** | Navegação por abas | `TabNavigator` com 5 abas, ícones do Ionicons e `initialRouteName` apontando para o Timer | Alta |  Concluído | 09/11/2026 | Filipe |
| **Navegação** | Telas placeholder | Estrutura inicial de Tarefas, Cards, Agenda e Gráficos para navegação | Alta |  Concluído | 09/11/2026 | Filipe |
| **Timer** | Tela Timer | Cronômetro Pomodoro com estados de foco/pausa e lógica de contagem regressiva | Alta |  Concluído | 09/11/2026 | Filipe |
| **Timer** | Controles do timer | Botões Iniciar, Pausar e Reiniciar com feedback visual de estado | Alta |  Concluído | 09/11/2026 | Filipe |
| **Timer** | Rotinas personalizadas | Criação de rotinas com foco, pausa curta, pausa longa e ciclos configuráveis | Alta |  Pendente | — | — |
| **Timer** | Persistência da rotina | Salvar a rotina selecionada via AsyncStorage | Alta |  Pendente | — | — |
| **Timer** | Notificação de ciclo | Notificar o usuário ao fim de cada ciclo | Alta |  Pendente | — | — |
| **Tarefas** | CRUD de tarefas | Criar, listar, editar e excluir tarefas com SQLite | Alta |  Pendente | — | — |
| **Tarefas** | Metadados de tarefa | Prioridade, matéria e estimativa de pomodoros | Alta |  Pendente | — | — |
| **Tarefas** | Modal de tarefa | Modal de criação e edição de tarefa | Alta |  Pendente | — | — |
| **Cards** | CRUD de cards | Coleções e flashcards com pergunta, resposta e dificuldade | Alta |  Pendente | — | — |
| **Cards** | Sessão de revisão | Ordem aleatória/sequencial, nível da sessão e repetição de erros | Alta |  Pendente | — | — |
| **Gráficos** | Gráfico de barras | Tempo estudado por dia da semana | Alta |  Pendente | — | — |
| **Sistema** | Web Service | Requisições GET/POST/PUT/DELETE a uma API | Alta |  Pendente | — | — |
| **Layout** | Layout responsivo | Círculo e fonte do timer adaptam-se a diferentes tamanhos com `useWindowDimensions` | Alta |  Concluído | 09/11/2026 | Filipe |
| **Timer** | Pausa em background | Pausar o timer automaticamente ao ir para background (`AppState`) | Média |  Pendente | — | — |
| **Tarefas** | Vínculo Pomodoro-tarefa | Vincular uma sessão Pomodoro a uma tarefa específica | Média |  Pendente | — | — |
| **Agenda** | Calendário mensal | Visualização mensal com intensidade de estudo por dia | Média |  Pendente | — | — |
| **Gráficos** | Gráfico de linha | Evolução semanal de horas estudadas | Média |  Pendente | — | — |
| **Configurações** | Aparência e som | Tema claro/escuro, volume do alarme e escolha do som | Média |  Pendente | — | — |
| **Sistema** | Ciclo de vida de tela | Recarregar dados ao focar uma tela (`useFocusEffect`) | Média |  Pendente | — | — |
| **Layout** | Tab bar resiliente | Correção do corte de labels em telas pequenas e ajuste de altura/padding para Android e iOS | Média |  Concluído | 09/11/2026 | Filipe |
| **Tarefas** | Subtarefas | Subdivisões dentro de uma tarefa | Baixa |  Pendente | — | — |
| **Infra** | Deploy via Expo EAS | Geração de build de produção | Baixa |  Pendente | — | — |

## Estrutura do projeto

```
focusTimer/
├── App.tsx                        # Raiz: NavigationContainer + TabNavigator
├── app.json                       # Metadados e configuração do Expo
├── package.json                   # Dependências e scripts
├── tsconfig.json                  # Configuração do TypeScript
└── src/
    ├── navigation/
    │   └── TabNavigator.tsx       # Bottom tabs (5 abas)
    ├── screens/
    │   ├── TimerScreen.tsx        # Tela principal — Pomodoro funcional
    │   ├── TarefasScreen.tsx      # Placeholder
    │   ├── CardsScreen.tsx        # Placeholder
    │   ├── AgendaScreen.tsx       # Placeholder
    │   └── GraficosScreen.tsx     # Placeholder
    └── types/
        └── index.ts               # (a criar) Tipagens de domínio
```

### Diretórios planejados

| Pasta | Conteúdo previsto |
|---|---|
| `src/database/` | Configuração do SQLite e operações CRUD |
| `src/storage/` | Wrappers de AsyncStorage e SecureStore |
| `src/services/` | Requisições HTTP e notificações |
| `src/components/` | Componentes reutilizáveis (Botão, Input, Modal) |
| `src/context/` | Contexts globais (tema, configurações) |
| `src/hooks/` | Hooks customizados (useTimer, useTarefas) |

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
cd focusTimer

# 2. Instalar dependências
npm install

# 3. Iniciar o servidor de desenvolvimento
npx expo start
```

### Executar em cada plataforma

| Plataforma | Como abrir |
|---|---|
| Android (físico) | Escanear QR code com Expo Go |
| iOS (físico) | Escanear QR code com a câmera nativa |
| Emulador Android | Pressionar `a` no terminal |
| Simulador iOS (macOS) | Pressionar `i` no terminal |
| Navegador (web) | Pressionar `w` no terminal |

---

## Boas práticas adotadas

- **TypeScript** em todo o código
- **Componentização** desde o início (telas isoladas)
- **Hooks** para estado e efeitos colaterais
- **Layout responsivo** com `useWindowDimensions`
- **Cleanup de efeitos** no `useEffect` (evita memory leaks)
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

## Equipe

| Integrante | Matrícula | Principais contribuições |
|---|---|---|
| _Nome completo_ | _Matrícula_ | _A preencher_ |
| _Nome completo_ | _Matrícula_ | _A preencher_ |
| _Nome completo_ | _Matrícula_ | _A preencher_ |
| _Nome completo_ | _Matrícula_ | _A preencher_ |
