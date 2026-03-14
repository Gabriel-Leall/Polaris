"use client";

import { Target, Twitter, Github, Linkedin } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export function Footer() {
  return (
    <footer className="bg-background text-muted-foreground py-16 border-t border-border transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="col-span-2 lg:col-span-2"
          >
            <div className="flex items-center gap-2 mb-6 text-foreground">
              <Target className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">Axis</span>
            </div>
            <p className="mb-6 max-w-xs">
              Transforming scattered tasks into focused achievements. Your
              personal productivity OS.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {[
            {
              title: "Product",
              links: ["Features", "Integrations", "Pricing", "Changelog"],
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Blog", "Contact"],
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
            },
          ].map((col, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (idx + 1) }}
            >
              <h4 className="text-foreground font-semibold mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3 text-sm">
                {col.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="pt-8 border-t border-border text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center"
        >
          <p>&copy; {new Date().getFullYear()} Axis Inc. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All systems operational
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}