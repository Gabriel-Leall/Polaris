"use client";

import { motion } from "motion/react";

export const AboutSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="@container w-full py-20" id="about">
      <div className="flex flex-col items-center justify-center gap-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-4xl md:text-5xl font-black leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
            style={{
              textShadow:
                "0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(99, 102, 241, 0.4)",
            }}
          >
            Sobre o Axis
          </h2>
          <p className="text-muted-foreground text-lg font-light tracking-wide font-mono max-w-2xl mt-4">
            Criado para trabalho profundo, com foco real e execução contínua.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-left space-y-6"
          >
            <h3 className="text-foreground text-2xl font-bold">Nossa missão</h3>
            <p className="text-muted-foreground leading-relaxed">
              Em um mundo cheio de distrações, o Axis existe para manter você no
              fluxo. Acreditamos que o melhor trabalho acontece quando o foco
              encontra contexto e clareza.
            </p>

            <h3 className="text-foreground text-2xl font-bold pt-4">
              Por que Axis?
            </h3>
            <ul className="space-y-3">
              {[
                "Feito para trabalho profundo e decisões rápidas",
                "Interface limpa para reduzir ruído mental",
                "Ferramentas integradas para manter o contexto",
                "Privacidade em primeiro lugar, do jeito certo",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-muted-foreground flex items-start gap-3"
                >
                  <span className="text-primary mt-1">→</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right Content - Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-card/30 backdrop-blur-[8px] border border-border p-8 rounded-3xl"
          >
            <h3 className="text-foreground text-xl font-bold mb-6">
              O que guia o Axis
            </h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {[
                { label: "Clareza no dia a dia", value: "Foco" },
                { label: "Ritmo sustentável", value: "Constância" },
                { label: "Dados sob seu controle", value: "Confiança" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="text-3xl font-black text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm font-mono">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
