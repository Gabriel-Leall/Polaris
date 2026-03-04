import { Achievement } from "@/types";

// =============================================
// COMMON - Iron Steel (Cinza Aço) - 5 Conquistas
// =============================================
const commonAchievements: Achievement[] = [
  {
    id: "first-light",
    title: "Primeira Luz",
    description:
      "A jornada começa com um único passo. Complete sua primeira sessão de foco.",
    status: "completed",
    type: "hours",
    animation: "wave-pulse",
    icon: "Play",
    progress: { current: 1, total: 1, percentage: 100 },
    completedAt: new Date("2024-01-15"),
    color: { from: "from-iron-400", to: "to-iron-600" },
    rarity: "Common",
    xp: 25,
    topPercentage: 90,
  },
  {
    id: "scribe-initiate",
    title: "Escriba Iniciante",
    description:
      "Toda grande ideia começa como um rascunho. Crie sua primeira nota.",
    status: "completed",
    type: "templates",
    animation: "build-glow",
    icon: "PenLine",
    progress: { current: 1, total: 1, percentage: 100 },
    completedAt: new Date("2024-01-16"),
    color: { from: "from-iron-300", to: "to-iron-500" },
    rarity: "Common",
    xp: 15,
    topPercentage: 88,
  },
  {
    id: "task-runner",
    title: "Executor de Tarefas",
    description:
      "Risque a primeira linha da sua lista. Complete sua primeira tarefa.",
    status: "completed",
    type: "speed",
    animation: "speed-trail",
    icon: "CheckCircle",
    progress: { current: 1, total: 1, percentage: 100 },
    completedAt: new Date("2024-01-15"),
    color: { from: "from-iron-400", to: "to-iron-600" },
    rarity: "Common",
    xp: 15,
    topPercentage: 92,
  },
  {
    id: "night-watch",
    title: "Vigia da Noite",
    description:
      "Nem todos os heróis dormem cedo. Complete uma sessão de foco após as 22h.",
    status: "completed",
    type: "night",
    animation: "moon-glow",
    icon: "Moon",
    progress: { current: 1, total: 1, percentage: 100 },
    completedAt: new Date("2024-01-20"),
    color: { from: "from-iron-400", to: "to-iron-700" },
    rarity: "Common",
    xp: 20,
    topPercentage: 75,
  },
  {
    id: "the-spark",
    title: "A Faísca",
    description:
      "Um circuito precisa de energia. Acumule seus primeiros 100 XP.",
    status: "completed",
    type: "milestone",
    animation: "heat-pulse",
    icon: "Zap",
    progress: { current: 100, total: 100, percentage: 100 },
    completedAt: new Date("2024-01-25"),
    color: { from: "from-iron-300", to: "to-iron-500" },
    rarity: "Common",
    xp: 30,
    topPercentage: 85,
  },
];

// =============================================
// UNCOMMON - Jade Circuit (Verde) - 5 Conquistas
// =============================================
const uncommonAchievements: Achievement[] = [
  {
    id: "data-seed",
    title: "Semente de Dados",
    description: "A semente de dados foi plantada. Crie 5 notas no Brain Dump.",
    status: "completed",
    type: "templates",
    animation: "jade-pulse",
    icon: "Sprout",
    progress: { current: 5, total: 5, percentage: 100 },
    completedAt: new Date("2024-02-01"),
    color: { from: "from-jade-400", to: "to-jade-600" },
    rarity: "Uncommon",
    xp: 50,
    topPercentage: 60,
  },
  {
    id: "rhythm-keeper",
    title: "Guardião do Ritmo",
    description:
      "Consistência é o primeiro sinal de disciplina. Mantenha um streak de 5 dias.",
    status: "completed",
    type: "streak",
    animation: "idle-float",
    icon: "Repeat",
    progress: { current: 5, total: 5, percentage: 100 },
    completedAt: new Date("2024-02-05"),
    color: { from: "from-jade-400", to: "to-jade-600" },
    rarity: "Uncommon",
    xp: 60,
    topPercentage: 55,
  },
  {
    id: "circuit-builder",
    title: "Construtor de Circuitos",
    description: "Os circuitos se formam. Acumule 10 horas totais de foco.",
    status: "in-progress",
    type: "hours",
    animation: "jade-pulse",
    icon: "Timer",
    progress: { current: 7.5, total: 10, percentage: 75 },
    color: { from: "from-jade-300", to: "to-jade-500" },
    rarity: "Uncommon",
    xp: 75,
    topPercentage: 58,
  },
  {
    id: "link-forger",
    title: "Forjador de Links",
    description:
      "Uma mente conectada é uma mente poderosa. Conecte 1 integração externa.",
    status: "locked",
    type: "connections",
    animation: "connect-lines",
    icon: "Link",
    progress: { current: 0, total: 1, percentage: 0 },
    color: { from: "from-jade-400", to: "to-jade-700" },
    rarity: "Uncommon",
    xp: 50,
    topPercentage: 45,
  },
  {
    id: "quick-thinker",
    title: "Pensador Rápido",
    description:
      "Velocidade é uma forma de inteligência. Complete 10 tarefas em um único dia.",
    status: "completed",
    type: "speed",
    animation: "jade-pulse",
    icon: "Zap",
    progress: { current: 10, total: 10, percentage: 100 },
    completedAt: new Date("2024-02-10"),
    color: { from: "from-jade-300", to: "to-jade-600" },
    rarity: "Uncommon",
    xp: 65,
    topPercentage: 50,
  },
];

