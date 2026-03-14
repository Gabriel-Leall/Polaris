"use client";

import { BarChart3, Trophy, Flame, CheckSquare } from "lucide-react";
import { motion } from "motion/react";

export function Analytics() {
  return (
    <section
      id="analytics"
      className="py-24 bg-background transition-colors duration-300"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
            <BarChart3 className="w-4 h-4" />
            Analytics & Details
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Track Your Progress
          </h2>
          <p className="text-lg text-muted-foreground">
            Gain insights into your productivity patterns and level up your
            performance.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-card p-8 rounded-3xl border border-border shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-foreground">Weekly Focus Time</h3>
              <select className="bg-secondary border border-border text-foreground text-sm rounded-lg px-3 py-1.5 outline-none cursor-pointer">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {[40, 60, 45, 80, 55, 90, 30].map((h, i) => (
                <div
                  key={i}
                  className="w-full flex flex-col items-center gap-3 group h-full justify-end"
                >
                  <div className="w-full relative overflow-hidden h-[85%] rounded-xl bg-secondary/35 border border-border/40">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                      style={{ height: `${h}%`, transformOrigin: "bottom" }}
                      className={`absolute inset-x-0 bottom-0 rounded-t-xl transition-colors duration-300 ${
                        i === 5
                          ? "bg-primary"
                          : "bg-[oklch(var(--muted-foreground)/0.40)]"
                      }`}
                    ></motion.div>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium uppercase">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card p-8 rounded-3xl border border-border shadow-sm flex flex-col items-center justify-center text-center"
          >
            <h3 className="font-bold text-foreground w-full text-left mb-8">
              Your Level
            </h3>
            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  className="stroke-border"
                  strokeWidth="8"
                />
                <motion.circle
                  initial={{ strokeDashoffset: 283 }}
                  whileInView={{ strokeDashoffset: 70 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  className="stroke-primary"
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-foreground">24</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              2,450 XP
            </div>
            <div className="text-sm text-muted-foreground mb-8">
              Top 5% of users
            </div>

            <div className="w-full space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tasks completed</span>
                <span className="font-bold text-foreground">127</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Focus hours</span>
                <span className="font-bold text-foreground">42.5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current streak</span>
                <span className="font-bold text-foreground">12</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Trophy className="w-5 h-5 text-amber-500" />,
              iconBg: "bg-amber-500/10",
              iconLg: <Trophy className="w-6 h-6 text-amber-500" />,
              title: "Achievements",
              value: "18",
              desc: "Unlocked this month",
            },
            {
              icon: <Flame className="w-5 h-5 text-primary" />,
              iconBg: "bg-primary/10",
              iconLg: <Flame className="w-6 h-6 text-primary" />,
              title: "Longest Streak",
              value: "12 days",
              desc: "Keep it going!",
            },
            {
              icon: <CheckSquare className="w-5 h-5 text-emerald-500" />,
              iconBg: "bg-emerald-500/10",
              iconLg: <CheckSquare className="w-6 h-6 text-emerald-500" />,
              title: "Tasks",
              value: "34",
              desc: "Completed this week",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between cursor-pointer overflow-hidden"
            >
              <div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                style={{
                  background:
                    "radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), oklch(var(--primary) / 0.15), transparent 40%)",
                }}
              />
              <div className="relative z-10 flex items-center justify-between w-full">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {stat.icon}
                    <span className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.desc}
                  </div>
                </div>
                <div
                  className={`w-12 h-12 rounded-full ${stat.iconBg} flex items-center justify-center`}
                >
                  {stat.iconLg}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}