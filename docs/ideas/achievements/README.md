# 🏆 Sistema de Achievements — Design & Implementação

> Catálogo completo de achievements do Polaris, organizado por raridade.
> Cada tier tem sua própria paleta de cores OKLCH, padrão de micro-interações e nível de dificuldade.

## Visão Geral

O sistema de achievements recompensa o progresso do usuário com métricas reais de produtividade.
Cada achievement tem um **tier de raridade** que define sua identidade visual, complexidade de animação
e dificuldade de desbloqueio.

O design segue uma estética **sci-fi/RPG híbrida**: nomes temáticos neuronais para tiers altos,
nomes de RPG clássico para tiers baixos. Tudo pensado para implementação direta em **Next.js + Tailwind + Lucide Icons**.

---

## Tiers de Raridade

| Tier | Família de Cor | Gradiente do Ícone | Dificuldade | % Jogadores | Complexidade da Animação |
|------|---------------|---------------------|-------------|-------------|--------------------------|
| **Common** | Iron Steel (Cinza Aço) | `iron-400 → iron-600` | Fácil (1-3 ações) | ~90% | Mínima — hover opacity + scale |
| **Uncommon** | Jade Circuit (Verde) | `jade-400 → jade-600` | Moderada (5-15 ações) | ~60% | Baixa — glow suave / pulse |
| **Rare** | Cobalt Flux (Azul) | `cobalt-400 → cobalt-600` | Significativa (30-50 ações) | ~25% | Média — animação temática |
| **Epic** | Void Amethyst (Roxo) | `void-400 → void-600` | Alta (100+ ações / meses) | ~8% | Alta — partículas + trails |
| **Legendary** | Solar Flare (Dourado) | `solar-300 → solar-600` | Extrema (anos / 100%) | ~1% | Máxima — chamas + shimmer + aura |

---

## Regra de Proporcionalidade

**Quanto maior o tier, mais difícil o requisito E mais elaborada a micro-interação.**

- **Common**: Sem `@keyframes` novos. Apenas classes Tailwind existentes (`hover:scale-[1.02]`, `hover:opacity-90`).
- **Uncommon**: 1 keyframe simples (pulse/glow lento, ~2s loop).
- **Rare**: 1-2 keyframes dedicados com animação temática ao tipo do achievement.
- **Epic**: 2-3 keyframes + pseudo-elements (partículas, shimmer no título).
- **Legendary**: 3-4 keyframes + pseudo-elements + gradient animado no card + efeito "respira".

---

## Padrão Visual por Tier

### Estilos de Card

| Propriedade | Common | Uncommon | Rare | Epic | Legendary |
|-------------|--------|----------|------|------|-----------|
| **Border** | `iron-500/15` | `jade-500/20` | `cobalt-500/25` | `void-500/30` | `solar-500/40` |
| **Glow (hover)** | Nenhum | `0 0 15px jade-500/20` | `0 0 20px cobalt-500/30` | `0 0 25px void-500/35` | `0 0 35px solar-400/40` |
| **Badge BG** | `iron-500/10` | `jade-500/10` | `cobalt-500/10` | `void-500/10` | `solar-500/15` |
| **Badge Text** | `iron-400` | `jade-400` | `cobalt-400` | `void-400` | `solar-400` |
| **Background** | `from-iron-500/5` | `from-jade-500/5` | `from-cobalt-500/8` | `from-void-500/8` | `from-solar-500/10` |
| **Icon Ring** | Nenhum | `1px jade-500/30` | `2px cobalt-500/40` | `2px void-500/50` animado | `3px solar-400/60` + pulse |
| **Icon Shape** | `rounded-xl` | `rounded-xl` | `rounded-xl` | `rounded-full` | `rounded-full` |

---

## Achievements Secretos (Tipo `secret`)

Achievements secretos podem ser de **qualquer raridade**. Diferenças visuais:

