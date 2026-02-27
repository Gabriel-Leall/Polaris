# 🧩 Widgets Customizáveis

> Permitir que o próprio usuário adicione, remova e reorganize os quadros (widgets) do dashboard.

## O Problema

Hoje os widgets estão escritos diretamente no código (hardcoded). O usuário não pode escolher quais quer ver nem onde eles ficam na tela.

## Como Funciona por Baixo dos Panos

### 1. Catálogo de Widgets

Em vez de renderizar componentes fixos no JSX, a tela lê uma **lista de configurações** (ex: um array no estado ou banco de dados). O código olha para essa lista e diz: "O usuário quer o widget de Clima na posição 1 e o de Tarefas na posição 2", e desenha isso na tela dinamicamente.

### 2. Gerenciamento de Estado (Onde salvar as preferências?)

- **Curto prazo (simples):** Salvar no `localStorage` do navegador. Se o usuário fechar a aba e voltar, o layout continua customizado.
- **Longo prazo (robusto):** Salvar no banco de dados (Supabase), vinculado à conta do usuário. Assim, se ele logar de outro dispositivo, o painel estará exatamente como ele deixou.

### 3. Drag and Drop (Arrastar e Soltar)

Permitir que o usuário clique em um quadro, arraste pela tela e solte em um novo lugar exige cálculo de coordenadas para saber onde o quadro vai "encaixar".

**Bibliotecas prontas para isso:**

- `react-grid-layout` — a mesma que painéis complexos de analytics usam.
- `dnd-kit` — moderna, leve e bem mantida.

### 4. Modo Edição

Criar uma forma de entrar no "Modo Edição" (talvez um botão de engrenagem). Quando ativado:

- Os quadros ganham botões de "X" para serem fechados.
- Aparece um menu lateral (ou modal) com os "Quadros Disponíveis" para o usuário arrastar para a tela.

## Níveis de Complexidade

| Nível | Descrição                                                                                                                                                   | Complexidade |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
| **1** | **Ocultar/Mostrar** — Menu com checkboxes/switches (ex: ☑ Mostrar Clima, ☐ Mostrar Tarefas). Usa `useState` ou Contexto. Layout fixo.                       |   🟢 Baixa   |
| **2** | **Mudar a Ordem** — O usuário escolhe a ordem dos componentes em uma lista. Eles ficam em grade fixa.                                                       |   🟡 Média   |
| **3** | **Drag, Drop e Resize** — Estilo "Notion" ou "Bento Box" dinâmico. O usuário posiciona onde quiser e pode esticar o quadro. Depende de `react-grid-layout`. |   🔴 Alta    |

## Estratégia Recomendada

Começar pelo **Nível 1** (ocultar/mostrar) e evoluir gradativamente até o **Nível 3** conforme a base de usuários crescer.
