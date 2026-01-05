import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import UnderlineExtension from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";

export const LOCAL_BRAIN_DUMP_KEY = "polaris-brain-dump-local";
export const DEBOUNCE_DELAY = 1000; // 1 second debounce for auto-save

// Mockup content for demonstration
export const MOCKUP_CONTENT = `<h1>Job Search Notes</h1>

<h2>Companies to Apply</h2>
<ul>
<li>Google - Software Engineer</li>
<li>Microsoft - Frontend Developer</li>
<li>Meta - React Developer ✓</li>
<li>Netflix - Full Stack Engineer</li>
</ul>

<h2>Interview Prep</h2>
<ul>
<li>Review system design patterns</li>
<li>Practice coding challenges on LeetCode</li>
<li>Prepare behavioral questions (STAR method)</li>
<li>Research company culture and values</li>
</ul>

<h2>Technical Skills to Highlight</h2>
<ul>
<li>React/Next.js expertise</li>
<li>TypeScript proficiency</li>
<li>Node.js backend development</li>
<li>Database design (PostgreSQL)</li>
<li>Cloud platforms (AWS, Vercel)</li>
</ul>

<h2>Follow-up Actions</h2>
<ol>
<li>Send thank you emails after interviews</li>
<li>Update portfolio with recent projects</li>
<li>Connect with recruiters on LinkedIn</li>
<li>Practice mock interviews with peers</li>
</ol>`;

export const getEditorExtensions = () => [
  StarterKit.configure({
    // Enable markdown-style input rules for bold, italic, code
    bold: {
      HTMLAttributes: {
        class: "font-bold",
      },
    },
    italic: {
      HTMLAttributes: {
        class: "italic",
      },
    },
    code: {
      HTMLAttributes: {
        class: "bg-white/10 px-1 py-0.5 rounded text-sm font-mono",
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc list-outside ml-4 space-y-0",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal list-outside ml-4 space-y-0",
      },
    },
  }),
  UnderlineExtension,
  LinkExtension.configure({
    openOnClick: true,
    HTMLAttributes: {
      class: "text-primary underline hover:text-primary/80",
    },
  }),
  Placeholder.configure({
    placeholder: "Escreva e Revise aqui..",
  }),
];

export const getEditorProps = () => ({
  attributes: {
    class:
      "tiptap prose prose-invert prose-sm max-w-none focus:outline-none focus:ring-0 focus:ring-offset-0 h-full min-h-full p-8 [&_p]:leading-[1.5] [&_p]:my-0 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-0 [&_ul]:pl-0 [&_ol]:pl-0 [&_h1]:leading-none [&_h2]:leading-none [&_h3]:leading-none",
  },
});
