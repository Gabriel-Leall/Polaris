# 🟢 Uncommon — Jade Circuit

> **Família de cor:** Jade Circuit (Verde Circuito)
> **Gradiente:** `--jade-400` → `--jade-600` | OKLCH hue ~148-160
> **Dificuldade:** Moderada — Requer alguns dias de uso consistente
> **Micro-interação:** Baixa — Glow suave pulsante no hover (`jade-pulse`, 2s loop)
> **Keyframes novos:** `jade-pulse`, `idle-float`
> **% Jogadores:** ~60%

---

## Padrão Visual

```
Card: border-jade-500/20 bg-gradient-to-b from-jade-500/5 to-transparent
Hover: hover:border-jade-500/35 hover:shadow-[0_0_15px_oklch(0.590_0.100_148.0/0.2)]
Badge: bg-jade-500/10 text-jade-400 border-jade-500/20
Ícone: rounded-xl, gradiente jade, ring 1px jade-500/30
```

---

## Novos Keyframes

```css
/* Glow verde pulsante suave */
@keyframes jade-pulse {
  0%, 100% {
    box-shadow: 0 0 8px oklch(0.590 0.100 148.0 / 0.2);
  }
  50% {
    box-shadow: 0 0 18px oklch(0.590 0.100 148.0 / 0.35);
  }
}
.animate-jade-pulse {
  animation: jade-pulse 2s ease-in-out infinite;
}

/* Flutuação vertical sutil */
@keyframes idle-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
.animate-idle-float {
  animation: idle-float 2.5s ease-in-out infinite;
}
```

---

## 1. Data Seed

| Propriedade | Valor |
|-------------|-------|
| **ID** | `data-seed` |
| **Título** | Data Seed |
| **Descrição** | "A semente de dados foi plantada. Crie 5 notas no Brain Dump." |
| **Requisito** | Criar 5 notas |
| **Tipo** | `templates` |
| **Ícone Lucide** | `Sprout` |
| **Gradiente do ícone** | `from-jade-400 to-jade-600` |
| **Design do ícone** | Fundo `rounded-xl`, gradiente verde, ring `1px jade-500/30` |
| **Micro-interação hover** | Container do ícone ativa `jade-pulse` — glow verde suave pulsando ao redor. Card faz `scale-[1.02]`. |
| **XP** | 50 |

---

## 2. Rhythm Keeper

| Propriedade | Valor |
|-------------|-------|
| **ID** | `rhythm-keeper` |
| **Título** | Rhythm Keeper |
| **Descrição** | "Consistência é o primeiro sinal de disciplina. Mantenha um streak de 5 dias." |
| **Requisito** | 5 dias consecutivos com pelo menos 1 sessão de foco |
| **Tipo** | `streak` |
| **Ícone Lucide** | `Repeat` |
| **Gradiente do ícone** | `from-jade-400 to-jade-600` |
| **Design do ícone** | Fundo `rounded-xl`, ring sutil verde |
| **Micro-interação hover** | `jade-pulse` na borda + `idle-float` — ícone flutua verticalmente 2px (2.5s). Efeito combinado suave. |
| **XP** | 60 |

---

## 3. Circuit Builder

| Propriedade | Valor |
|-------------|-------|
| **ID** | `circuit-builder` |
| **Título** | Circuit Builder |
| **Descrição** | "Os circuitos se formam. Acumule 10 horas totais de foco." |
| **Requisito** | 10 horas de foco acumuladas |
| **Tipo** | `hours` |
| **Ícone Lucide** | `Timer` |
| **Gradiente do ícone** | `from-jade-300 to-jade-500` |
| **Design do ícone** | Fundo `rounded-xl` |
| **Micro-interação hover** | `jade-pulse` no background do card inteiro (borda brilha suavemente em verde). |
| **XP** | 75 |

---

## 4. Link Forger

| Propriedade | Valor |
|-------------|-------|
| **ID** | `link-forger` |
| **Título** | Link Forger |
| **Descrição** | "Uma mente conectada é uma mente poderosa. Conecte 1 integração externa." |
| **Requisito** | Conectar 1 serviço externo (GitHub, Spotify, etc.) |
| **Tipo** | `connections` |
| **Ícone Lucide** | `Link` |
| **Gradiente do ícone** | `from-jade-400 to-jade-700` |
| **Design do ícone** | Fundo `rounded-xl`, ring `1px jade-500/30` |
| **Micro-interação hover** | Glow suave na borda do card (`jade-pulse`). Ícone faz `scale-[1.05]` com `duration-300`. |
| **XP** | 50 |

---

## 5. Quick Thinker

| Propriedade | Valor |
|-------------|-------|
| **ID** | `quick-thinker` |
| **Título** | Quick Thinker |
| **Descrição** | "Velocidade é uma forma de inteligência. Complete 10 tarefas em um único dia." |
| **Requisito** | 10 tarefas completadas em 24h |
| **Tipo** | `speed` |
| **Ícone Lucide** | `Zap` |
| **Gradiente do ícone** | `from-jade-300 to-jade-600` |
| **Design do ícone** | Fundo `rounded-xl` |
| **Micro-interação hover** | `jade-pulse` + leve `brightness(1.05)` no ícone via `hover:brightness-105`. |
| **XP** | 65 |

---

## Implementação

**2 keyframes novos** (`jade-pulse`, `idle-float`).

### Lógica no componente

```tsx
// Animação ativa apenas no hover
{isHovered && achievement.rarity === "uncommon" && (
  <div className="animate-jade-pulse" />
)}
```

### Checklist

- [ ] 2 keyframes adicionados ao `globals.css`
- [ ] Classes `.animate-jade-pulse` e `.animate-idle-float` criadas
- [ ] Adicionados ao bloco `prefers-reduced-motion`
- [ ] 5 achievements criados no mockData com `rarity: "uncommon"`
- [ ] Ícones mapeados: `Sprout`, `Link`, `Timer`
- [ ] Cores `jade-*` registradas no Tailwind
