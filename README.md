# 🌌 Polaris

![Project Banner](public/banner-placeholder.png)

<!-- (DICA: Coloque aqui um print bem largo e bonito do Dashboard) -->

> **Align your productivity vectors. Enter your flow state.**

Polaris is a high-fidelity **Productivity Command Center** designed for developers, creators, and deep workers. It replaces the chaos of browser tabs with a unified, "Deep Midnight" dashboard that combines task management, habit tracking, and focus tools into a single, no-scroll interface.

---

## ✨ The Philosophy

Modern work is distracting. We switch contexts every 3 minutes.
**Polaris** was built to solve this by providing a local-first, privacy-focused environment that encourages:

- **Deep Work:** Via the integrated Zen Mode.
- **Intentionality:** Through the Bento Grid layout.
- **Consistency:** With the visual Habit Tracker.

---

## 🚀 Key Features

### 🎯 The Command Center

- **Bento Grid Architecture:** A rigid 3-column layout designed to fit 100vh. No infinite scrolling. Everything you need is at eye level.
- **Zen Timer:** A built-in Pomodoro focus tool that dims distractions when activated.
- **Brain Dump:** A markdown-supported scratchpad that acts as a temporary buffer for your thoughts.

### ⚡ Smart Widgets

- **My Tasks:** A kanban-style list for immediate execution.
- **Habit Tracker:** Visual streak tracking to build consistency.
- **Media Hub:** Integrated focus sounds (Rain, Lofi, White Noise).
- **Quick Links:** Fast access to your most used tools (GitHub, Figma, etc).

---

## 🛠️ Tech Stack

Built with the bleeding edge of the React ecosystem, focusing on performance and type safety.

- **Core:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Runtime:** [Bun](https://bun.sh/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + Custom "Deep Midnight" Design System
- **State:** [Zustand](https://github.com/pmndrs/zustand) (Global Client State)
- **Backend:** [Supabase](https://supabase.com/) (Auth & Database)
- **Components:** [Radix UI](https://www.radix-ui.com/) (Headless Primitives)

---

## 📸 Gallery

<!-- Coloque aqui 2 ou 3 prints: Um do Dashboard, um do Zen Mode ativo, um do Mobile -->

|            Dashboard Overview             |         Zen Mode Active          |
| :---------------------------------------: | :------------------------------: |
| ![Dashboard](public/dashboard-screen.png) | ![Zen Mode](public/zen-mode.png) |

---

## 🏗️ Architecture & Design

Polaris follows a strict **Widget-Based Architecture**. Each section of the grid is an isolated component managed by a global store, ensuring performance even with complex state updates.

The UI implements the **"Deep Midnight"** theme:

- Backgrounds are Rich Navy/Black (`#09090B`), not pure black.
- Borders utilize "Glassmorphism" (`white/5` opacity).
- Accents use Electric Indigo (`#6366F1`) for focus states.

---

## 🚦 Running Locally

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-username/polaris.git
    ```

2.  **Install dependencies (using Bun)**

    ```bash
    bun install
    ```

3.  **Setup Environment**
    Create a `.env.local` file with your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    ```

4.  **Run the development server**
    ```bash
    bun dev
    ```

---

## 👤 Author

**Seu Nome**

- [LinkedIn](https://linkedin.com/in/seu-perfil)
- [Portfolio](https://seu-site.com)

---

> _Built with focus, for focus._
