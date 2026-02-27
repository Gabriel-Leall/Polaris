# 04. Evolução de Ferramentas: De Textarea para WYSIWYG

O salto tecnológico que demos no painel de "Notes" é o que separa um app amador de um produto que os usuários pagariam para usar (como Notion ou Obsidian).

## 1. Fase 1: O "Textarea" cru

Inicialmente, você apenas digitava texto num campo bruto `<textarea>`. Nada de formatação visual. Tudo dependia de você digitar markdown manualmente (`**bold**`). O sistema usava a biblioteca `react-markdown` não para renderizar enquanto você digita, mas apenas quando você apertava um botão "Preview". Isso causa quebra de contexto mental e fadiga.

## 2. Fase 2: Padrão DRY (Don't Repeat Yourself)

O que notamos? Nós já tínhamos uma funcionalidade incrivelmente avançada funcionando perfeitamente em nosso código: O `BrainDumpWidget` tinha implementado o _TipTap_ (uma engine de Rich Text baseada em Prosemirror).

A maioria dos desenvolvedores júniores acabaria tentando criar outra configuração independente pro módulo de Notes. Nós fizemos o contrário. Como Sênior, você busca reaproveitar arquitetura.

**Extraímos as configurações padrão:**
Criamos e refatoramos funções (`getEditorExtensions`, `getEditorProps`) em `editorConfig.ts` e exportamos o componente `<EditorToolbar />`.

**Implementamos o Tiptap no FileEditor:**
Substituímos o State local simples do `<textarea>` por um `useEditor()` hook:
\`\`\`tsx
const editor = useEditor({
immediatelyRender: false,
extensions: getEditorExtensions(),
editorProps: getEditorProps(),
onUpdate: ({ editor }) => {
// Sincroniza o HTML gerado pelo WYSIWYG com nosso estado de notas
setContent(editor.getHTML());
}
});
\`\`\`

## 3. O Resultado

- **Consistência**: Tanto notas rápidas quanto arquivos salvos respondem ao mesmos comandos (Ctrl+B, atalhos de markdown instantâneos).
- **Sem piscar**: O código agora é o design. Quando você escreve `# Título`, ele imediatamente aplica a classe `<h1 class="prose-h1...">Título</h1>`.
- **Manutenção**: Temos apenas '_uma fonte de verdade_' para definir como texto editável funciona. Se pedirem para você adicionar atalhos de cor no futuro, você edita apenas a configuração global (extensions do tiptap) e a mudança se propaga por todos os cantos do Dashboard Polaris.

**Ensinamento Chave**: Sempre procure pontos onde as bibliotecas certas (como o _TipTap_ ao invés do manual textarea) reduzam fricção. É melhor confiar no ecossistema (headless WYSIWYG) do que reinventar a roda construindo parsers de Markdown incompletos do zero.
