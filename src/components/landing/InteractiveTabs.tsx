"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDemo,
  KanbanDemo,
  QuickLinksDemo,
  MusicDemo,
  MatrixDemo,
} from "./DemoWidgets";
import { SkeletonWidget } from "@/components/ui/polaris-skeleton";

const TABS = [
  {
    id: "calendar",
    label: "Calendário",
    title: "Planeje visualmente",
    description:
      "Visualize prazos e sua semana de forma clara. Planeje blocos de foco em minutos.",
    features: [
      "Visão semanal e mensal",
      "Blocos de tempo",
      "Planejamento rápido",
    ],
  },
  {
    id: "tasks",
    label: "Tarefas",
    title: "Gestão Ágil (Kanban)",
    description:
      "Organize projetos e tarefas diárias em um fluxo visual simples e direto.",
    features: [
      "Colunas flexíveis",
      "Arrastar e soltar",
      "Prioridades visíveis",
    ],
  },
  {
    id: "links",
    label: "Links Rápidos",
    title: "Tudo a um clique",
    description:
      "Centralize recursos, documentações e sites mais usados sem abrir novas abas.",
    features: [
      "Categorias personalizáveis",
      "Acesso rápido",
      "Tudo em um painel",
    ],
  },
  {
    id: "music",
    label: "Música",
    title: "Imersão Sonora",
    description:
      "Player integrado para tocar playlists de foco ou sons ambientes sem sair do Axis.",
    features: [
      "Controles rápidos",
      "Ambientes sonoros",
      "Foco sem interrupções",
    ],
  },
  {
    id: "matrix",
    label: "Matriz Eisenhower",
    title: "Priorização Real",
    description:
      "Separe tarefas entre Urgente e Importante para focar no que realmente importa.",
    features: [
      "Quadrantes de Foco",
      "Decisão mais rápida",
      "Prioridades claras",
    ],
  },
];

const WidgetRenderer = ({ id }: { id: string }) => {
  switch (id) {
    case "calendar":
      return <CalendarDemo />;
    case "tasks":
      return <KanbanDemo />;
    case "links":
      return <QuickLinksDemo />;
    case "music":
      return <MusicDemo />;
    case "matrix":
      return <MatrixDemo />;
    default:
      return null;
  }
};

export const InteractiveTabs = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (tab: (typeof TABS)[0]) => {
    if (tab.id === activeTab.id) return;
    setIsLoading(true);
    // Simulate loading delay for smoother UX perception
    setTimeout(() => {
      setActiveTab(tab);
      setIsLoading(false);
    }, 150);
  };

  return (
    <section className="w-full py-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
        <div className="text-center space-y-4">
          <h2 className="text-foreground text-3xl md:text-5xl font-bold tracking-tight">
            Múltiplas visões, um só lugar.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Escolha a visão certa para cada tarefa. Axis se adapta ao seu ritmo,
            não o contrário.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap justify-center gap-2 p-1 bg-muted/50 rounded-full border border-border">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab.id === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Display */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-12 items-center mt-8">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4 text-center lg:text-left"
              >
                <h3 className="text-foreground text-2xl md:text-3xl font-bold">
                  {activeTab.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {activeTab.description}
                </p>
                <ul className="space-y-3 pt-4">
                  {activeTab.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 text-foreground/80 justify-center lg:justify-start"
                    >
                      <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="size-2 rounded-full bg-primary" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-3 w-full h-full min-h-[400px]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-border shadow-lg bg-card flex items-center justify-center"
                >
                  <SkeletonWidget
                    skeletonVariant="landing"
                    className="w-full h-full min-h-[400px]"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-border shadow-lg bg-card flex items-center justify-center"
                >
                  <WidgetRenderer id={activeTab.id} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
