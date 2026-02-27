# React Doctor: Dicas de Acessibilidade (a11y) ♿

Este documento resume as correções de acessibilidade baseadas nas regras da WCAG e melhores práticas estruturais apontadas pelo React Doctor no Polaris.

## 1. Tratamento para `prefers-reduced-motion` (WCAG 2.3.3)

**Problema:** Alguns usuários têm a "redução de movimento" ativada nas opções de sistema operacional devido a doenças vestibulares ou cinetose. Se você ignora essa opção, suas animações podem causar tontura no usuário.
**Correção:** No `globals.css` inserimos a seguinte diretiva no final do arquivo:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**Por que funciona:** Automagicamente tira qualquer animação invasiva ou transitória se o SO sinalizar essa preferência. O React Framer Motion costuma seguir isso nativamente, mas essa regra CSS protege elementos Tailwind, SVGs criados com `<style>` e qualquer outra classe raw.

---

## 2. Tags clicáveis (`div`, `span`, `h2`) sem evento de Teclado

**Problema:** Se você quer que algo seja um "Botão" disfarçado de outro controle (ex: `span` que executa uma função no `onClick`), usuários cegos que dependem de leitores de tela ou usuários que só navegam pelo teclado (`Tab`) nunca conseguirão usá-los, porque faltam recursos na tag nativa.
**Correção:** Em componentes como `FileExplorer`, `TaskModal`, e `TaskItem`:

1. Removemos a dependência apenas do `onClick`.
2. Adicionamos `role="button"` (diz pro leitor de tela focar ali).
3. Adicionamos `tabIndex={0}` (permite receber foco do TAB).
4. Adicionamos `onKeyDown={(e) => { if(e.key === 'Enter') ... }}` para validar o clique via "Enter" ou "Espaço".

---

## 3. Uso do Atributo `autoFocus`

**Problema:** Elementos de formulário/input com `autoFocus=true` "sequestram" o cursor do usuário assim que a tela abre. Isso rouba muito contexto, atrapalha fluxo em mobile (abrindo o teclado nativo e quebrando o layout) e desorienta leitores de tela.
**Correção:** Removemos o `autoFocus` do `HabitTrackerWidget`, `AddLinkForm`, do `TaskItem` e outos 6 inputs em que encontramos essa tag.
**Por que funciona:** Se precisarmos que o campo fique ativado em certos momentos "intencionais" da interface, a recomendação é usar uma 'ref', e usar `inputRef.current?.focus()` intencionalmente atrelado à intenção física do usuário (como ele clicar no botão 'Entrar' ou 'Nova Tarefa'). E não de cara via renderização dura.
