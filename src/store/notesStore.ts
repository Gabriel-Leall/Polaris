import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NoteFile {
  id: string;
  name: string;
  content: string | null; // Null = not loaded yet
  folderId: string | null;
  isActive: boolean;
  updatedAt: string;
}

export interface NoteFolder {
  id: string;
  name: string;
  parentId: string | null;
  isExpanded: boolean;
  children: (NoteFile | NoteFolder)[];
}

interface NotesStore {
  // State
  files: NoteFile[];
  folders: NoteFolder[];
  selectedFileId: string | null;
  isLoading: boolean;

  // Actions
  setLoading: (loading: boolean) => void;
  setFiles: (files: NoteFile[]) => void;
  setFolders: (folders: NoteFolder[]) => void;
  selectFile: (fileId: string) => void;
  expandFolder: (folderId: string) => void;
  collapseFolder: (folderId: string) => void;
  createFile: (name: string, folderId?: string) => void;
  createFolder: (name: string, folderId?: string) => void;
  renameItem: (id: string, newName: string, type: "file" | "folder") => void;
  deleteItem: (id: string, type: "file" | "folder") => void;
  updateFileContent: (fileId: string, content: string) => void;
  moveItem: (
    id: string,
    newFolderId: string | null,
    type: "file" | "folder",
  ) => void;

  // Helpers
  getTree: () => NoteFolder[];
  getFileById: (fileId: string) => NoteFile | undefined;
  getFolderById: (folderId: string) => NoteFolder | undefined;
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      files: [],
      folders: [],
      selectedFileId: null,
      isLoading: false,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),

      setFiles: (files) => set({ files }),

      setFolders: (folders) => set({ folders }),

      selectFile: (fileId) => {
        set({ selectedFileId: fileId });
        // Set file as active
        set((state) => ({
          files: state.files.map((f) => ({
            ...f,
            isActive: f.id === fileId,
          })),
        }));
      },

      expandFolder: (folderId) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === folderId ? { ...folder, isExpanded: true } : folder,
          ),
        }));
      },

      collapseFolder: (folderId) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === folderId ? { ...folder, isExpanded: false } : folder,
          ),
        }));
      },

      createFile: (name: string, folderId: string | null = null) => {
        const newFile: NoteFile = {
          id: Date.now().toString(),
          name,
          content: "",
          folderId,
          isActive: false,
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ files: [...state.files, newFile] }));
      },

      createFolder: (name: string, folderId: string | null = null) => {
        const newFolder: NoteFolder = {
          id: Date.now().toString(),
          name,
          parentId: folderId,
          isExpanded: false,
          children: [],
        };
        set((state) => ({ folders: [...state.folders, newFolder] }));
      },

      renameItem: (id, newName, type) => {
        if (type === "file") {
          set((state) => ({
            files: state.files.map((file) =>
              file.id === id ? { ...file, name: newName } : file,
            ),
          }));
        } else {
          set((state) => ({
            folders: state.folders.map((folder) =>
              folder.id === id ? { ...folder, name: newName } : folder,
            ),
          }));
        }
      },

      deleteItem: (id, type) => {
        if (type === "file") {
          set((state) => ({
            files: state.files.filter((file) => file.id !== id),
          }));
        } else {
          set((state) => ({
            folders: state.folders.filter((folder) => folder.id !== id),
          }));
        }
      },

      updateFileContent: (fileId, content) => {
        set((state) => ({
          files: state.files.map((file) =>
            file.id === fileId
              ? { ...file, content, updatedAt: new Date().toISOString() }
              : file,
          ),
        }));
      },

      moveItem: (id, newFolderId, type) => {
        if (type === "file") {
          set((state) => ({
            files: state.files.map((file) =>
              file.id === id ? { ...file, folderId: newFolderId } : file,
            ),
          }));
        } else {
          set((state) => ({
            folders: state.folders.map((folder) =>
              folder.id === id ? { ...folder, parentId: newFolderId } : folder,
            ),
          }));
        }
      },

      // Helpers
      getTree: () => {
        const { folders, files } = get();

        const buildTree = (parentId: string | null): NoteFolder[] => {
          const folderChildren = folders
            .filter((folder) => folder.parentId === parentId)
            .map((folder) => ({
              ...folder,
              children: [
                ...buildTree(folder.id),
                ...files.filter((file) => file.folderId === folder.id),
              ],
            }));

          return folderChildren;
        };

        const rootFolders = buildTree(null);
        const rootFiles = files.filter((file) => file.folderId === null);

        return [
          ...rootFolders,
          ...rootFiles.map(
            (file) =>
              ({
                id: file.id,
                name: file.name,
                parentId: null,
                isExpanded: false,
                children: [],
              }) as unknown as NoteFolder,
          ),
        ];
      },

      getFileById: (fileId) => {
        return get().files.find((file) => file.id === fileId);
      },

      getFolderById: (folderId) => {
        return get().folders.find((folder) => folder.id === folderId);
      },
    }),
    {
      name: "notes-storage",
      partialize: (state) => ({
        files: state.files,
        folders: state.folders,
        selectedFileId: state.selectedFileId,
      }),
    },
  ),
);