- Card aparece como `???` com ícone `Lock` até ser desbloqueado
- Título e descrição ocultos (texto placeholder: "Hidden Achievement")
- Ao desbloquear, animação de "reveal" — card flipa ou dissolve revelando o conteúdo
- Dica sutil aparece no hover do card bloqueado (texto críptico)

---

## Specs Técnicas (Frontend)

### Types a expandir em `src/types/index.ts`

```typescript
// Adicionar ao AchievementType
export type AchievementType =
  | "hours" | "templates" | "days" | "connections"
  | "speed" | "night" | "flow" | "streak"
  | "secret" | "milestone" | "social";

// Adicionar ao AchievementAnimation
export type AchievementAnimation =
  | "wave-pulse" | "build-glow" | "streak-fire" | "connect-lines"
  | "speed-trail" | "moon-glow" | "flow-wave" | "heat-pulse"
  | "idle-float" | "jade-pulse" | "cobalt-ripple" | "void-particles"
  | "solar-flare" | "flame-rise" | "clock-spin" | "shimmer-sweep"
  | "reveal-flip" | "card-breathe" | "golden-particles" | "border-rotate";

// Tornar rarity obrigatório
rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
```

### Novos `@keyframes` (adicionar ao `globals.css`)

| Keyframe | Tier | Descrição |
|----------|------|-----------|
| `jade-pulse` | Uncommon | Glow verde pulsante (2s ease-in-out) |
| `idle-float` | Uncommon+ | Flutuação vertical sutil 2px (2.5s) |
| `cobalt-ripple` | Rare | Ondulação azul expandindo para fora (1.8s) |
| `clock-spin` | Rare | Ponteiro de relógio girando (3s linear) |
| `void-particles` | Epic | Pseudo-elements subindo como partículas (2s) |
| `shimmer-sweep` | Epic+ | Brilho varrendo horizontalmente (2.5s) |
| `border-rotate` | Epic+ | Gradiente cônico de borda rotacionando (4s) |
| `solar-flare` | Legendary | Aura dourada expandindo/contraindo (2.5s) |
| `flame-rise` | Legendary | Chamas subindo pela borda do card (~1.5s) |
| `card-breathe` | Legendary | Card pulsa levemente (3s) — roda SEMPRE |
| `golden-particles` | Legendary | Partículas douradas flutuando para cima (2s) |
| `reveal-flip` | Secret | Card flipando 180° para revelar conteúdo |

### Ícones Lucide a mapear

| Ícone | Uso |
|-------|-----|
| `Play` | Primeira sessão de foco |
| `PenLine` | Criação de notas |
| `CheckCircle` | Completar tarefas |
| `Sprout` | Crescimento / dados plantados |
| `Link` | Integrações conectadas |
| `Timer` | Tempo acumulado |
| `Repeat` | Streaks / consistência |
| `Shield` | Defesa / resistência |
| `Compass` | Exploração |
| `LayoutTemplate` | Templates criados |
| `Hourglass` | Deep work prolongado |
| `Gem` | Conquista épica |
| `Crown` | Achievement lendário |
| `Orbit` | Domínio total |
| `Skull` | Achievement secreto |
| `Sword` | Desafio / combate |
| `Star` | Milestones |
| `Sparkles` | Desbloqueio especial |

### Performance

- Todas as animações usam apenas `transform` e `opacity` (GPU-accelerated)
- `will-change: transform` aplicado apenas durante hover (não permanente)
- `@media (prefers-reduced-motion: reduce)` desativa todas as animações
- Duração: 150-300ms para feedback instantâneo, 1.5-2.5s para loops contínuos

---

## Arquivos por Tier

| Arquivo | Tier | Qtd Achievements | Keyframes Novos |
|---------|------|-------------------|-----------------|
| [common.md](./common.md) | Common | 5 | 0 |
| [uncommon.md](./uncommon.md) | Uncommon | 5 | 2 |
| [rare.md](./rare.md) | Rare | 5 | 2 |
| [epic.md](./epic.md) | Epic | 4 | 3 |
| [legendary.md](./legendary.md) | Legendary | 3 | 4 |
| **Total** | — | **22** | **11** |
