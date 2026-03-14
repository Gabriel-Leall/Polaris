"use client";

import {
  Github,
  Slack,
  Calendar as CalendarIcon,
  ArrowRight,
  Activity,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

export function Integrations() {
  return (
    <section
      id="integrations"
      className="py-24 bg-secondary/30 transition-colors duration-300"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-foreground text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-muted-foreground"></span>
              Integrations & Insights
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Connect & Improve
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              Seamlessly integrate with your tools and get AI-driven insights to
              boost your productivity.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: <Github className="w-6 h-6" />,
                  name: "GitHub",
                  desc: "Track commits and pull requests",
                },
                {
                  icon: <Slack className="w-6 h-6" />,
                  name: "Slack",
                  desc: "Sync statuses and receive updates",
                },
                {
                  icon: <CalendarIcon className="w-6 h-6" />,
                  name: "Google Calendar",
                  desc: "Sync your schedule automatically",
                },
              ].map((integration, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border shadow-sm hover:border-primary/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-foreground">
                      {integration.icon}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">
                        {integration.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {integration.desc}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-3xl transform -rotate-3 scale-105 -z-10 blur-2xl opacity-50"></div>

            <div className="space-y-6">
              <motion.div
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                  e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                }}
                whileHover={{ y: -5 }}
                className="group relative bg-card p-6 rounded-3xl shadow-sm border border-border overflow-hidden"
              >
                <div
                  className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                  style={{
                    background:
                      "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), oklch(var(--primary) / 0.15), transparent 40%)",
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="font-bold text-foreground">Recent Activity</div>
                    <Activity className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-6">
                    <div className="flex gap-4 relative">
                      <div className="absolute left-2.5 top-8 bottom-[-24px] w-[2px] bg-border"></div>
                      <div className="w-5 h-5 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center shrink-0 z-10 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          Pushed to main branch
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          10 minutes ago
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 relative">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border-2 border-card flex items-center justify-center shrink-0 z-10 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          Created new pull request
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          1 hour ago
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                  e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                }}
                whileHover={{ y: -5 }}
                className="group relative bg-card p-6 rounded-3xl shadow-sm border border-primary/30 overflow-hidden"
              >
                <div
                  className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
                  style={{
                    background:
                      "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), oklch(var(--primary) / 0.15), transparent 40%)",
                  }}
                />
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="font-bold text-foreground flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    Productivity Insights
                  </div>
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-4 relative z-10">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You&apos;ve been distracted by emails during your{" "}
                    <span className="font-medium text-foreground">
                      Deep Work
                    </span>{" "}
                    blocks. Try muting notifications between 09:00 and 11:30 to
                    improve focus by an estimated{" "}
                    <span className="font-bold text-primary">24%</span>.
                  </p>
                  <button className="w-full py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl text-sm font-medium transition-colors cursor-pointer">
                    Apply Focus Rule
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}