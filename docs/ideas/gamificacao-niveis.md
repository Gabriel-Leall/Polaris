# 🎮 Gamificação: Sistema de Níveis e Progresso

> Criar um sistema de XP, níveis e desbloqueios para manter o usuário engajado e retornando ao Axis todos os dias.

## O Problema

Sem um senso de progresso, o usuário não tem incentivo para voltar ao site. Precisa-se de um "Loop de Hábito" (Ação → Recompensa → Progresso).

## Como Funciona por Baixo dos Panos

### 1. A "Moeda" do Jogo (XP)

No banco de dados (Supabase), na tabela de `usuarios`, adicionar colunas como:

- `experiencia_total` (integer)
- `nivel_atual` (integer)
- `ofensiva_dias` (integer) — streaks de uso consecutivo

### 2. As Ações que Geram XP

Mapear as ações produtivas do usuário:

| Ação                                          |  XP Ganho  |
| --------------------------------------------- | :--------: |
| Completou uma tarefa                          |   +10 XP   |
| Usou o Pomodoro por 25 minutos                |   +25 XP   |
| Criou uma nota                                |   +5 XP    |
| Entrou no Axis por dias consecutivos (streak) | +15 XP/dia |
| Conectou um serviço externo (GitHub, etc.)    |   +50 XP   |

### 3. A Matemática dos Níveis

Um nível é apenas um cálculo de XP. Exemplo clássico em RPGs:

| Nível | XP Necessário |
| :---: | :-----------: |
|   1   |       0       |
|   2   |      100      |
|   3   |      250      |
|   4   |      500      |
|   5   |     1.000     |
|  10   |     5.000     |

O frontend olha pro número de XP no banco e diz: "Ele é Nível 3, falta 20% pro Nível 4" e desenha uma barra de progresso.

### 4. A Recompensa Real: Desbloqueios

Níveis por si só perdem a graça rápido. A sacada é **atrelar os níveis a desbloqueios**:

| Nível | Desbloqueio                              |
| :---: | ---------------------------------------- |
|   3   | Badge "Explorador" no perfil             |
|   5   | Tema escuro especial ("Midnight Hacker") |
|   7   | Widget exclusivo desbloqueado            |
|  10   | Título "Mestre da Produtividade"         |
|  15   | Acesso antecipado a funcionalidades Beta |

Isso cria um **objetivo real** para o usuário voltar amanhã e usar a plataforma.

## Complexidade: 🟡 Média

- A lógica de XP e níveis é pura matemática no banco de dados.
- O frontend precisa de componentes visuais (barra de progresso, badges, animações de level-up).
- O mais trabalhoso é definir o balanceamento (quanto XP cada ação dá) para que o sistema não seja muito fácil nem muito difícil.
