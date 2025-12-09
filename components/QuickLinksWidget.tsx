import React from 'react';
import { Github, Figma, Bot, Server } from 'lucide-react';

const LINKS = [
  { name: 'GitHub', url: 'https://github.com', icon: Github, hoverColor: 'hover:text-textPrimary hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' },
  { name: 'Figma', url: 'https://figma.com', icon: Figma, hoverColor: 'hover:text-[#F24E1E] hover:drop-shadow-[0_0_8px_rgba(242,78,30,0.5)]' },
  { name: 'ChatGPT', url: 'https://chat.openai.com', icon: Bot, hoverColor: 'hover:text-[#10A37F] hover:drop-shadow-[0_0_8px_rgba(16,163,127,0.5)]' },
  { name: 'Vercel', url: 'https://vercel.com', icon: Server, hoverColor: 'hover:text-textPrimary hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' },
];

const QuickLinksWidget: React.FC = () => {
  return (
    <div className="bg-surface rounded-3xl px-6  border border-border-subtle flex items-center h-full shadow-card">
      <div className="w-full flex items-center justify-around gap-2">
        {LINKS.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            title={link.name}
            className={`
              text-textSecondary transition-all duration-300 transform hover:scale-110 p-2 rounded-xl hover:bg-highlight
              ${link.hoverColor}
            `}
          >
            <link.icon size={26} />
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickLinksWidget;