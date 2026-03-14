"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { BlurFade, ThemeHighlight } from "@/components/ui";
import { LandingAnimatedWidget } from "@/components/landing/AnimationLandingPage";

export function Hero() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden transition-colors duration-300">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="max-w-2xl">
            <BlurFade
              delay={0.08}
              duration={0.55}
              blur="10px"
              offset={14}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary"></span>
              Personal Productivity OS
            </BlurFade>
            <BlurFade
              delay={0.16}
              duration={0.65}
              blur="12px"
              offset={18}
              className="block"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                Your{" "}
                <ThemeHighlight
                  className="text-primary"
                  animateSweep
                  sweepDelay={0.34}
                  sweepDuration={0.95}
                >
                  Focus.
                </ThemeHighlight>
                <br />
                Amplified.
              </h1>
            </BlurFade>
            <BlurFade
              delay={0.24}
              duration={0.6}
              blur="10px"
              offset={16}
              className="block"
            >
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Transform scattered tasks into focused achievements. Build
                habits, manage time, and level up your productivity game.
              </p>
            </BlurFade>
            <BlurFade
              delay={0.32}
              duration={0.65}
              blur="10px"
              offset={16}
              className="flex flex-col sm:flex-row items-center gap-4 mb-10"
            >
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary-hover transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                Start Free Trial
              </Link>
            </BlurFade>
            <BlurFade
              delay={0.42}
              duration={0.55}
              blur="8px"
              offset={10}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-3">
                {[
                  "https://picsum.photos/seed/jd/100/100",
                  "https://picsum.photos/seed/as/100/100",
                  "https://picsum.photos/seed/mk/100/100",
                  "https://picsum.photos/seed/tr/100/100",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background overflow-hidden relative bg-secondary"
                  >
                    <Image
                      src={src}
                      alt="User avatar"
                      fill
                      sizes="40px"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">10,000+</span> users
                <br />
                boosting their focus
              </div>
            </BlurFade>
          </div>

          {/* Right Animation Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 0, rotateZ: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative perspective-[2000px] mt-12 lg:mt-0"
          >
            <div className="flex items-center justify-center w-full">
              <LandingAnimatedWidget />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