// =============================================
// RARE - Cobalt Flux (Azul) - 5 Conquistas
// =============================================
const rareAchievements: Achievement[] = [
  {
    id: "deep-diver",
    title: "Mergulhador Profundo",
    description:
      "O abismo te conhece pelo nome. Acumule 50 horas de deep work ininterrupto.",
    status: "in-progress",
    type: "hours",
    animation: "clock-spin",
    icon: "Clock",
    progress: { current: 42.5, total: 50, percentage: 85 },
    color: { from: "from-cobalt-400", to: "to-cobalt-600" },
    rarity: "Rare",
    xp: 500,
    topPercentage: 25,
  },
  {
    id: "flow-state-surfer",
    title: "Surfista de Flow",
    description:
      "Surfando as ondas da consciência. Entre em flow state 50 vezes.",
    status: "in-progress",
    type: "flow",
    animation: "flow-wave",
    icon: "Waves",
    progress: { current: 35, total: 50, percentage: 70 },
    color: { from: "from-cobalt-300", to: "to-cobalt-600" },
    rarity: "Rare",
    xp: 500,
    topPercentage: 22,
  },
  {
    id: "consistency-core",
    title: "Núcleo de Consistência",
    description:
      "O núcleo se estabiliza. 30 dias consecutivos com pelo menos 1 sessão de foco.",
    status: "in-progress",
    type: "streak",
    animation: "cobalt-ripple",
    icon: "Repeat",
    progress: { current: 18, total: 30, percentage: 60 },
    color: { from: "from-cobalt-400", to: "to-cobalt-700" },
    rarity: "Rare",
    xp: 600,
    topPercentage: 20,
  },
  {
    id: "midnight-scholar",
    title: "Erudito da Meia-Noite",
    description:
      "A lua é sua companheira de estudo. 20 horas de foco noturno (22h-4h).",
    status: "completed",
    type: "night",
    animation: "moon-glow",
    icon: "Moon",
    progress: { current: 20, total: 20, percentage: 100 },
    completedAt: new Date("2024-02-15"),
    color: { from: "from-cobalt-500", to: "to-cobalt-800" },
    rarity: "Rare",
    xp: 750,
    topPercentage: 18,
  },
  {
    id: "template-artisan",
    title: "Artesão de Templates",
    description:
      "A arte da estrutura. Crie 10 templates de workflow personalizados.",
    status: "locked",
    type: "templates",
    animation: "build-glow",
    icon: "LayoutTemplate",
    progress: { current: 3, total: 10, percentage: 30 },
    color: { from: "from-cobalt-400", to: "to-cobalt-600" },
    rarity: "Rare",
    xp: 450,
    topPercentage: 28,
  },
];

// =============================================
// EPIC - Void Amethyst (Roxo) - 4 Conquistas
// =============================================
const epicAchievements: Achievement[] = [
  {
    id: "neural-architect",
    title: "Arquiteto Neural",
    description:
      "O arquiteto do vazio. Crie 50 templates que foram usados por outros usuários.",
    status: "locked",
    type: "templates",
    animation: "void-particles",
    icon: "Gem",
    progress: { current: 0, total: 50, percentage: 0 },
    color: { from: "from-void-400", to: "to-void-600" },
    rarity: "Epic",
    xp: 1000,
    topPercentage: 8,
  },
  {
    id: "centurion",
    title: "Centurião",
    description:
      "100 dias. 100 batalhas. Nenhuma falha. Mantenha um streak perfeito de 100 dias.",
    status: "in-progress",
    type: "streak",
    animation: "shimmer-sweep",
    icon: "Shield",
    progress: { current: 45, total: 100, percentage: 45 },
    color: { from: "from-void-300", to: "to-void-600" },
    rarity: "Epic",
    xp: 1500,
    topPercentage: 5,
  },
  {
    id: "dimensional-scholar",
    title: "Erudito Dimensional",
    description:
      "O tempo se dobra para quem estuda. 100 horas de deep work acumuladas.",
    status: "in-progress",
    type: "hours",
    animation: "clock-spin",
    icon: "Hourglass",
    progress: { current: 67, total: 100, percentage: 67 },
    color: { from: "from-void-400", to: "to-void-700" },
    rarity: "Epic",
    xp: 1200,
    topPercentage: 6,
  },
  {
    id: "hive-mind",
    title: "Mente Colmeia",
    description:
      "Todas as sinapses conectadas. Conecte 5 integrações externas.",
    status: "locked",
    type: "connections",
    animation: "connect-lines",
    icon: "BrainCircuit",
    progress: { current: 1, total: 5, percentage: 20 },
    color: { from: "from-void-400", to: "to-void-600" },
    rarity: "Epic",
    xp: 800,
    topPercentage: 10,
  },
];

