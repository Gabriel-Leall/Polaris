# 🎨 Polaris Design System Foundation

Este documento serve como a **Fonte de Verdade** (Single Source of Truth) para o Design System do Axis/Polaris. Todas as decisões de interface, cores, tipografia e comportamento devem ser documentadas aqui antes de irem para o código ou protótipos visuais.

---

## 🧭 Princípios Fundamentais (UX/UI)

Baseado nos nossos _learnings_ (`ui-ux-guidelines.md`):

1.  **Contexto Visual e Fuga do Rígido:** Elementos de apoio (doodles, ícones), equilíbrio de espaçamentos e direcionamento de olhar para o centro.
2.  **Movimento com Propósito:** Animações de entrada suaves (easing), parallax elegante, e microinterações de texto/hover para dar vida à interface.
3.  **Linguagem Natural:** Evitar jargões corporativos tediosos. A plataforma deve "falar" de humano para humano.
4.  **Atenção aos Detalhes Inesperados:** Telas de erro (404) lúdicas e interações secundárias recompensadoras.
5.  **Hierarquia Funcional:** "Design não é só decoração". Reduzir cliques desnecessários, limpar sidebars e colocar ações raras dentro de menus agrupados (pontinhos).

---

## 🎨 Paleta de Cores (Color Ramps & OKLCH)

_A ideia aqui é criar rampas (escala de 50 a 900) em vez de usar cores hardcoded. No modo escuro, elevamos as superfícies usando os tons mais iluminados._

### 🌑 Neutros (Fondos e Camadas)

- **Família Escolhida: Oslo Gray** (Escala OKLCH)
- `Background`: oslo-gray-900 `oklch(0.179 0.006 285.8)`
- `Card/Surface 1`: oslo-gray-800 `oklch(0.293 0.011 293.4)`
- `Card/Surface 2`: oslo-gray-700 `oklch(0.398 0.013 291.5)`
- `Border`: (Sutil, ex: 15% de opacidade sobre a cor Neutro)

### 🔵 Primária (A Marca)

- **Família Escolhida: Anakiwa** (Azul Claro Vibrante - Escala OKLCH)
- `Primary Base`: anakiwa-500 `oklch(0.621 0.105 218.6)`
- `Hover`: anakiwa-400 `oklch(0.713 0.121 218.4)`
- `Active`: anakiwa-600 `oklch(0.518 0.088 219.3)`

### 🔴 Semânticas (Alerts)

- **Success:** Verde (Escala 50 a 900)
- **Warning:** Amarelo/Laranja (Escala 50 a 900)
- **Destructive (Error):** Vermelho (Padrões universais)

---

## 📝 Tipografia & Leitura (Typography System)

A tipografia define 90% da experiência de um dashboard. Precisamos de distinção nítida entre dados (números) e leitura longa.

- **Typeface de Headers:** _Cascadia Mono_. Uma fonte monoespaçada desenhada para terminais e códigos, que dará um ar extremamente técnico, robusto e "hacker" aos títulos das seções e painéis (Widgets).
- **Typeface de Interface/Body:** _Manrope_. Uma fonte geométrica e incrivelmente legível (sans-serif) para textos densos, descrições e botões. O contraste entre a Manrope suave e a Cascadia Mono geométrica criará uma estética "Científica premium".
- **Escala Modular (Base 16px):**
  - `Header 1`: 2.25rem (36px) - _Cascadia Mono_ - Peso: Semibold (600) ou Bold (700)
  - `Header 2`: 1.5rem (24px) - _Cascadia Mono_ - Peso: Semibold (600)
  - `Header 3`: 1.25rem (20px) - _Cascadia Mono_ - Peso: Medium (500)
  - `Body`: 1rem (16px) - _Manrope_ - Peso: Regular (400) ou Medium (500)
  - `Subtext / Caption`: 0.875rem (14px) - _Manrope_ - Peso: Regular (400) - Uso: Metadados, tooltips, tags.
- **Line-height (Entrelinha):** `1.5` para textos de leitura (body), `1.2` para títulos (headers).

---

## 📏 Sistema Espacial e Layout (Spatial System)

O sistema de grade e espaçamento dita o ritmo da interface. O Axis usará o padrão da indústria: a **Grade de 8pt (8pt Grid System)**.

- **Base de Espaçamento:** Todos os paddings e margins devem ser múltiplos de `4px` ou `8px` (ex: 4, 8, 12, 16, 24, 32, 48, 64).
  - _No Tailwind:_ `p-1`, `p-2`, `p-3`, `p-4`, `p-6`, `p-8`, `p-12`.
