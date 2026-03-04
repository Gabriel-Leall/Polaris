# 🔥 Legendary — Solar Flare

> **Família de cor:** Solar Flare (Dourado Solar Flamejante)
> **Gradiente:** `--solar-300` → `--solar-600` | OKLCH hue ~55-85
> **Dificuldade:** Extrema — Meses a anos de dedicação absoluta
> **Micro-interação:** Máxima — Chamas, shimmer, aura radiante, gradiente animado, partículas douradas, efeito "respira"
> **Keyframes novos:** `solar-flare`, `flame-rise`, `card-breathe`, `golden-particles`
> **% Jogadores:** ~1%

---

## Padrão Visual

### Estado Default (SEM hover)

Legendary cards são os únicos que possuem **presença visual mesmo em repouso**:

```
Card: border-solar-500/40 bg-gradient-to-b from-solar-500/10 via-transparent to-solar-600/5
Glow permanente: shadow-[0_0_15px_oklch(0.760_0.155_65.0/0.15)]
Badge: bg-solar-500/15 text-solar-400 border-solar-500/30
Ícone: rounded-full, gradiente solar wide, ring triplo, glow dourado permanente
Animação permanente: card-breathe (3s loop) — o card SEMPRE pulsa levemente
```

### Estado Hover

No hover, **tudo intensifica**:

```
Glow: shadow-[0_0_35px_oklch(0.760_0.155_65.0/0.4)]
Border: solar-500/60
Partículas douradas aparecem
Chamas sobem (para Immortal Flame)
Shimmer ativa
Ícone scale(1.1)
```

---

## Novos Keyframes

```css
/* Aura radiante dourada — expande e contrai como uma estrela */
@keyframes solar-flare {
  0%, 100% {
    box-shadow:
      0 0 15px oklch(0.760 0.155 65.0 / 0.3),
      0 0 40px oklch(0.700 0.145 60.0 / 0.15),
      inset 0 0 15px oklch(0.760 0.155 65.0 / 0.05);
  }
  50% {
    box-shadow:
      0 0 25px oklch(0.760 0.155 65.0 / 0.5),
      0 0 60px oklch(0.700 0.145 60.0 / 0.25),
      inset 0 0 25px oklch(0.760 0.155 65.0 / 0.1);
  }
}
.animate-solar-flare {
  animation: solar-flare 2.5s ease-in-out infinite;
}

/* Chamas subindo pela borda — para streak achievements */
@keyframes flame-rise {
  0% {
    transform: translateY(0) scaleX(1);
    opacity: 0.8;
  }
  25% {
    transform: translateY(-8px) scaleX(1.1);
    opacity: 1;
  }
  50% {
    transform: translateY(-18px) scaleX(0.8);
    opacity: 0.6;
  }
  75% {
    transform: translateY(-28px) scaleX(0.5);
    opacity: 0.3;
  }
  100% {
    transform: translateY(-40px) scaleX(0.2);
    opacity: 0;
  }
}
/* Cada span de chama usa esta animação com delays diferentes */

/* Card "respira" — pulse sutil permanente (SEMPRE ATIVO) */
@keyframes card-breathe {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.005);
  }
}
.animate-card-breathe {
  animation: card-breathe 3s ease-in-out infinite;
}

/* Partículas douradas flutuando para cima */
@keyframes golden-particles {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-35px) translateX(10px) scale(0);
    opacity: 0;
  }
}
```

---

## 1. The Neural Mastermind

| Propriedade | Valor |
|-------------|-------|
| **ID** | `neural-mastermind` |
| **Título** | The Neural Mastermind |
| **Descrição** | "Dominação cognitiva total. Complete TODOS os achievements core de todos os tiers." |
| **Requisito** | 100% dos achievements Common + Uncommon + Rare + Epic completos |
| **Tipo** | `milestone` |
| **Ícone Lucide** | `Crown` |
| **Gradiente do ícone** | `from-solar-300 to-solar-600` |
| **Design do ícone** | Fundo `rounded-full`, ring triplo (inner `solar-400/80`, mid `solar-500/50`, outer `solar-600/30`), glow dourado permanente, aura radiante |

