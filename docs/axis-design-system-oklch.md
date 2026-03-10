# Axis Design System - Styleguide

Este documento reflete a extração do novo Design System do Axis, com as cores baseadas nas telas fornecidas via Stitch, e adaptado para o sistema de cores **OKLCH** exigido pelo Tailwind v4 e pelas melhores práticas do projeto.

## Tokens de Cores Extraídos

### Tema Claro (Light Theme)

- **Background**: `#FAF9F6` → `oklch(0.98 0.005 60)`
- **Surface**: `#F5F5F5` → `oklch(0.97 0 0)`
- **Secondary**: `#E0E0E0` → `oklch(0.90 0 0)`
- **Primary**: `#E65100` (Laranja) → `oklch(0.60 0.18 45)` // Valor base
- **Text Primary**: `#121212` → `oklch(0.20 0 0)`
- **Text Secondary**: `#555555` → `oklch(0.45 0 0)`

**Estados de Botão (Primary Light):**

- Normal: `#E65100`
- Hover: `#CC4800`
- Pressed: `#B33F00`

### Tema Escuro (Dark Theme)

- **Background**: `#121212` → `oklch(0.18 0 0)`
- **Surface**: `#1E1E1E` → `oklch(0.23 0 0)`
- **Secondary**: `#2C2C2C` → `oklch(0.30 0 0)`
- **Primary**: `#FFBF00` (Âmbar/Bege) → `oklch(0.85 0.16 85)` // Valor base
- **Text Primary**: `#FFFFFF` → `oklch(0.99 0 0)`
- **Text Secondary**: `#A1A1AA` → `oklch(0.70 0 0)`

**Estados de Botão (Primary Dark):**

- Normal: `#FFBF00`
- Hover: `#E6AC00`
- Pressed: `#CC9900`

## Componentes

### Inputs & Controls

- **Search Input (Light)**: Fundo branco, Borda cinza do secondary (`#E0E0E0`), Ícones cinza secundário, Focus state com anel de foco `primary-light`.
- **Search Input (Dark)**: Fundo `surface-dark` (`#1E1E1E`), Borda `secondary-dark` (`#2C2C2C`), Focus state com anel `primary`.
- **Action Chips**:
  - Inativo: Fundo da cor do Surface respectivo, Borda Secondary respectiva.
  - Ativo: Fundo `primary` opacidade 10-15%, borde primary, texto da cor primary, e ícone indicando status.

### Cards

- **Content Card**:
  - Layout padrão.
  - Sombra Light: Sombra grisácea sutil suave (`Soft grey shadow`). Fundo branco.
  - Sombra Dark: Sombra de brilho ambar/primary (`Glowing amber shadow - shadow-[0_4px_20px_rgba(255,191,0,0.05)]`). Fundo `surface-dark`.
- **Interactive Dashboard Card**:
  - Detalhe de borda ativa: Uma borda superior `border-top` sólida com cor primary.
  - Borda geral primary.
  - Tem status indicativo flexível (ex: Active com cor verde).

---

## Implementação OKLCH Sugerida (Tailwind)

Para uma implementação fluída no nosso tailwind usando as paletas (baseado nas constantes recém levantadas):

```css
:root {
  /* LIGHT MODE VARIABLES */
  --background: 0.99 0 0;
  --surface: 0.97 0 0;
  --secondary: 0.9 0 0;

  --primary: 0.6 0.18 45; /* #E65100 Equivalent */
  --primary-hover: 0.55 0.17 45; /* #CC4800 Eq */
  --primary-pressed: 0.5 0.16 45; /* #B33F00 Eq */

  --text-primary: 0.2 0 0;
  --text-secondary: 0.45 0 0;
  --border: 0.9 0 0;
}

.dark {
  /* DARK MODE VARIABLES */
  --background: 0.18 0 0;
  --surface: 0.23 0 0;
  --secondary: 0.3 0 0;

  --primary: 0.85 0.16 85; /* #FFBF00 Equivalent */
  --primary-hover: 0.8 0.15 85; /* #E6AC00 */
  --primary-pressed: 0.75 0.14 85; /* #CC9900 */

  --text-primary: 0.99 0 0;
  --text-secondary: 0.7 0 0;
  --border: 0.3 0 0;
}
```
