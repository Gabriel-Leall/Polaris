# React Doctor: Dicas de Performance e Bundle 🚀

Este documento resume as correções de performance detectadas pelo React Doctor e aplicadas no projeto Polaris para melhorar o desempenho de animações, tamanho do bundle e renderização.

## 1. Evitar `transition: "all"`

**Problema:** Utilizar `transition-all` faz com que o navegador tente animar _todas_ as propriedades que mudam (incluindo coisas caras como layout `width`/`height` ou fluxo do DOM). Isso pode causar queda de frames (jank).
**Correção:** Em componentes SVG como `PolarisName.tsx` e `AxisName.tsx`, substituímos `transition-all` por `transition-[filter,transform]`.
**Por que funciona:** O navegador consegue usar a GPU para animar `filter` e `transform`, tornando a animação muito mais leve (até 60 FPS consistentes).

---

## 2. Não usar `scale: 0` para montagem initial

**Problema:** Animar de `scale: 0` para `1` força o React e o navegador a calcular o layout de um componente do zero (já que no tamanho zero, seu layout e conteúdo não ocupam espaço visível). Além disso, causa problemas de hidratação (flickers) porque o lado do servidor (SSR) renderiza o componente no tamanho natural e o framer-motion o esmaga para `0` no carregamento.
**Correção:** Mudamos de `scale: 0` para `scale: 0.95` em componentes como `HabitTrackerWidget`, `ProblemSection` e `CelebrationAnimation`.
**Por que funciona:** Criamos o mesmo efeito de "pop-in" natural. O componente já "existe" estruturalmente e seu layout é renderizado de forma transparente para depois apenas crescer os 5% que faltam, dando uma entrada muito melhor e sem doer no layout engine.

---

## 3. Event Listeners de Scroll devem ser Passivos

**Problema:** Ao registrar `window.addEventListener('scroll', handler)`, o navegador "trava" o scroll de vez em quando esperando a resposta do JavaScript, para saber se você usou `event.preventDefault()` ou não.
**Correção:** Em `LandingHeader.tsx`, passamos o terceiro argumento: `window.addEventListener('scroll', handler, { passive: true })`.
**Por que funciona:** `{ passive: true }` é uma promessa ao navegador de que o JS não bloqueará o scroll natural, permitindo que a própria engine do navegador lide com a barra de rolagem a toda velocidade.

---

## Próximos passos (Ação Grande Pendente):

O React Doctor apontou o uso generalizado da biblioteca completa do `motion/react`, o que aumenta o tamanho do pacote do app em ~30kb gzipped. Para projetos Next.js, a recomendação é utilizar a funcionalidade `<LazyMotion>` exportando animações apenas em arquivos cruciais. Como isso mexe em _27 arquivos_, esta ação será tratada em um pull-request separado ou através de uma refatoração progressiva.