// =============================================
// LEGENDARY - Solar Flare (Dourado) - 3 Conquistas
// =============================================
const legendaryAchievements: Achievement[] = [
  {
    id: "neural-mastermind",
    title: "O Mestre Neural",
    description:
      "Dominação cognitiva total. Complete TODOS os achievements core de todos os tiers.",
    status: "locked",
    type: "milestone",
    animation: "solar-flare",
    icon: "Crown",
    progress: { current: 12, total: 22, percentage: 55 },
    color: { from: "from-solar-300", to: "to-solar-600" },
    rarity: "Legendary",
    xp: 5000,
    topPercentage: 1,
  },
  {
    id: "immortal-flame",
    title: "Chama Imortal",
    description:
      "A chama que nunca apaga. 365 dias consecutivos de foco. Um ano inteiro.",
    status: "in-progress",
    type: "streak",
    animation: "flame-rise",
    icon: "Flame",
    progress: { current: 127, total: 365, percentage: 35 },
    color: { from: "from-solar-300", to: "to-solar-700" },
    rarity: "Legendary",
    xp: 3000,
    topPercentage: 2,
  },
  {
    id: "architect-of-worlds",
    title: "Arquiteto de Mundos",
    description:
      "O universo se molda à sua vontade. 500 horas de foco total e 100 templates criados.",
    status: "locked",
    type: "milestone",
    animation: "golden-particles",
    icon: "Orbit",
    progress: { current: 67, total: 500, percentage: 13 },
    color: { from: "from-solar-300", to: "to-solar-600" },
    rarity: "Legendary",
    xp: 5000,
    topPercentage: 1,
  },
];

// =============================================
// Export all achievements
// =============================================
export const mockAchievements: Achievement[] = [
  ...commonAchievements,
  ...uncommonAchievements,
  ...rareAchievements,
  ...epicAchievements,
  ...legendaryAchievements,
];

// Calculate total XP from completed achievements
export const calculateTotalXP = (achievements: Achievement[]): number => {
  return achievements
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + a.xp, 0);
};

// Export stats
export const totalFocusPoints = calculateTotalXP(mockAchievements);
export const overallProgress = Math.round(
  (mockAchievements.filter((a) => a.status === "completed").length /
    mockAchievements.length) *
    100,
);
export const ultimateGoalProgress = {
  completed: mockAchievements.filter((a) => a.status === "completed").length,
  total: mockAchievements.length,
  percentage: overallProgress,
};

// Rarity labels in Portuguese
export const rarityLabels: Record<string, string> = {
  common: "Comum",
  uncommon: "Incomum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

// Rarity colors for UI
export const rarityColors: Record<
  string,
  { bg: string; text: string; border: string; glow: string }
> = {
  common: {
    bg: "bg-iron-500/10",
    text: "text-iron-400",
    border: "border-iron-500/20",
    glow: "shadow-[0_0_20px_oklch(0.6_0.03_270/0.2)]",
  },
  uncommon: {
    bg: "bg-jade-500/10",
    text: "text-jade-400",
    border: "border-jade-500/20",
    glow: "shadow-[0_0_20px_oklch(0.59_0.1_148/0.2)]",
  },
  rare: {
    bg: "bg-cobalt-500/10",
    text: "text-cobalt-400",
    border: "border-cobalt-500/20",
    glow: "shadow-[0_0_20px_oklch(0.58_0.115_238/0.3)]",
  },
  epic: {
    bg: "bg-void-500/10",
    text: "text-void-400",
    border: "border-void-500/20",
    glow: "shadow-[0_0_25px_oklch(0.57_0.125_288/0.35)]",
  },
  legendary: {
    bg: "bg-solar-500/15",
    text: "text-solar-400",
    border: "border-solar-500/30",
    glow: "shadow-[0_0_35px_oklch(0.76_0.155_65/0.4)]",
  },
};
