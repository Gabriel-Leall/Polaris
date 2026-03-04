# 💜 Epic — Void Amethyst

> **Família de cor:** Void Amethyst (Roxo Dimensional)
> **Gradiente:** `--void-400` → `--void-600` | OKLCH hue ~286-300
> **Dificuldade:** Alta — Meses de dedicação constante
> **Micro-interação:** Alta — Partículas, trails, shimmer, multi-stage
> **Keyframes novos:** `void-particles`, `shimmer-sweep`, `border-rotate`
> **% Jogadores:** ~8%

---

## Padrão Visual

```
Card: border-void-500/30 bg-gradient-to-b from-void-500/8 to-transparent
Hover: hover:border-void-500/50 hover:shadow-[0_0_25px_oklch(0.570_0.125_288.0/0.35)]
Badge: bg-void-500/10 text-void-400 border-void-500/20
Ícone: rounded-full (circular!), gradiente void, ring 2px void-500/50 com pulse
```

A partir do Epic, o ícone muda de `rounded-xl` para **`rounded-full`** (circular), marcando visualmente a transição para tiers de elite. O shimmer no título do card também aparece no hover.

---

## Novos Keyframes

```css
/* Partículas subindo — pseudo-elements ::before e ::after */
@keyframes void-particles {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-25px) scale(0.3);
    opacity: 0;
  }
}
.animate-void-particles {
  position: relative;
}
.animate-void-particles::before,
.animate-void-particles::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: oklch(0.660 0.140 290.0);
  bottom: 0;
  left: 30%;
  animation: void-particles 2s ease-out infinite;
  pointer-events: none;
}
.animate-void-particles::after {
  left: 60%;
  animation-delay: 0.7s;
}

/* Shimmer — brilho varrendo horizontalmente */
@keyframes shimmer-sweep {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}
/* Aplicar via span posicionado absolute dentro do card */

/* Borda gradiente rotacionando — conic gradient */
@keyframes border-rotate {
  0% {
    --border-angle: 0deg;
  }
  100% {
    --border-angle: 360deg;
  }
}
```

---

## 1. Neural Architect

| Propriedade | Valor |
|-------------|-------|
| **ID** | `neural-architect` |
| **Título** | Neural Architect |
| **Descrição** | "O arquiteto do vazio. Crie 50 templates que foram usados por outros usuários." |
| **Requisito** | 50 templates criados com pelo menos 5 usos externos cada |
| **Tipo** | `templates` |
| **Ícone Lucide** | `Gem` |
| **Gradiente do ícone** | `from-void-400 to-void-600` |
| **Design do ícone** | Fundo `rounded-full` (circular), ring `2px void-500/50` com animação de pulse, glow roxo permanente leve |
| **Micro-interação hover** | *Multi-stage:* (1) `void-particles` — 2-3 partículas roxas sobem ao redor do ícone via pseudo-elements. (2) `shimmer-sweep` — brilho roxo translúcido varre horizontalmente o card via span absolute. (3) Ícone ganha `scale(1.08)` + glow intensificado `void-500/40`. Tudo com `duration-300` de entrada. |
| **XP** | 1000 |

---

## 2. Centurion

| Propriedade | Valor |
|-------------|-------|
| **ID** | `centurion` |
| **Título** | Centurion |
| **Descrição** | "100 dias. 100 batalhas. Nenhuma falha. Mantenha um streak perfeito de 100 dias." |
| **Requisito** | Streak de 100 dias consecutivos |
| **Tipo** | `streak` |
| **Ícone Lucide** | `Shield` |
| **Gradiente do ícone** | `from-void-300 to-void-600` |
| **Design do ícone** | Fundo `rounded-full`, ring animado pulsante (`wave-pulse` recolorido), glow violeta |
| **Micro-interação hover** | *Multi-stage:* (1) Ícone emite `heat-pulse` com cores void (brightness 1.15, saturate 1.3 pulsando). (2) Card inteiro recebe `shimmer-sweep`. (3) Borda intensifica com transição de 300ms. (4) `void-particles` sobem da base do card. Combinação de 4 efeitos simultâneos. |
| **XP** | 1500 |

