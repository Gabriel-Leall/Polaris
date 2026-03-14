"use client";

import { Calendar, Edit3, BarChart2, Target, Zap, Award } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Smart Calendar",
    description: "Visualize your schedule and time-block your most important work.",
    widget: (
      <div className="mt-6 bg-secondary/50 rounded-xl p-3 border border-border">
        <div className="flex items-center gap-3">
          <div className="w-1 h-10 bg-primary rounded-full"></div>
          <div>
            <div className="text-sm font-medium text-foreground">Deep Work</div>
            <div className="text-xs text-muted-foreground">09:00 - 11:30</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <Edit3 className="w-6 h-6" />,
    title: "Quick Notes",
    description: "Capture ideas instantly without breaking your flow.",
    widget: (
      <div className="mt-6 bg-secondary/50 rounded-xl p-4 border border-border">
        <div className="text-sm font-medium text-foreground mb-2">
          Meeting Notes
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-border rounded w-full"></div>
          <div className="h-2 bg-border rounded w-4/5"></div>
        </div>
      </div>
    ),
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: "Progress Analytics",
    description: "Track your productivity trends and celebrate wins.",
    widget: (
      <div className="mt-6 flex items-end gap-2 h-16">
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "33%" }}
          className="w-full bg-border rounded-t-md"
        ></motion.div>
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "50%" }}
          transition={{ delay: 0.1 }}
          className="w-full bg-border rounded-t-md"
        ></motion.div>
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "66%" }}
          transition={{ delay: 0.2 }}
          className="w-full bg-border rounded-t-md"
        ></motion.div>
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          transition={{ delay: 0.3 }}
          className="w-full bg-primary rounded-t-md"
        ></motion.div>
      </div>
    ),
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Goal Setting",
    description: "Set clear objectives and track progress towards your goals.",
    widget: (
      <div className="mt-6 bg-secondary/50 rounded-xl p-4 border border-border">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-foreground">Q3 OKRs</span>
          <span className="text-muted-foreground">65%</span>
        </div>
        <div className="w-full bg-border h-2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "65%" }}
            transition={{ duration: 1 }}
            className="bg-primary w-[65%] h-full rounded-full"
          ></motion.div>
        </div>
      </div>
    ),
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Focus Mode",
    description: "Block distractions and enter deep work state.",
    widget: (
      <div className="mt-6 text-center">
        <div className="text-3xl font-bold text-foreground tracking-tight">
          47:32
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
          Focus Time Active
        </div>
      </div>
    ),
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Achievements",
    description: "Unlock badges and celebrate your productivity milestones.",
    widget: (
      <div className="mt-6 flex justify-center gap-4">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border-2 border-border">
          <Award className="w-5 h-5 text-muted-foreground" />
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30 shadow-sm cursor-pointer"
        >
          <Award className="w-6 h-6 text-primary" />
        </motion.div>
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border-2 border-border">
          <Award className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    ),
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-background transition-colors duration-300"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Stay Focused
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful widgets that work together to supercharge your productivity.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden"
            >
              <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                style={{
                  background:
                    "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), oklch(var(--primary) / 0.15), transparent 40%)",
                }}
              />
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-foreground mb-6 border border-border">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-8 flex-1">
                  {feature.description}
                </p>
                <div className="mt-auto">{feature.widget}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}