"use client";

import { useState, useRef, useEffect } from "react";
import { useNotesStore } from "@/store/notesStore";
import { cn } from "@/lib/utils";
import {
  FileText,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Search,
  Pencil,
  Trash2,
  Move,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  itemId: string | null;
  itemType: "file" | "folder" | null;
}

export function FileExplorer() {
  const {
    files,
    folders,
    selectedFileId,
    selectFile,
    expandFolder,
    collapseFolder,
    createFile,
    createFolder,
    renameItem,
    deleteItem,
  } = useNotesStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    itemId: null,
    itemType: null,
  });
  const [isCreating, setIsCreating] = useState<"file" | "folder" | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () =>
      setContextMenu((prev) => ({ ...prev, isOpen: false }));
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Focus input when creating new item
  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  // Handle creating new file/folder
  const handleCreate = (type: "file" | "folder") => {
    if (!newItemName.trim()) {
      setIsCreating(null);
      return;
    }

    if (type === "file") {
      createFile(newItemName.trim());
    } else {
      createFolder(newItemName.trim());
    }

    setNewItemName("");
    setIsCreating(null);
  };

  // Handle renaming
  const handleRename = (id: string, type: "file" | "folder") => {
    if (!editingName.trim()) {
      setEditingId(null);
      return;
    }

    renameItem(id, editingName.trim(), type);
    setEditingId(null);
    setEditingName("");
  };

  // Handle context menu
  const handleContextMenu = (
    e: React.MouseEvent,
    itemId: string,
    itemType: "file" | "folder",
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      isOpen: true,
      x: e.clientX,
      y: e.clientY,
      itemId,
      itemType,
    });
  };

  // Handle delete
  const handleDelete = () => {
    if (contextMenu.itemId && contextMenu.itemType) {
      deleteItem(contextMenu.itemId, contextMenu.itemType);
    }
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  };

  // Filter items based on search
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Build tree structure
  const renderTree = (parentId: string | null = null, level: number = 0) => {
    const childFolders = filteredFolders.filter((f) => f.parentId === parentId);
    const childFiles = filteredFiles.filter((f) => f.folderId === parentId);

    return (
      <>
        {childFolders.map((folder) => (
          <div key={folder.id}>
            {/* Folder Item */}
            <div
              className={cn(
                "group flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all",
                "hover:bg-muted/50 text-sm",
              )}
              style={{ paddingLeft: `${level * 12 + 12}px` }}
              onClick={() =>
                folder.isExpanded
                  ? collapseFolder(folder.id)
                  : expandFolder(folder.id)
              }
              onContextMenu={(e) => handleContextMenu(e, folder.id, "folder")}
            >
              <button className="p-0.5 hover:bg-muted rounded transition-colors">
                {folder.isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>

              {editingId === folder.id ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleRename(folder.id, "folder")}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleRename(folder.id, "folder")
                  }
                  className="flex-1 bg-background border border-primary rounded px-1.5 py-0.5 text-sm focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  {folder.isExpanded ? (
                    <FolderOpen className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <Folder className="w-4 h-4 text-primary shrink-0" />
                  )}
                  <span className="truncate text-foreground">
                    {folder.name}
                  </span>
                </>
              )}
            </div>

            {/* Children */}
            <AnimatePresence>
              {folder.isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTree(folder.id, level + 1)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {childFiles.map((file) => (
          <div
            key={file.id}
            className={cn(
              "group flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all",
              selectedFileId === file.id
                ? "bg-muted/80 border border-border"
                : "hover:bg-muted/50",
            )}
            style={{ paddingLeft: `${level * 12 + 12}px` }}
            onClick={() => selectFile(file.id)}
            onContextMenu={(e) => handleContextMenu(e, file.id, "file")}
          >
            <FileText
              className={cn(
                "w-4 h-4 shrink-0",
                selectedFileId === file.id
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            />

            {editingId === file.id ? (
              <input
                ref={inputRef}
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleRename(file.id, "file")}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleRename(file.id, "file")
                }
                className="flex-1 bg-background border border-primary rounded px-1.5 py-0.5 text-sm focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className={cn(
                  "truncate text-sm",
                  selectedFileId === file.id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {file.name}
              </span>
            )}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Toolbar */}
      <div className="p-3 border-b border-border/50 shrink-0">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-muted-foreground"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsCreating("file")}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <FileText className="w-4 h-4" />
            <span>Nova Nota</span>
          </button>
          <button
            onClick={() => setIsCreating("folder")}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Folder className="w-4 h-4" />
            <span>Nova Pasta</span>
          </button>
        </div>
      </div>

      {/* Create new item input */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-3 pb-3 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder={
                isCreating === "file" ? "Nome da nota..." : "Nome da pasta..."
              }
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate(isCreating!);
                if (e.key === "Escape") setIsCreating(null);
              }}
              onBlur={() => handleCreate(isCreating)}
              className="w-full bg-background border border-primary rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Tree */}
      <ScrollArea className="flex-1 px-2">
        <div className="py-2">
          {renderTree()}

          {/* Empty state */}
          {files.length === 0 && folders.length === 0 && !isCreating && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <p>Nenhuma nota ainda.</p>
              <p className="text-xs mt-1">Crie sua primeira nota!</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu.isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50 bg-popover border border-border rounded-xl shadow-xl py-1 min-w-[160px] overflow-hidden"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setEditingId(contextMenu.itemId);
                setEditingName(
                  contextMenu.itemType === "file"
                    ? files.find((f) => f.id === contextMenu.itemId)?.name || ""
                    : folders.find((f) => f.id === contextMenu.itemId)?.name ||
                        "",
                );
                setContextMenu((prev) => ({ ...prev, isOpen: false }));
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Renomear
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
              <Move className="w-4 h-4" />
              Mover
            </button>
            <div className="my-1 border-t border-border" />
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Deletar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
