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
        class: "list-disc list-inside space-y-1",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal list-inside space-y-1",
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
    placeholder: "Add a brain dump...",
    emptyEditorClass:
      "before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:h-0 before:pointer-events-none",
  }),
];

export const getEditorProps = () => ({
  attributes: {
    class:
      "prose prose-invert prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
  },
});