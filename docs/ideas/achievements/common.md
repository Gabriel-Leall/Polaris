# ⚙️ Common — Iron Steel

> **Família de cor:** Iron Steel (Cinza Aço Frio)
> **Gradiente:** `--iron-400` → `--iron-600` | OKLCH hue ~270
> **Dificuldade:** Fácil — Primeiras ações na plataforma
> **Micro-interação:** Mínima — `hover:scale-[1.02]` + `hover:opacity-90` + `transition-all duration-200`
> **Keyframes novos:** Nenhum
> **% Jogadores:** ~90%

---

## Padrão Visual

```
Card: border-iron-500/15 bg-gradient-to-b from-iron-500/5 to-transparent
Hover: hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200
Badge: bg-iron-500/10 text-iron-400 border-iron-500/20
Ícone: rounded-xl, gradiente iron, sem glow, sem ring
```

Achievements Common **não precisam de CSS novo**. Tudo é feito com classes Tailwind utilitárias.
Isso os torna rápidos de implementar e perfeitos como onboarding do sistema de achievements.

---

## 1. First Light

| Propriedade | Valor |
|-------------|-------|
| **ID** | `first-light` |
| **Título** | First Light |
| **Descrição** | "A jornada começa com um único passo. Complete sua primeira sessão de foco." |
| **Requisito** | Completar 1 sessão de Pomodoro |
| **Tipo** | `hours` |
| **Ícone Lucide** | `Play` |
| **Gradiente do ícone** | `from-iron-400 to-iron-600` |
| **Design do ícone** | Fundo `rounded-xl`, gradiente cinza aço, sem glow, sem ring |
| **Micro-interação hover** | `scale-[1.03]` + `-translate-y-0.5`, `duration-200 ease-out`. Sem animação contínua. |
| **XP** | 25 |

---

## 2. Scribe Initiate

| Propriedade | Valor |
|-------------|-------|
| **ID** | `scribe-initiate` |
| **Título** | Scribe Initiate |
| **Descrição** | "Toda grande ideia começa como um rascunho. Crie sua primeira nota." |
| **Requisito** | Criar 1 nota no Brain Dump |
| **Tipo** | `templates` |
| **Ícone Lucide** | `PenLine` |
| **Gradiente do ícone** | `from-iron-300 to-iron-500` |
| **Design do ícone** | Fundo `rounded-xl`, gradiente cinza claro |
| **Micro-interação hover** | `scale-[1.02]`, sutil `opacity-95` no ícone, `cursor-pointer`. Nada mais. |
| **XP** | 15 |

---

## 3. Task Runner

| Propriedade | Valor |
|-------------|-------|
| **ID** | `task-runner` |
| **Título** | Task Runner |
| **Descrição** | "Risque a primeira linha da sua lista. Complete sua primeira tarefa." |
| **Requisito** | Completar 1 tarefa |
| **Tipo** | `speed` |
| **Ícone Lucide** | `CheckCircle` |
| **Gradiente do ícone** | `from-iron-400 to-iron-600` |
| **Design do ícone** | Fundo `rounded-xl` |
| **Micro-interação hover** | `scale-[1.02]` + borda clareia levemente (`iron-500/25` → `iron-500/35`). |
| **XP** | 15 |

---

## 4. Night Watch

| Propriedade | Valor |
|-------------|-------|
| **ID** | `night-watch` |
| **Título** | Night Watch |
| **Descrição** | "Nem todos os heróis dormem cedo. Complete uma sessão de foco após as 22h." |
| **Requisito** | 1 sessão de foco entre 22h e 4h |
| **Tipo** | `night` |
| **Ícone Lucide** | `Moon` |
| **Gradiente do ícone** | `from-iron-400 to-iron-700` (tom mais escuro = noturno) |
| **Design do ícone** | Fundo `rounded-xl` |
| **Micro-interação hover** | `scale-[1.02]`, sem efeito adicional. O visual escuro do ícone já comunica o tema. |
| **XP** | 20 |

---

## 5. The Spark

| Propriedade | Valor |
|-------------|-------|
| **ID** | `the-spark` |
| **Título** | The Spark |
| **Descrição** | "Um circuito precisa de energia. Acumule seus primeiros 100 XP." |
| **Requisito** | Alcançar 100 XP total |
| **Tipo** | `milestone` |
| **Ícone Lucide** | `Zap` |
| **Gradiente do ícone** | `from-iron-300 to-iron-500` |
| **Design do ícone** | Fundo `rounded-xl` |
| **Micro-interação hover** | `scale-[1.03]`, ícone ganha leve `brightness-110` via Tailwind (`hover:brightness-110`). |
| **XP** | 30 |

---

## Implementação

**Nenhum CSS novo necessário.** Todos os efeitos usam classes Tailwind existentes:

```tsx
// Exemplo de classe no card Common
className={cn(
  "hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-200",
  "border-iron-500/15 bg-gradient-to-b from-iron-500/5 to-transparent"
)}
```

### Checklist

- [ ] 5 achievements criados no mockData com `rarity: "common"`
- [ ] Ícones mapeados no `iconMap`: `Play`, `PenLine`, `CheckCircle`
- [ ] Cores `iron-*` registradas no Tailwind
- [ ] Nenhum keyframe novo necessário
