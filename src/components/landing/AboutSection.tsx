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
            className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
            style={{
              textShadow:
                "0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(99, 102, 241, 0.4)",
            }}
          >
            About Polaris
          </h2>
          <p className="text-indigo-200/70 text-lg font-light tracking-wide font-mono max-w-2xl mt-4">
            Built for developers, by developers. Engineered for deep focus and
            maximum productivity.
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
            <h3 className="text-white text-2xl font-bold">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed">
              In a world full of distractions, Polaris serves as your North
              Star—guiding you toward sustained focus and meaningful
              productivity. We believe that the best work happens when you can
              enter a state of deep flow.
            </p>

            <h3 className="text-white text-2xl font-bold pt-4">Why Polaris?</h3>
            <ul className="space-y-3">
              {[
                "Designed specifically for knowledge workers and developers",
                "Minimalist interface that eliminates cognitive overhead",
                "Built with modern web technologies for speed and reliability",
                "Privacy-first approach—your data stays yours",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-gray-300 flex items-start gap-3"
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
            className="bg-[rgba(26,25,48,0.3)] backdrop-blur-[8px] border border-[rgba(255,255,255,0.1)] p-8 rounded-3xl"
          >
            <h3 className="text-white text-xl font-bold mb-6">By the Numbers</h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {[
                { label: "Active Users", value: "2,000+" },
                { label: "Focus Minutes", value: "50M+" },
                { label: "Uptime", value: "99.9%", color: "text-white" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div
                    className={`text-3xl font-black ${
                      stat.color || "text-primary"
                    } mb-1`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm font-mono">
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