### Micro-interação hover (5 efeitos simultâneos)

| # | Efeito | Keyframe | Descrição |
|---|--------|----------|-----------|
| 1 | Aura Solar | `solar-flare` | Aura dourada expande/contrai no card inteiro (2.5s loop) |
| 2 | Partículas | `golden-particles` | 4-5 partículas douradas flutuam para cima (spans com delays 0s, 0.4s, 0.8s, 1.2s, 1.6s) |
| 3 | Shimmer | `shimmer-sweep` | Brilho dourado varre o título do card (2.5s) |
| 4 | Respiro | `card-breathe` | Card pulsa sutilmente como se tivesse vida (3s) — **SEMPRE ATIVO** |
| 5 | Ícone | CSS transition | `scale(1.1)` + alternância `rotate(±5deg)` com `duration-500` |

Background do card no hover: gradiente animado `from-solar-500/10 via-transparent to-solar-600/5`.

| **XP** | 5000 |

---

## 2. Immortal Flame

| Propriedade | Valor |
|-------------|-------|
| **ID** | `immortal-flame` |
| **Título** | Immortal Flame |
| **Descrição** | "A chama que nunca apaga. 365 dias consecutivos de foco. Um ano inteiro. Sem falhar." |
| **Requisito** | Streak de 365 dias |
| **Tipo** | `streak` |
| **Ícone Lucide** | `Flame` |
| **Gradiente do ícone** | `from-solar-300 to-solar-700` (gradiente wide: claro → intenso) |
| **Design do ícone** | Fundo `rounded-full`, ring `3px solar-400/60` com pulse permanente, glow solar |

### Micro-interação hover (5 efeitos simultâneos)

| # | Efeito | Keyframe | Descrição |
|---|--------|----------|-----------|
| 1 | Chamas | `flame-rise` | 3-5 spans posicionados na borda inferior do card. Cada um é um "pedaço de chama" — gradient `from-solar-400 to-orange-600`, 6px wide, border-radius. Delays: 0s, 0.3s, 0.6s, 0.9s, 1.2s. Sobem pela borda lateral. |
| 2 | Aura Solar | `solar-flare` | Aura dourada pulsante no card todo (2.5s) |
| 3 | Heat Pulse | `heat-pulse` | Ícone do Flame ganha `brightness(1.2)` + `saturate(1.4)` pulsando (0.8s) |
| 4 | Temperatura | CSS transition | Background do card "esquenta" — leve wash `from-solar-800/5` aparece com transition 500ms |
| 5 | Respiro | `card-breathe` | Sempre ativo (3s) |

Este é o achievement mais **visualmente dramático** — as chamas subindo são o elemento assinatura.

| **XP** | 3000 |

### Implementação das chamas

```tsx
// 5 spans de chama com delays diferentes
{isHovered && (
  <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden h-full">
    {[0, 0.3, 0.6, 0.9, 1.2].map((delay, i) => (
      <span
        key={i}
        className="absolute bottom-0 w-1.5 rounded-full bg-gradient-to-t from-solar-400 to-orange-600"
        style={{
          left: `${15 + i * 18}%`,
          height: '40px',
          animation: `flame-rise 1.5s ease-out infinite`,
          animationDelay: `${delay}s`,
        }}
      />
    ))}
  </div>
)}
```

---

## 3. Architect of Worlds

| Propriedade | Valor |
|-------------|-------|
| **ID** | `architect-of-worlds` |
| **Título** | Architect of Worlds |
| **Descrição** | "O universo se molda à sua vontade. 500 horas de foco total e 100 templates criados." |
| **Requisito** | 500 horas de deep work + 100 templates criados (requisito duplo) |
| **Tipo** | `milestone` |
| **Ícone Lucide** | `Orbit` |
| **Gradiente do ícone** | `from-solar-300 to-solar-600` |
| **Design do ícone** | Fundo `rounded-full`, 2 órbitas animadas ao redor (pseudo-elements com `orbit-slow` e `orbit-reverse` existentes no globals.css), ring triplo, glow máximo |

### Micro-interação hover (6 efeitos simultâneos — o máximo do sistema)