- **Raio de Borda (Border Radius):**
  - `Small (4px)`: Checkboxes, tags internas.
  - `Medium (8px)`: Inputs, dropdowns, botões pequenos. _[Recomendação Padrão Mínima]_
  - `Large (12px / 16px)`: Cards principais (Widgets), Modais.
  - `Full (9999px)`: Avatares, botões de ícone circulares (CTA flutuantes).
- **Elevação e Sombras (Shadows/Elevation):**
  - No _Light Mode_: Sombras suaves (`0 4px 12px rgba(0,0,0, 0.05)`) para destacar cards.
  - No _Dark Mode_: **Sem sombras projetadas densas**. A elevação é feita clareando a cor do "Surface" (Background -> Surface 1 -> Surface 2) e usando uma borda de luz (`inset 0 1px 0 rgba(255,255,255,0.1)`).

---

## 💡 Estados de Interação (Interaction States)

Componentes não são estáticos. Toda ação deve ter uma reação clara, baseada nas rampas de cores.

1. **Default (Repouso):** A aparência base (ex: Bg 500).
2. **Hover (Foco do Mouse):** Deve ser levemente mais brilhante ou mais escuro dependico do tema (ex: Bg 600). O cursor muda para `pointer`. Adicione uma transição sutil (ex: `transition-all duration-200`).
3. **Active (Clique/Pressão):** "Aperta" o componente. Pode reduzir levemente o tamanho (`scale: 0.98`) e escurecer a cor (ex: Bg 700).
4. **Disabled (Inativo):** Reduz opacidade para `50%` e muda o cursor para `not-allowed`. Cores de fundo geralmente caem para a escala de Cinzas/Neutros (`300`).
5. **Focus-Visible (Navegação por Teclado):** CRÍTICO para acessibilidade. Quando o usuário navega pelo `Tab`, deve haver um anel (Focus Ring) ao redor do elemento. Padrão: 2px sólido na cor Primária, com 2px de offset (espaço) da borda do botão.

---

## 🧩 Biblioteca de Componentes Base (UI Inventory)

_Lista do que precisamos construir (ou padronizar) no código e no protótipo visual (Stitch/Figma/Pencil):_

### 1. Elementos de Ação

- **Buttons:**
  - `Primary`: Fundo sólido na cor primária (Chamadas para ação principais).
  - `Secondary`: Fundo sólido na cor neutra clara (Ações alternativas).
  - `Outline`: Sem fundo, borda na cor principal (Ações de média importância).
  - `Ghost`: Sem fundo, sem borda, ganha fundo sutil apenas no `hover` (Ações discretas, como ícones de menu).

### 2. Formulários e Inputs

- **Text Fields:** Label sempre visível (acima do input). Borda sutil no estado default, borda colorida (Primary) no foco.
- **Selects / Dropdowns:** Design alinhado aos Text Fields.
- **Toggles (Switches):** Preferíveis a Checkboxes para configurações (Settings) de ligar/desligar funcionalidades.
- **Checkboxes & Radios.**

### 3. Feedback e Alertas

- **Toasts / Snackbars:** Notificações flutuantes temporárias no canto da tela. Cores Semânticas (Verde, Vermelho, Amarelo).
- **Empty States:** O que o usuário vê quando o "BrainDump" está vazio? Use ilustrações/doodles amigáveis e um botão claro de "Criar a primeira nota". Não deixe a tela em branco.
- **Skeleton Loaders:** O esqueleto que pisca enquanto o dado carrega, replicando a forma exata do componente final. Evita spinners (bolinhas girando) que dão sensação de lentidão.

### 4. Estruturais

- **Widgets System (Cards):** O contêiner base. Header padronizado (Ícone + Título + Ações nos 3 pontinhos). Scroll interno. Borda sutil.
- **Activity Sidebar.**
- **Modals / Dialogs:** Com fundo desfocado (`backdrop-blur`).

---

## 🚀 O Próximo Nível (Ação e Validação)

1. **Decisão:** Escolher a Cor Primária (Hex), Cor Neutra base e a Fonte Sans-Serif.
2. **Design Visual (Pencil/Stitch):** Gerar o protótipo `.pen` visual com a rampa de cores exata, botões e exemplos de tipografia como ditado neste documento.
3. **Refatoração (Código):** Passar essas definições para o `tailwind.config.ts` e `globals.css`, removendo valores "hardcoded" de arquivos como `button.tsx` e `BentoGrid.tsx`.
