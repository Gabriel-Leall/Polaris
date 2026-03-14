import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "tasks" | "habits" | "pomodoro";

const PHASE_DURATIONS: Record<Phase, number> = {
  tasks: 7500,
  habits: 8000,
  pomodoro: 9000,
};

const PHASES: Phase[] = ["tasks", "habits", "pomodoro"];

const TASKS = [
  { id: 1, label: "Design system components" },
  { id: 2, label: "Review pull requests" },
  { id: 3, label: "Write weekly notes" },
  { id: 4, label: "Plan next sprint" },
];

const HABITS = [
  { id: 1, label: "Estudar", emoji: "📚" },
  { id: 2, label: "Treinar", emoji: "💪" },
  { id: 3, label: "Dormir", emoji: "😴" },
  { id: 4, label: "Tomar 2L d'água", emoji: "💧" },
];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function CheckIcon({
  checked,
  color = "#d4a017",
}: {
  checked: boolean;
  color?: string;
}) {
  return (
    <div
      style={{ "--accent": color } as React.CSSProperties}
      className={`h-[18px] w-[18px] shrink-0 rounded-[4px] border-2 flex items-center justify-center transition-all ${
        checked
          ? "border-[color:var(--accent)] bg-[color:var(--accent)]"
          : "border-white/20 bg-transparent"
      }`}
    >
      {checked && (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="#000"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

function TaskWidget() {
  const [shownCount, setShownCount] = useState(0);
  const [checkedCount, setCheckedCount] = useState(0);
  const [done, setDone] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const runAnimation = async () => {
      for (let i = 1; i <= TASKS.length; i++) {
        await sleep(500);
        if (!isMounted.current) return;
        setShownCount(i);
      }
      await sleep(600);
      for (let i = 1; i <= TASKS.length; i++) {
        if (!isMounted.current) return;
        setCheckedCount(i);
        await sleep(400);
      }
      await sleep(200);
      if (isMounted.current) setDone(true);
    };

    runAnimation();
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div className="w-[320px] rounded-xl border border-white/10 bg-neutral-900/95 p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">
          Task Control
        </span>
        <span className="text-[11px] font-semibold text-amber-400">
          {checkedCount}/{shownCount} done
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {TASKS.map((task, index) => {
          const isShown = index < shownCount;
          const isChecked = index < checkedCount;

          return (
            <div
              key={task.id}
              className={`flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/5 px-3 py-2 transition-all duration-300 ${
                isShown
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-3"
              }`}
            >
              <CheckIcon checked={isChecked} />
              <span
                className={`text-[13px] transition-all ${isChecked ? "line-through text-white/30" : "text-white/85"}`}
              >
                {task.label}
              </span>
            </div>
          );
        })}
      </div>

      {done && (
        <div className="mt-3.5 rounded-lg border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-center text-[12px] text-amber-400 animate-fade-in">
          ✓ All tasks completed
        </div>
      )}
    </div>
  );
}

function HabitWidget() {
  const [shownCount, setShownCount] = useState(0);
  const [checkedCount, setCheckedCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const runAnimation = async () => {
      for (let i = 1; i <= HABITS.length; i++) {
        await sleep(450);
        if (!isMounted.current) return;
        setShownCount(i);
      }
      await sleep(500);
      for (let i = 1; i <= HABITS.length; i++) {
        await sleep(450);
        if (!isMounted.current) return;
        setCheckedCount(i);
        setProgress(Math.round((i / HABITS.length) * 100));
      }
    };

    runAnimation();
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <div className="w-[320px] rounded-xl border border-white/10 bg-neutral-900/95 p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">
          Protocol Habits
        </span>
        <span className="text-[11px] font-semibold text-amber-400">
          {progress}%
        </span>
      </div>

      <div className="mb-3.5 flex flex-col gap-2">
        {HABITS.map((habit, index) => {
          const isShown = index < shownCount;
          const isChecked = index < checkedCount;

          return (
            <div
              key={habit.id}
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 transition-all duration-300 ${
                isShown
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              } ${isChecked ? "border-amber-400/20 bg-amber-400/10" : "border-white/5 bg-white/5"}`}
            >
              <CheckIcon checked={isChecked} />
              <span
                className={`text-[13px] transition-all ${isChecked ? "line-through text-white/50" : "text-white/85"}`}
              >
                {habit.label}
              </span>
              <span className="ml-auto text-[14px]">{habit.emoji}</span>
            </div>
          );
        })}
      </div>

      <div>
        <div className="mb-1.5 flex justify-between text-[11px] text-white/35">
          <span>Protocol Progress</span>
          <span>
            {checkedCount}/{HABITS.length} completed
          </span>
        </div>
        <div className="h-1 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300 transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function PomodoroWidget() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const startTimer = async () => {
      await sleep(1200);
      if (isMounted.current) setRunning(true);
    };
    startTimer();
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const totalSecs = 25 * 60;
  const progress = ((totalSecs - seconds) / totalSecs) * 100;
  const ringSize = 160;
  const ringCenter = ringSize / 2;
  const ringRadius = 66;
  const circumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-[320px] rounded-xl border border-white/10 bg-neutral-900/95 px-6 py-7 flex flex-col items-center gap-5">
      <div className="flex w-full items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">
          Zen System
        </span>
        <div className="flex gap-2 text-[10px]">
          <span className="rounded bg-amber-400/10 px-2 py-0.5 font-semibold text-amber-400">
            ZEN
          </span>
          <span className="px-2 py-0.5 text-white/30">OFF</span>
        </div>
      </div>

      <div className="flex w-full flex-col items-center">
        <div className="relative grid h-40 w-40 place-items-center">
          <svg
            width={ringSize}
            height={ringSize}
            viewBox={`0 0 ${ringSize} ${ringSize}`}
            className="pointer-events-none absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 -rotate-90"
          >
            <circle
              cx={ringCenter}
              cy={ringCenter}
              r={ringRadius}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="6"
            />
            <circle
              cx={ringCenter}
              cy={ringCenter}
              r={ringRadius}
              fill="none"
              stroke="#d4a017"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.1s linear" }}
            />
          </svg>
          <div className="z-10 flex flex-col items-center justify-center text-center">
            <span className="text-[34px] leading-none font-extrabold tracking-[-0.03em] text-amber-400 tabular-nums">
              {timeStr}
            </span>
            <span className="mt-1.5 text-[10px] leading-none text-white/30">
              {running ? "focando..." : "pronto"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setRunning(!running)}
          className="mt-4 grid h-11 w-11 place-items-center rounded-full bg-amber-400 shadow-[0_0_20px_rgba(212,160,23,0.35)]"
          aria-label={running ? "Pausar timer" : "Iniciar timer"}
        >
          {running ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="#000"
              aria-hidden
            >
              <rect x="2" y="1" width="4" height="12" rx="1" />
              <rect x="8" y="1" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="#000"
              aria-hidden
            >
              <polygon points="3,1 11,7 3,13" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex w-full items-center justify-center gap-4 text-[11px] text-white/30">
        <span>
          CYCLE <strong className="text-white/60">1/1</strong>
        </span>
        <span className="text-white/20">|</span>
        <span>
          ZEN{" "}
          <strong className={running ? "text-amber-400" : "text-white/30"}>
            {running ? "ON" : "OFF"}
          </strong>
        </span>
      </div>
    </div>
  );
}

export function LandingAnimatedWidget() {
  const [phase, setPhase] = useState<Phase>("tasks");

  useEffect(() => {
    const duration = PHASE_DURATIONS[phase];
    const timer = setTimeout(() => {
      setPhase((prev) => {
        const currentIndex = PHASES.indexOf(prev);
        return PHASES[(currentIndex + 1) % PHASES.length];
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [phase]);

  const phaseLabel: Record<Phase, string> = {
    tasks: "Task Control",
    habits: "Protocol Habits",
    pomodoro: "Zen System",
  };

  const widgetVariants = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 },
  };

  return (
    <div className="relative flex min-h-[460px] flex-col items-center justify-center">
      <div className="mb-6 flex gap-1.5">
        {PHASES.map((p) => (
          <div
            key={p}
            className={`h-1.5 rounded-full transition-all ${phase === p ? "w-5 bg-amber-400" : "w-1.5 bg-white/15"}`}
          />
        ))}
      </div>

      <div>
        <AnimatePresence mode="wait">
          {phase === "tasks" && (
            <motion.div
              key="tasks"
              variants={widgetVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <TaskWidget />
            </motion.div>
          )}
          {phase === "habits" && (
            <motion.div
              key="habits"
              variants={widgetVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <HabitWidget />
            </motion.div>
          )}
          {phase === "pomodoro" && (
            <motion.div
              key="pomodoro"
              variants={widgetVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <PomodoroWidget />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-5 text-[11px] uppercase tracking-[0.08em] text-white/25"
        >
          {phaseLabel[phase]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function LandingPageAnimated() {

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <nav className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-neutral-950/85 px-8 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-[12px] font-bold text-black">
            A
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.01em]">
            Axis
          </span>
        </div>
        <div className="flex gap-8 text-[13.5px] text-white/65">
          <a href="#" className="hover:text-white">
            Features
          </a>
          <a href="#" className="hover:text-white">
            Integrations
          </a>
          <a href="#" className="hover:text-white">
            Analytics
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" className="text-white/50">
            ☽
          </button>
          <a href="#" className="text-[13.5px] text-white/70">
            Sign In
          </a>
          <button
            type="button"
            className="rounded-md bg-amber-400 px-4 py-1.5 text-[13.5px] font-semibold text-black"
          >
            Get Started
          </button>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-56px)] max-w-[1160px] grid-cols-2 items-center gap-8 px-8">
        <div>
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/15 px-3 py-1 text-[12px] text-amber-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Personal Productivity OS
          </div>
          <h1 className="mb-5 text-[clamp(2.6rem,4.5vw,3.8rem)] font-extrabold leading-[1.08] tracking-[-0.035em]">
            Your{" "}
            <span className="inline-block rounded-md bg-amber-400 px-2.5 text-black">
              Focus.
            </span>
            <br />
            Amplified.
          </h1>
          <p className="mb-8 max-w-[340px] text-[15px] leading-[1.65] text-white/55">
            Transform scattered tasks into focused achievements. Build habits,
            manage time, and level up your productivity game.
          </p>
          <button
            type="button"
            className="mb-8 rounded-lg bg-amber-400 px-6 py-3 text-[14.5px] font-bold text-black"
          >
            Start Free Trial
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex">
              {["#e08", "#a0f", "#08f", "#0c8", "#fa0"].map((color, i) => (
                <div
                  key={i}
                  className={`-ml-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-neutral-950 text-[10px] font-bold text-white ${i === 0 ? "ml-0" : ""}`}
                  style={{ background: color }}
                >
                  {["J", "M", "A", "L", "K"][i]}
                </div>
              ))}
            </div>
            <div className="text-[13px]">
              <span className="font-bold">10,000+</span>{" "}
              <span className="text-white/50">users boosting their focus</span>
            </div>
          </div>
        </div>

        <LandingAnimatedWidget />
      </section>
    </div>
  );
}
