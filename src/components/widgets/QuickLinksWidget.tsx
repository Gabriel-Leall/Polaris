"use client";

import { useState } from "react";
import {
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Globe,
  Github,
  Linkedin,
  Mail,
  FileText,
  Briefcase,
} from "lucide-react";
import { Button, Dialog, Input } from "@/components/ui";
import {
  ErrorBoundary,
  WidgetErrorFallback,
} from "@/components/ui/error-boundary";
import { cn } from "@/lib/utils";
import { create } from "zustand";

interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  category: "work" | "social" | "tools" | "other";
}

interface QuickLinksStore {
  links: QuickLink[];
  addLink: (link: Omit<QuickLink, "id">) => void;
  updateLink: (id: string, link: Partial<QuickLink>) => void;
  removeLink: (id: string) => void;
}

const useQuickLinksStore = create<QuickLinksStore>()((set) => ({
  links: [
    {
      id: "1",
      title: "GitHub",
      url: "https://github.com",
      icon: "github",
      category: "work",
    },
    {
      id: "2",
      title: "LinkedIn",
      url: "https://linkedin.com",
      icon: "linkedin",
      category: "social",
    },
    {
      id: "3",
      title: "Portfolio",
      url: "https://portfolio.dev",
      icon: "globe",
      category: "work",
    },
    {
      id: "4",
      title: "Resume",
      url: "/resume.pdf",
      icon: "file-text",
      category: "work",
    },
    {
      id: "5",
      title: "Job Board",
      url: "https://jobs.dev",
      icon: "briefcase",
      category: "work",
    },
    {
      id: "6",
      title: "Email",
      url: "mailto:hello@example.com",
      icon: "mail",
      category: "other",
    },
  ],
  addLink: (link) =>
    set((state) => ({
      links: [...state.links, { ...link, id: Date.now().toString() }],
    })),
  updateLink: (id, updatedLink) =>
    set((state) => ({
      links: state.links.map((link) =>
        link.id === id ? { ...link, ...updatedLink } : link
      ),
    })),
  removeLink: (id) =>
    set((state) => ({
      links: state.links.filter((link) => link.id !== id),
    })),
}));

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  globe: Globe,
  "file-text": FileText,
  briefcase: Briefcase,
  mail: Mail,
  "external-link": ExternalLink,
};

interface QuickLinksWidgetProps {
  className?: string | undefined;
  compact?: boolean;
  readOnly?: boolean;
}

