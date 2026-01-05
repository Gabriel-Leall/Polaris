import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TagReviewProps } from "../types";

export const TagReview = ({
  suggestedTags,
  newTag,
  setNewTag,
  addTag,
  removeTag,
  onCancel,
  onConfirm,
  isSyncing,
  isExpanded = false,
}: TagReviewProps) => {
  if (isExpanded) {
    return (
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-background/95 backdrop-blur-md border-t border-white/10 animate-in slide-in-from-bottom-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
              Tags Sugeridas
            </span>
            {suggestedTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-sm text-white/90"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-white/60 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isSyncing}
              variant="primary"
              className="px-6"
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
    <div className="px-6 py-3 bg-white/5 border-y border-white/5 animate-in slide-in-from-top-2 duration-200">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-[10px] uppercase tracking-wider text-white/40 mr-2">
          Tags sugeridas:
        </span>
        {suggestedTags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full text-xs text-white/80"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="hover:text-red-400"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <div className="flex items-center gap-1 ml-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="Nova tag..."
            className="bg-transparent border-none text-xs text-white/60 focus:outline-none w-20"
          />
          <button onClick={addTag} className="text-white/40 hover:text-white">
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-7 text-xs"
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onConfirm}
          disabled={isSyncing}
          className="h-7 text-xs"
        >
          {isSyncing ? "Enviando..." : "Confirmar e Enviar"}
        </Button>
      </div>
    </div>
  );
};
