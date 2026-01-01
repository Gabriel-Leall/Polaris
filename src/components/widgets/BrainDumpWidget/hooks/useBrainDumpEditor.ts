import { useEditor } from "@tiptap/react";
import { getEditorExtensions, getEditorProps } from "../utils/editorConfig";

export const useBrainDumpEditor = (
  onUpdate: (html: string, text: string) => void
) => {
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration mismatch
    extensions: getEditorExtensions(),
    content: "",
    editorProps: getEditorProps(),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      onUpdate(html, text);
    },
  });

  return editor;
};