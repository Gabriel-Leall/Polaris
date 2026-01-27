"use client";

import { X, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagReviewProps } from "../types";
import { useMemo } from "react";

export const TagReview = ({
  suggestedTags,
  allAvailableTags = [],
  newTag,
  setNewTag,
  addTag,
  removeTag,
  onCancel,
  onConfirm,
  isSyncing,
  isExpanded = false,
}: TagReviewProps) => {
  const filteredSuggestions = useMemo(() => {
    if (!newTag.trim()) return [];
    return allAvailableTags
      .filter(
        (tag) =>
          tag.toLowerCase().includes(newTag.toLowerCase()) &&
          !suggestedTags.includes(tag),
      )
      .slice(0, 5);
  }, [newTag, allAvailableTags, suggestedTags]);

  const renderTagSelector = () => (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-[10px] uppercase tracking-wider text-muted mr-2 flex items-center gap-1">
        Tags:
      </span>
      {suggestedTags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs text-primary animate-in zoom-in-95"
        >
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      <div className="relative flex items-center gap-1 ml-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTag();
            }
          }}
          placeholder="Adicionar tag..."
          className="bg-input border border-glass rounded-lg px-3 py-1 text-xs text-secondary focus:outline-none focus:border-primary/50 w-32 placeholder:text-muted transition-all"
        />
        {newTag && (
          <button
            onClick={() => addTag()}
            className="p-1 hover:bg-muted rounded-md transition-colors text-muted hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Sugestões de autocomplete */}
        {filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-glass rounded-xl py-1 shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-1">
            <div className="px-2 py-1 text-[9px] uppercase tracking-widest text-muted border-b border-glass mb-1">
              Sugestões
            </div>
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => addTag(suggestion)}
                className="w-full text-left px-3 py-2 text-xs text-secondary hover:bg-primary/20 hover:text-foreground transition-colors flex items-center justify-between group"
              >
                {suggestion}
                <Search className="h-2.5 w-2.5 opacity-0 group-hover:opacity-40" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isExpanded) {
    return (
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-background/95 backdrop-blur-xl border-t border-border animate-in slide-in-from-bottom-4 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-2xl mx-auto">
          {renderTagSelector()}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 px-6"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isSyncing}
              variant="primary"
              className="px-8 shadow-glow-sm"
            >
              {isSyncing
                ? "Sincronizando..."
                : "Confirmar e Enviar para o Notion"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 bg-muted/5 border-y border-border/50 animate-in slide-in-from-top-2 duration-200">
      {renderTagSelector()}
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onConfirm}
          disabled={isSyncing}
          className="h-8 px-4 text-xs shadow-glow-sm"
        >
          {isSyncing ? "Enviando..." : "Confirmar e Enviar"}
        </Button>
      </div>
    </div>
  );
};
