import { Plus } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-6">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
        <Plus className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">No tasks yet</p>
      <p className="text-xs text-muted-foreground/70 mt-1">
        Add your first task above
      </p>
    </div>
  );
};