function QuickLinksWidgetCore({ className, compact = false, readOnly = false }: QuickLinksWidgetProps) {
  const { links, addLink, updateLink, removeLink } = useQuickLinksStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [newLink, setNewLink] = useState<{
    title: string;
    url: string;
    icon: string;
    category: "work" | "social" | "tools" | "other";
  }>({
    title: "",
    url: "",
    icon: "external-link",
    category: "other",
  });

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      addLink(newLink);
      setNewLink({
        title: "",
        url: "",
        icon: "external-link",
        category: "other",
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditLink = (link: QuickLink) => {
    setEditingLink(link);
    setNewLink({
      title: link.title,
      url: link.url,
      icon: link.icon,
      category: link.category,
    });
    setIsAddDialogOpen(true);
  };

  const handleUpdateLink = () => {
    if (editingLink && newLink.title && newLink.url) {
      updateLink(editingLink.id, newLink);
      setEditingLink(null);
      setNewLink({
        title: "",
        url: "",
        icon: "external-link",
        category: "other",
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteLink = (id: string) => {
    removeLink(id);
  };

  const openLink = (url: string) => {
    if (url.startsWith("mailto:") || url.startsWith("tel:")) {
      window.location.href = url;
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent =
      iconMap[iconName as keyof typeof iconMap] || ExternalLink;
    return IconComponent;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work":
        return "text-primary";
      case "social":
        return "text-status-pending";
      case "tools":
        return "text-status-interview";
      default:
        return "text-muted";
    }
  };

  const displayedLinks = compact ? links.slice(0, 4) : links;

  return (
    <div
      className={cn(
        "bg-card rounded-3xl border border-glass",
        compact ? "p-4" : "p-6",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Quick Links</h2>
          <p className="text-xs text-secondary mt-1">
            {links.length} saved links
          </p>
        </div>
        {!readOnly && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAddDialogOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
        {readOnly && (
          <Button variant="secondary" size="sm" className="px-3 py-2 h-8">
            <a href="/quick-links" className="flex items-center gap-2 text-xs">Manage</a>
          </Button>
        )}
      </div>

      {/* Links Grid */}
      <div className="space-y-2">
        {displayedLinks.map((link) => {
          const IconComponent = getIcon(link.icon);
          return (
            <div
              key={link.id}
              className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div
                className={cn("flex-shrink-0", getCategoryColor(link.category))}
              >
                <IconComponent className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <button
                  onClick={() => openLink(link.url)}
                  className="text-left w-full"
                >
                  <p className="text-white text-sm font-medium truncate hover:text-primary transition-colors">
                    {link.title}
                  </p>
                  <p className="text-muted text-xs truncate">
                    {link.url.replace(/^https?:\/\//, "")}
                  </p>
                </button>
              </div>

              {!readOnly && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditLink(link)}
                    className="h-7 w-7 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDeleteLink(link.id)}
                    className="h-7 w-7 p-0 text-status-rejected hover:text-status-rejected/80"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {displayedLinks.length === 0 && (
        <div className="py-8 flex flex-col items-center">
          <ExternalLink className="h-8 w-8 text-secondary mx-auto mb-3" />
          <p className="text-secondary text-sm mb-2">No quick links yet</p>
          {!readOnly && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsAddDialogOpen(true)}
            >
              Add your first link
            </Button>
          )}
          {readOnly && (
            <Button variant="secondary" size="sm">
              <a href="/quick-links">Manage links</a>
            </Button>
          )}
        </div>
      )}

      {/* Add/Edit Dialog */}
      {!readOnly && (
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <div className="bg-card border border-white/10 rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-white font-semibold mb-4">
            {editingLink ? "Edit Link" : "Add Quick Link"}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-secondary mb-2 block">Title</label>
              <Input
                value={newLink.title}
                onChange={(e) =>
                  setNewLink((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Link title"
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm text-secondary mb-2 block">URL</label>
              <Input
                value={newLink.url}
                onChange={(e) =>
                  setNewLink((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="https://example.com"
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm text-secondary mb-2 block">
                Category
              </label>
              <select
                value={newLink.category}
                onChange={(e) =>
                  setNewLink((prev) => ({
                    ...prev,
                    category: e.target.value as
                      | "work"
                      | "social"
                      | "tools"
                      | "other",
                  }))
                }
                className="w-full bg-input border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
              >
                <option value="work">Work</option>
                <option value="social">Social</option>
                <option value="tools">Tools</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-secondary mb-2 block">Icon</label>
              <select
                value={newLink.icon}
                onChange={(e) =>
                  setNewLink((prev) => ({ ...prev, icon: e.target.value }))
                }
                className="w-full bg-input border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
              >
                <option value="external-link">External Link</option>
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="globe">Website</option>
                <option value="file-text">Document</option>
                <option value="briefcase">Job/Work</option>
                <option value="mail">Email</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddDialogOpen(false);
                setEditingLink(null);
                setNewLink({
                  title: "",
                  url: "",
                  icon: "external-link",
                  category: "other",
                });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={editingLink ? handleUpdateLink : handleAddLink}
              disabled={!newLink.title || !newLink.url}
              className="flex-1"
            >
              {editingLink ? "Update" : "Add"} Link
            </Button>
          </div>
        </div>
      </Dialog>
      )}
    </div>
  );
}

// Wrapper component with error boundary
function QuickLinksWidget({ className, compact, readOnly }: QuickLinksWidgetProps) {
  return (
    <ErrorBoundary
      fallback={WidgetErrorFallback}
      name="QuickLinksWidget"
      maxRetries={2}
    >
      <QuickLinksWidgetCore className={className} compact={compact} readOnly={readOnly} />
    </ErrorBoundary>
  );
}

export default QuickLinksWidget;
export { QuickLinksWidget };
