# 🔷 Rare — Cobalt Flux

> **Família de cor:** Cobalt Flux (Azul Cobalto Elétrico)
> **Gradiente:** `--cobalt-400` → `--cobalt-600` | OKLCH hue ~238-250
> **Dificuldade:** Significativa — Semanas de uso consistente
> **Micro-interação:** Média — Animação temática por tipo (ondas, relógio, pulsos)
> **Keyframes novos:** `cobalt-ripple`, `clock-spin`
> **% Jogadores:** ~25%

---

## Padrão Visual

```
Card: border-cobalt-500/25 bg-gradient-to-b from-cobalt-500/8 to-transparent
Hover: hover:border-cobalt-500/40 hover:shadow-[0_0_20px_oklch(0.580_0.115_238.0/0.3)]
Badge: bg-cobalt-500/10 text-cobalt-400 border-cobalt-500/20
Ícone: rounded-xl, gradiente cobalt, ring 2px cobalt-500/40, glow sutil
```

A partir deste tier, o **glow no card inteiro** aparece no hover (shadow spread azulado).

---

## Novos Keyframes

```css
/* Ondulação expandindo para fora — ripple effect */
@keyframes cobalt-ripple {
  0% {
    box-shadow: 0 0 0 0 oklch(0.580 0.115 238.0 / 0.4);
  }
  70% {
    box-shadow: 0 0 0 12px oklch(0.580 0.115 238.0 / 0);
  }
  100% {
    box-shadow: 0 0 0 0 oklch(0.580 0.115 238.0 / 0);
  }
}
.animate-cobalt-ripple {
  animation: cobalt-ripple 1.8s ease-out infinite;
}

/* Ponteiro de relógio girando — para achievements de horas */
@keyframes clock-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.animate-clock-spin {
  animation: clock-spin 3s linear infinite;
}
```

---

## 1. Deep Diver

| Propriedade | Valor |
|-------------|-------|
| **ID** | `deep-diver` |
| **Título** | Deep Diver |
| **Descrição** | "O abismo te conhece pelo nome. Acumule 50 horas de deep work ininterrupto." |
| **Requisito** | 50 horas de sessões de foco sem interrupções |
| **Tipo** | `hours` |
| **Ícone Lucide** | `Clock` |
| **Gradiente do ícone** | `from-cobalt-400 to-cobalt-600` |
| **Design do ícone** | Fundo `rounded-xl`, ring `2px cobalt-500/40`, glow sutil no repouso |
| **Micro-interação hover** | Pseudo-element de ponteiro de relógio gira suavemente dentro do ícone (`clock-spin`, 3s linear). Container do ícone ativa `cobalt-ripple` — ondulação azul expandindo para fora. Card ganha glow azulado. |
| **XP** | 500 |

---

## 2. Flow State Surfer

| Propriedade | Valor |
|-------------|-------|
| **ID** | `flow-state-surfer` |
| **Título** | Flow State Surfer |
| **Descrição** | "Surfando as ondas da consciência. Entre em flow state 50 vezes." |
| **Requisito** | 50 sessões de high concentration detectadas |
| **Tipo** | `flow` |
| **Ícone Lucide** | `Waves` |
| **Gradiente do ícone** | `from-cobalt-300 to-cobalt-600` |
| **Design do ícone** | Fundo `rounded-xl`, ring animado sutil |
| **Micro-interação hover** | Ícone ondula verticalmente (`flow-wave` existente, 1.5s ease-in-out). Borda do card emite `cobalt-ripple` expandindo para fora. Combinação de dois efeitos simultâneos. |
| **XP** | 500 |

---

## 3. Consistency Core

| Propriedade | Valor |
|-------------|-------|
| **ID** | `consistency-core` |
| **Título** | Consistency Core |
| **Descrição** | "O núcleo se estabiliza. 30 dias consecutivos com pelo menos 1 sessão de foco." |
| **Requisito** | Streak de 30 dias |
| **Tipo** | `streak` |
| **Ícone Lucide** | `Repeat` |
| **Gradiente do ícone** | `from-cobalt-400 to-cobalt-700` |
| **Design do ícone** | Fundo `rounded-xl`, borda dupla azul |
| **Micro-interação hover** | Ícone gira 360° lentamente (`clock-spin` adaptado, 4s ease-in-out) representando o ciclo. Borda emite `cobalt-ripple`. Card glow azulado. |
| **XP** | 600 |

---

## 4. Midnight Scholar

| Propriedade | Valor |
|-------------|-------|
| **ID** | `midnight-scholar` |
| **Título** | Midnight Scholar |
| **Descrição** | "A lua é sua companheira de estudo. 20 horas de foco noturno (22h-4h)." |
| **Requisito** | 20 horas de foco entre 22h e 4h |
| **Tipo** | `night` |
| **Ícone Lucide** | `Moon` |
| **Gradiente do ícone** | `from-cobalt-500 to-cobalt-800` (mais escuro = noturno) |
| **Design do ícone** | Fundo `rounded-xl`, tom profundo que evoca a noite |
| **Micro-interação hover** | `moon-glow` existente (box-shadow pulsante, 2s) recolorido com cobalt (azul profundo). Leve aumento de brightness no card (`brightness-105`). Glow cobalt na borda. |
| **XP** | 750 |

---

## 5. Template Artisan

| Propriedade | Valor |
|-------------|-------|
| **ID** | `template-artisan` |
| **Título** | Template Artisan |
| **Descrição** | "A arte da estrutura. Crie 10 templates de workflow personalizados." |
| **Requisito** | 10 templates criados |
| **Tipo** | `templates` |
| **Ícone Lucide** | `LayoutTemplate` |
| **Gradiente do ícone** | `from-cobalt-400 to-cobalt-600` |
| **Design do ícone** | Fundo `rounded-xl`, ring `2px cobalt-500/40` |
| **Micro-interação hover** | `build-glow` existente recolorido com cobalt. Ícone faz `scale(1.05)`. 3 blocos minúsculos (3px squares) aparecem ao redor do ícone via pseudo-elements com transition `opacity 0→1`, 300ms — representando peças sendo montadas. |
| **XP** | 450 |

---

## Implementação

**2 keyframes novos** (`cobalt-ripple`, `clock-spin`) + reutiliza `flow-wave`, `moon-glow`, `build-glow` do CSS existente.

### Lógica de animação temática

O Rare é o primeiro tier onde a animação **muda de acordo com o tipo** do achievement:

```tsx
const getRareAnimation = (type: AchievementType) => {
  switch (type) {
    case "hours": return "clock-spin";       // ponteiro girando
    case "flow": return "flow-wave";         // ondulação
    case "streak": return "clock-spin";      // ciclo
    case "night": return "moon-glow";        // brilho lunar
    case "templates": return "build-glow";   // construção
    default: return "cobalt-ripple";         // ripple genérico
  }
};
```

### Checklist

- [ ] 2 keyframes adicionados ao `globals.css`
- [ ] Classes `.animate-cobalt-ripple` e `.animate-clock-spin` criadas
- [ ] Adicionados ao bloco `prefers-reduced-motion`
- [ ] 5 achievements criados no mockData com `rarity: "rare"`
- [ ] Lógica de animação temática por tipo implementada no AchievementCard
- [ ] Ícones mapeados: `LayoutTemplate`, `Waves`
- [ ] Cores `cobalt-*` registradas no Tailwind
