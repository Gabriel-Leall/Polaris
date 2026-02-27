# React Doctor: Boas práticas no Framework do Next.js 🚀

O Next.js é muito opinativo. Para que ele gere sites incríveis em SEO e performance, algumas regras não negociáveis precisam ser seguidas na conversão React -> Next.js apontadas pelo React Doctor no Polaris.

## 1. Usar proper `next/link` no lugar de `<a>`

**Problema:** Múltiplos componentes (como `LandingFooter` e rotas internas no dock `QuickLinksWidget`) usavam a tag nativa `href="/privacy"`. A tag `<a>` causava um "hard refresh" forçando o servidor a reconstruir a tela, recarregar todo o CSS/JS do zero e matar estados abertos.
**Correção:** Trocamos `<a href="...">` para `<Link href="...">` usando a importação import `Link from "next/link"`.
**Por que funciona:** Além do Next.js agir como SPA (Single Page Application) fluindo sem tela piscando, ele também ativa o _Prefetch_ automático. Se o botão link aparecer visível na base da tela para o usuário, o Next.js carrega o conteúdo por debaixo dos panos antes mesmo dele sequer clicar.

---

## 2. Refatorando `next/image` Sizes

**Problema:** O uso da flag `<Image fill ... />` no MediaPlayerWidget carrega a imagem em total tamanho responsivo, no entanto o widget ocupava menos de 100 pixels. Sem um aviso de corte (`sizes`), o Next baixou imagens YouTube enormes que pesavam a timeline render.
**Correção:** Incluída a tag `sizes="80px"`.
**Por que funciona:** Avisa o servidor Vercel / Loader Nativo que o placeholder dessa imagem se espremerá em ~80px, instruindo a entregar um thumbnail minúsculo do pacote da imagem cacheada, economizando quase 90% em banda LCP.

---

## 3. O uso de de `useSearchParams()` causa Deopt (Desotimização) para Client-Side

**Problema:** Em `DashboardNotifications.tsx`, usamos o hook puro `useSearchParams()`. No App Router, qualquer rota cujo trecho tente "ler" um search param sem estar em suspense causa uma desotimização no cache da página (fazendo a renderização toda da rota despencar pra Client-Side Dinâmico por segurança, invés de uma renderização Estática pré-processada (SSG)).
**Correção:** Em `dashboard/page.tsx`, encapsulamos a renderização de notificação no topo da grade dento de uma cerca Boundary de `<Suspense fallback={null}> <Dashboard /> </Suspense>`.
**Por que funciona:** Suspense ensina para o Next: "Calma, renderize e cacheie TODA a tela de Dashboard para ser rápida", as notificações você joga pro lado do cliente quando ele de fato hidratar a página e ler a barra de navegação/query-params".
