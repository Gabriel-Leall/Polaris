# Polaris - Job Application Tracker Dashboard

A high-fidelity job application tracker dashboard featuring AI-powered email analysis and smart widget integration, built with Next.js 14+ and modern web technologies.

## ✨ Features

- **Job Application Tracking**: Monitor application statuses (Interview, Applied, Rejected, Offer)
- **AI Email Analysis**: Gemini-powered email classification for job-related communications
- **Zen Mode**: Focus mode that dims non-essential widgets for distraction-free work
- **Widget-Based Dashboard**: Modular components including tasks, calendar, media player, brain dump, and quick links
- **Responsive Design**: 3-column bento grid layout optimized for productivity
- **Real-time Data**: Supabase backend with real-time synchronization
- **Modern UI**: Polaris Deep Midnight theme with OLED luxury aesthetics

## 🚀 Tech Stack

### Core Technologies
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5.x
- **Runtime & Package Manager**: Bun
- **Backend Logic**: Next.js Server Actions
- **Database & Auth**: Supabase (PostgreSQL)
- **AI Integration**: Google Gemini AI (@google/generative-ai)

### UI Libraries
- **Styling**: Tailwind CSS (with tailwindcss-animate)
- **Components**: Radix UI Primitives
- **Icons**: Lucide React
- **State Management**: Zustand

### Utilities
- **Class Management**: clsx & tailwind-merge
- **Date Handling**: date-fns
- **Validation**: Zod schemas
- **Testing**: Vitest + fast-check (Property-Based Testing)

## 🛠️ Development Setup

### Prerequisites
- Bun installed
- Supabase project created
- Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd polaris
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   GEMINI_API_KEY=your_api_key
   ```

4. **Set up the database**
   Run the SQL schema from `supabase/schema.sql` in your Supabase project

### Development Commands

```bash
# Start development server
bun dev

# Build for production
bun run build

# Start production server
bun start

# Run tests
bun test

# Run tests with coverage
bun test --coverage

# Lint code
bun run lint
```

## 📁 Project Structure

```
├── .kiro/                # Kiro IDE configuration and steering
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router (Pages & Layouts)
│   │   ├── actions/      # Server Actions (Gemini & Supabase logic)
│   │   ├── fonts.ts      # Font configurations
│   │   ├── layout.tsx    # Root Layout
│   │   └── page.tsx      # Main Dashboard Entry
│   │
│   ├── components/       # React Components
│   │   ├── ui/           # Primitive Components (Radix/Tailwind based)
│   │   ├── widgets/      # Smart Features (Logic + State)
│   │   └── layout/       # Structural Components
│   │
│   ├── store/            # Zustand Stores (Global Client State)
│   ├── lib/              # Utilities & Configuration
│   ├── hooks/            # Custom React Hooks
│   ├── types/            # TypeScript Definitions
│   └── __tests__/        # Test files
│
├── supabase/             # Database schema and configuration
├── tailwind.config.ts    # Theme Configuration
├── next.config.mjs       # Next.js Configuration
└── vitest.config.ts      # Testing Configuration
```

## 🎨 Design System

The Polaris design system features a **Deep Midnight** theme with OLED luxury aesthetics:

- **Color Palette**: Deep zinc/blue tones avoiding pure black for reduced eye strain
- **Typography**: Inter/Geist Sans for UI, JetBrains Mono/Geist Mono for code
- **Effects**: Glass borders, subtle glows, and proper shadows
- **Layout**: No-scroll philosophy with 100vh height constraint
- **Responsive**: 3-column bento grid (mobile stack → tablet 2-col → desktop 3-col)

## 🧪 Testing

The project uses a dual testing approach:

- **Unit Tests**: Jest with React Testing Library for specific examples and edge cases
- **Property-Based Tests**: fast-check for universal properties across all inputs
- **Integration Tests**: End-to-end workflows and cross-widget interactions

Run tests with:
```bash
bun test                    # Run all tests
bun test --watch           # Watch mode
bun test --coverage        # With coverage report
```

## 🚀 Deployment

### Build Optimization

The project includes several performance optimizations:

- **Next.js 14+** with Turbopack for faster builds
- **Image optimization** with WebP/AVIF support
- **Bundle compression** enabled
- **Tree shaking** for unused code elimination
- **Code splitting** for optimal loading

### Production Build

```bash
# Create optimized production build
bun run build

# Start production server
bun start
```

### Environment Variables

Ensure all required environment variables are set in your production environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

## 📖 Documentation

- [Supabase Setup Guide](./docs/supabase-setup.md)
- [Design System](./GuideLines/design-system.md)
- [Architecture Overview](./.kiro/specs/polaris-tech-migration/design.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js 14+, Supabase, and modern web technologies.
