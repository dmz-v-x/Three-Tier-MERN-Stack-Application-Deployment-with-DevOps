import React, { createContext, useState, useEffect } from "react";
import { notesAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export interface Note {
  _id: string;
  title: string;
  content: string;
  category?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotesContextType {
  notes: Note[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  getAllNotes: () => Promise<void>;
  getNoteById: (id: string) => Promise<Note | null>;
  createNote: (noteData: {
    title: string;
    content: string;
    category?: string;
    color?: string;
  }) => Promise<Note | null>;
  updateNote: (
    id: string,
    noteData: {
      title?: string;
      content?: string;
      category?: string;
      color?: string;
    }
  ) => Promise<Note | null>;
  deleteNote: (id: string) => Promise<boolean>;
  refreshCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<void>;
  deleteCategory: (name: string) => Promise<boolean>;
}

export const NotesContext = createContext<NotesContextType>({
  notes: [],
  categories: [],
  isLoading: false,
  error: null,
  getAllNotes: async () => {},
  getNoteById: async () => null,
  createNote: async () => null,
  updateNote: async () => null,
  deleteNote: async () => false,
  refreshCategories: async () => {},
  createCategory: async () => {},
  deleteCategory: async () => false,
});

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOperationInProgress, setIsOperationInProgress] =
    useState<boolean>(false);
  const [noteCache, setNoteCache] = useState<Record<string, Note>>({});
  const { toast } = useToast();

  const refreshCategories = async () => {
    try {
      console.log("Refreshing categories...");
      const response = await notesAPI.getAllCategories();
      console.log("Categories response:", response);

      if (response?.data) {
        // Type guard to ensure we're working with strings
        const categoriesData = Array.isArray(response.data)
          ? response.data.filter(
              (category): category is string =>
                typeof category === "string" && category.trim() !== ""
            )
          : [];

        // Remove duplicates and sort
        const uniqueCategories = [...new Set(categoriesData)].sort((a, b) =>
          a.localeCompare(b)
        );

        console.log("Setting categories:", uniqueCategories);
        setCategories(uniqueCategories);
      } else {
        console.log("No categories data in response");
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast({
        title: "Error",
        description: "Failed to refresh categories",
        variant: "destructive",
        duration: 3000,
      });
      setCategories([]);
    }
  };

  const createCategory = async (name: string) => {
    if (isOperationInProgress || !name.trim()) return;
    setIsOperationInProgress(true);
    try {
      // Check if category already exists
      if (categories.includes(name.trim())) {
        toast({
          title: "Error",
          description: "Category already exists",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      console.log("Creating category with name:", name);
      const response = await notesAPI.createCategory(name);
      console.log("Category creation response:", response);

      await refreshCategories();

      toast({
        title: "Success",
        description: "Category created successfully",
        duration: 3000,
      });

      return response.data;
    } catch (err) {
      console.error("Error creating category:", err);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
        duration: 3000,
      });
      throw err;
    } finally {
      setIsOperationInProgress(false);
    }
  };

  const deleteCategory = async (name: string) => {
    if (isOperationInProgress || name === "uncategorized") return false;
    setIsOperationInProgress(true);
    try {
      console.log("Deleting category:", name);

      // First, update all notes in this category to "uncategorized"
      const notesInCategory = notes.filter((note) => note.category === name);
      for (const note of notesInCategory) {
        const updatedNote = await notesAPI.updateNote(note._id, {
          ...note,
          category: "uncategorized",
        });
        // Update note cache
        setNoteCache((prev) => ({
          ...prev,
          [note._id]: updatedNote.data,
        }));
      }

      // Then delete the category
      await notesAPI.deleteCategory(name);

      // Update local notes state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.category === name ? { ...note, category: "uncategorized" } : note
        )
      );

      // Refresh categories
      await refreshCategories();

      toast({
        title: "Success",
        description: "Category deleted successfully",
        duration: 3000,
      });

      return true;
    } catch (err) {
      console.error("Error deleting category:", err);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    } finally {
      setIsOperationInProgress(false);
    }
  };

  const getAllNotes = async () => {
    if (isOperationInProgress) return;
    setIsOperationInProgress(true);
    setIsLoading(true);
    setError(null);
    try {
      const response = await notesAPI.getAllNotes();
      setNotes(response.data);

      // Update note cache
      const newCache: Record<string, Note> = {};
      response.data.forEach((note: Note) => {
        newCache[note._id] = note;
      });
      setNoteCache(newCache);

      await refreshCategories();
      return response.data;
    } catch (err) {
      setError("Failed to fetch notes");
      console.error("Error fetching notes:", err);
      toast({
        title: "Error",
        description: "Failed to fetch notes",
        variant: "destructive",
        duration: 3000,
      });
      return [];
    } finally {
      setIsLoading(false);
      setIsOperationInProgress(false);
    }
  };

  const getNoteById = async (id: string) => {
    if (isOperationInProgress) return null;

    // Check cache first
    if (noteCache[id]) {
      return noteCache[id];
    }

    setIsOperationInProgress(true);
    setIsLoading(true);
    setError(null);
    try {
      const response = await notesAPI.getNoteById(id);
      // Update cache
      setNoteCache((prev) => ({
        ...prev,
        [id]: response.data,
      }));
      return response.data;
    } catch (err) {
      setError("Failed to fetch note");
      console.error(`Error fetching note with id ${id}:`, err);
      toast({
        title: "Error",
        description: "Failed to fetch note",
        variant: "destructive",
        duration: 3000,
      });
      return null;
    } finally {
      setIsLoading(false);
      setIsOperationInProgress(false);
    }
  };

  const createNote = async (noteData: {
    title: string;
    content: string;
    category?: string;
    color?: string;
  }) => {
    if (isOperationInProgress) return null;
    setIsOperationInProgress(true);
    setIsLoading(true);
    setError(null);
    try {
      const finalNoteData = {
        ...noteData,
        category: noteData.category?.trim() || "uncategorized",
        color: noteData.color || "default",
      };

      const response = await notesAPI.createNote(finalNoteData);

      // Update notes state and cache
      setNotes((prevNotes) => [...prevNotes, response.data]);
      setNoteCache((prev) => ({
        ...prev,
        [response.data._id]: response.data,
      }));

      toast({
        title: "Success",
        description: "Note created successfully",
        duration: 3000,
      });
      await refreshCategories();
      return response.data;
    } catch (err) {
      setError("Failed to create note");
      console.error("Error creating note:", err);
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
        duration: 3000,
      });
      return null;
    } finally {
      setIsLoading(false);
      setIsOperationInProgress(false);
    }
  };

  const updateNote = async (
    id: string,
    noteData: {
      title?: string;
      content?: string;
      category?: string;
      color?: string;
    }
  ) => {
    if (isOperationInProgress) return null;
    setIsOperationInProgress(true);
    setIsLoading(true);
    setError(null);
    try {
      const finalNoteData = {
        ...noteData,
        category: noteData.category?.trim() || undefined,
      };

      const response = await notesAPI.updateNote(id, finalNoteData);

      // Update notes state and cache
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? response.data : note))
      );
      setNoteCache((prev) => ({
        ...prev,
        [id]: response.data,
      }));

      toast({
        title: "Success",
        description: "Note updated successfully",
        duration: 3000,
      });
      await refreshCategories();
      return response.data;
    } catch (err) {
      setError("Failed to update note");
      console.error(`Error updating note with id ${id}:`, err);
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive",
        duration: 3000,
      });
      return null;
    } finally {
      setIsLoading(false);
      setIsOperationInProgress(false);
    }
  };

  const deleteNote = async (id: string) => {
    if (isOperationInProgress) return false;
    setIsOperationInProgress(true);
    setIsLoading(true);
    setError(null);
    try {
      await notesAPI.deleteNote(id);

      // Update notes state and remove from cache
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      setNoteCache((prev) => {
        const newCache = { ...prev };
        delete newCache[id];
        return newCache;
      });

      toast({
        title: "Success",
        description: "Note deleted successfully",
        duration: 3000,
      });
      await refreshCategories();
      return true;
    } catch (err) {
      setError("Failed to delete note");
      console.error(`Error deleting note with id ${id}:`, err);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    } finally {
      setIsLoading(false);
      setIsOperationInProgress(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("noteflow_token");
    if (token) {
      getAllNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        categories,
        isLoading,
        error,
        getAllNotes,
        getNoteById,
        createNote,
        updateNote,
        deleteNote,
        refreshCategories,
        createCategory,
        deleteCategory,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