---

## 3. Dimensional Scholar

| Propriedade | Valor |
|-------------|-------|
| **ID** | `dimensional-scholar` |
| **Título** | Dimensional Scholar |
| **Descrição** | "O tempo se dobra para quem estuda. 100 horas de deep work acumuladas." |
| **Requisito** | 100 horas de foco total |
| **Tipo** | `hours` |
| **Ícone Lucide** | `Hourglass` |
| **Gradiente do ícone** | `from-void-400 to-void-700` |
| **Design do ícone** | Fundo `rounded-full`, ring duplo (inner 1px + outer 2px com gap) |
| **Micro-interação hover** | *Multi-stage:* (1) `clock-spin` no ícone (velocidade 2x = 1.5s) — ampulheta girando. (2) `void-particles` subindo. (3) Shimmer varre o título do achievement. (4) Card emite glow `void-500/35`. |
| **XP** | 1200 |

---

## 4. Hive Mind

| Propriedade | Valor |
|-------------|-------|
| **ID** | `hive-mind` |
| **Título** | Hive Mind |
| **Descrição** | "Todas as sinapses conectadas. Conecte 5 integrações externas." |
| **Requisito** | 5 serviços externos conectados (GitHub, Spotify, Slack, etc.) |
| **Tipo** | `connections` |
| **Ícone Lucide** | `BrainCircuit` |
| **Gradiente do ícone** | `from-void-400 to-void-600` |
| **Design do ícone** | Fundo `rounded-full`, ring animado, 3 linhas finas saindo do ícone em 3 direções (pseudo-elements) |
| **Micro-interação hover** | *Multi-stage:* (1) `connect-lines` existente recolorido com void. (2) 3 linhas finas (1px, 12px length) saem do ícone a 0°, 120° e 240° com transition `opacity 0→0.6` + `width 0→12px`, 400ms staggered. (3) `void-particles` no card. (4) Glow pulsante no ícone. Representa sinapses se formando. |
| **XP** | 800 |

---

## Implementação

**3 keyframes novos** (`void-particles`, `shimmer-sweep`, `border-rotate`) + reutiliza `heat-pulse`, `clock-spin`, `connect-lines`, `wave-pulse` existentes.

### Pseudo-elements Budget

Epic achievements usam pseudo-elements intensamente:

```
::before → shimmer sweep (brilho horizontal varrendo)
::after  → partículas subindo (void-particles)
```

Para efeitos extras (linhas do Hive Mind), usar `<span>` posicionados absolute dentro do componente, controlados por `isHovered`.

### Shimmer no título

```tsx
// Span absolute posicionado sobre o título
{isHovered && achievement.rarity === "epic" && (
  <span
    className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none"
    aria-hidden="true"
  >
    <span className="absolute inset-0 -translate-x-full animate-shimmer-sweep
      bg-gradient-to-r from-transparent via-void-400/10 to-transparent" />
  </span>
)}
```

### Borda animada (border-rotate)

Para o efeito de borda com gradiente cônico rotacionando:

```tsx
// Usa @property para animar CSS custom property
// Fallback: border sólida com transition de cor
style={{
  background: `conic-gradient(from var(--border-angle, 0deg), oklch(0.570 0.125 288.0 / 0.3), oklch(0.660 0.140 290.0 / 0.1), oklch(0.570 0.125 288.0 / 0.3))`,
}}
```

### Checklist

- [ ] 3 keyframes adicionados ao `globals.css`
- [ ] Classes `.animate-void-particles`, `.animate-shimmer-sweep` criadas
- [ ] Pseudo-elements configurados com `pointer-events: none`
- [ ] Adicionados ao bloco `prefers-reduced-motion`
- [ ] 4 achievements criados no mockData com `rarity: "epic"`
- [ ] Ícones mapeados: `Gem`, `Shield`, `Hourglass`
- [ ] Cores `void-*` registradas no Tailwind
- [ ] Shimmer span implementado no AchievementCard
