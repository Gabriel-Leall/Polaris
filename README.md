# 🌌 Axis (Polaris)

![Project Banner](public/images/Axis%20Mokcup%20Dashboard.png)

> **Align your productivity vectors. Enter your flow state.**

Axis (Polaris) é um **Productivity Command Center** de alta fidelidade, feito para desenvolvedores, criadores e pessoas em foco profundo. A proposta é substituir o caos de dezenas de abas por um dashboard único, “Deep Midnight”, com widgets essenciais em um layout sem rolagem.

---

## ✨ Filosofia

Trabalho moderno é distração constante — a cada poucos minutos, o contexto muda. O Axis nasceu para reduzir esse ruído com uma experiência local-first e focada em privacidade, reforçando:

- **Deep Work:** com o Zen Mode integrado.
- **Intencionalidade:** por meio do layout Bento Grid em 100vh.
- **Consistência:** com rastreio visual de hábitos.

---

## 🚀 Recursos principais

### 🎯 Command Center

- **Bento Grid:** layout rígido em 3 colunas para caber em 100vh, sem rolagem infinita.
- **Zen Timer:** Pomodoro integrado que reduz distrações quando ativado.
- **Brain Dump:** bloco de notas em Markdown para esvaziar a mente rapidamente.

### ⚡ Widgets inteligentes

- **My Tasks:** lista estilo kanban para execução imediata.
- **Habit Tracker:** sequências visuais para incentivar consistência.
- **Media Hub:** sons focais (chuva, lo-fi, ruído branco).
- **Quick Links:** atalhos rápidos (GitHub, Figma, etc.).

---

## 🛠️ Stack

Construído com foco em performance, previsibilidade e tipagem forte.

- **Core:** [Next.js 14](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Runtime:** [Bun](https://bun.sh/)
- **Estilo:** [Tailwind CSS](https://tailwindcss.com/) + Design System “Deep Midnight”
- **Estado:** [Zustand](https://github.com/pmndrs/zustand)
- **Backend:** [Supabase](https://supabase.com/) (Auth & Database)
- **Componentes:** [Radix UI](https://www.radix-ui.com/) (Headless Primitives)

---

## 📸 Preview

Use o banner acima como referência visual. Adicione screenshots reais quando estiverem prontos.

---

## 🏗️ Arquitetura & Design

O Axis segue uma **arquitetura baseada em widgets**. Cada seção do grid é um componente isolado, coordenado por estado global para manter performance mesmo com mudanças complexas.

O tema **“Deep Midnight”** define a identidade visual:

- Backgrounds em Navy/Preto rico (`#09090B`), nunca preto puro.
- Bordas com efeito glassmorphism (`white/5`).
- Acentos em Electric Indigo (`#6366F1`) para foco.

---

## 🚦 Rodando localmente

1. **Instale as dependências (Bun)**

   ```bash
   bun install
   ```

2. **Configure o ambiente**

   Crie um arquivo `.env.local` com as credenciais do Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

3. **Inicie o servidor de desenvolvimento**

   ```bash
   bun dev
   ```

## 📜 Scripts úteis

- **Dev:** `bun dev`
- **Build:** `bun run build`
- **Start:** `bun run start`
- **Testes:** `bun test`

---

## 👤 Autor

**Gabriel Leal**

---

> _Built with focus, for focus._
