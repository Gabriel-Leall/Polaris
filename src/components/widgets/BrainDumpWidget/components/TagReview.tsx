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
          !suggestedTags.includes(tag)
      )
      .slice(0, 5);
  }, [newTag, allAvailableTags, suggestedTags]);

  const renderTagSelector = () => (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-[10px] uppercase tracking-wider text-white/40 mr-2 flex items-center gap-1">
        Tags:
      </span>
      {suggestedTags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/20 border border-primary/30 rounded-full text-xs text-primary-foreground animate-in zoom-in-95"
        >
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="hover:text-white transition-colors"
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
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-white/80 focus:outline-none focus:border-primary/50 w-32 placeholder:text-white/20 transition-all"
        />
        {newTag && (
          <button
            onClick={() => addTag()}
            className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/40 hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Sugestões de autocomplete */}
        {filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a1a1c] border border-white/10 rounded-xl py-1 shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-1">
            <div className="px-2 py-1 text-[9px] uppercase tracking-widest text-white/30 border-b border-white/5 mb-1">
              Sugestões
            </div>
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => addTag(suggestion)}
                className="w-full text-left px-3 py-2 text-xs text-white/70 hover:bg-primary/20 hover:text-white transition-colors flex items-center justify-between group"
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
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-[#09090b]/95 backdrop-blur-xl border-t border-white/10 animate-in slide-in-from-bottom-4 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-2xl mx-auto">
          {renderTagSelector()}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-white/50 hover:text-white hover:bg-white/5 px-6"
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
    <div className="px-6 py-4 bg-white/[0.02] border-y border-white/5 animate-in slide-in-from-top-2 duration-200">
      {renderTagSelector()}
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-8 text-xs text-white/40 hover:text-white"
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