| # | Efeito | Keyframe | Descrição |
|---|--------|----------|-----------|
| 1 | Órbitas | `orbit-slow` + `orbit-reverse` | 2 pseudo-elements orbitando o ícone. No hover, velocidade acelera (duration 8s → 3s via style override). |
| 2 | Aura + Partículas | `solar-flare` + `golden-particles` | Aura no card + partículas douradas flutuando |
| 3 | Shimmer Full | `shimmer-sweep` | Varre o card INTEIRO (não só o título) |
| 4 | Borda Animada | `border-rotate` | Conic-gradient na borda rotaciona (reutiliza do Epic) |
| 5 | Respiro | `card-breathe` | Sempre ativo |
| 6 | Background Moving | CSS animation | `background-position` anima de `0% 50%` → `100% 50%` (gradiente se move, 6s linear) |

Som opcional ao desbloquear — arquivo de áudio em `public/sounds/legendary-unlock.mp3`.

| **XP** | 5000 |

---

## Implementação

**4 keyframes novos** (`solar-flare`, `flame-rise`, `card-breathe`, `golden-particles`)
+ reutiliza: `shimmer-sweep` (Epic), `heat-pulse`, `orbit-slow`, `orbit-reverse`, `border-rotate`.

### Card Component — Legendary Wrapper

Legendaries precisam de um wrapper especial no `AchievementCard` por causa do `card-breathe` permanente e do número de elementos filhos para partículas/chamas:

```tsx
// Legendary card SEMPRE tem card-breathe ativo
const isLegendary = achievement.rarity === "legendary";

<div className={cn(
  "group relative ...",
  isLegendary && "animate-card-breathe"
)}>
  {/* Glow permanente para legendary */}
  {isLegendary && (
    <div className="absolute inset-0 rounded-2xl shadow-[0_0_15px_oklch(0.760_0.155_65.0/0.15)] pointer-events-none" />
  )}

  {/* Partículas douradas — só no hover */}
  {isLegendary && isHovered && (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {[0, 0.4, 0.8, 1.2, 1.6].map((delay, i) => (
        <span key={i} className="absolute w-1 h-1 rounded-full bg-solar-400"
          style={{
            left: `${10 + i * 20}%`, bottom: '10%',
            animation: `golden-particles 2s ease-out infinite`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  )}

  {/* ... resto do card */}
</div>
```

### Pseudo-elements Budget

Legendary cards usam o **máximo** de elementos visuais:

| Elemento | Uso |
|----------|-----|
| `::before` | Shimmer sweep (brilho horizontal) |
| `::after` | Glow aura pulsante |
| 3-5 `<span>` | Partículas douradas flutuando |
| 3-5 `<span>` | Chamas subindo (Immortal Flame) |
| 2 `<span>` | Órbitas (Architect of Worlds) |

### Performance

- `will-change: transform, opacity` apenas durante hover (remover no onMouseLeave)
- `contain: content` no card para isolar repaints do resto da página
- `card-breathe` é a ÚNICA animação permanente — usa apenas `transform: scale()` (GPU-safe)
- `@media (prefers-reduced-motion: reduce)` → remove TUDO exceto a borda e glow estático

```css
@media (prefers-reduced-motion: reduce) {
  .animate-solar-flare,
  .animate-flame-rise,
  .animate-card-breathe,
  .animate-golden-particles {
    animation: none;
  }
}
```

### Checklist

- [ ] 4 keyframes adicionados ao `globals.css`
- [ ] Classes `.animate-solar-flare`, `.animate-flame-rise`, `.animate-card-breathe`, `.animate-golden-particles`
- [ ] Pseudo-elements com `pointer-events: none` e `overflow: hidden`
- [ ] Adicionados ao bloco `prefers-reduced-motion`
- [ ] 3 achievements criados no mockData com `rarity: "legendary"`
- [ ] Legendary wrapper no AchievementCard com `card-breathe` permanente
- [ ] Ícones mapeados: `Crown`, `Orbit`
- [ ] Cores `solar-*` registradas no Tailwind
- [ ] Partículas e chamas testadas visualmente
- [ ] `contain: content` aplicado no card
- [ ] Som de unlock (opcional) em `public/sounds/`
