import { useEffect, useState, useCallback } from "react";
import { useNotes } from "@/contexts";
import { NoteCard } from "@/components/NoteCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Loader2, FilterX } from "lucide-react";
import { Note } from "@/contexts/NotesContext";

export default function AllNotesPage() {
  const {
    notes,
    getAllNotes,
    deleteNote,
    categories = [],
    isLoading,
  } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); // Changed initial value to "all"
  const [sortOption, setSortOption] = useState("newest");
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [isDeletingNote, setIsDeletingNote] = useState(false);

  useEffect(() => {
    getAllNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoize the filtering and sorting logic
  const filterAndSortNotes = useCallback(
    (notes: Note[]) => {
      let result = [...notes];

      // Filter by search term
      if (searchTerm) {
        result = result.filter(
          (note) =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by category
      if (selectedCategory && selectedCategory !== "all") {
        result = result.filter((note) => {
          if (selectedCategory === "uncategorized") {
            return !note.category || note.category === "uncategorized";
          }
          return note.category === selectedCategory;
        });
      }

      // Sort
      if (sortOption === "newest") {
        result.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      } else if (sortOption === "oldest") {
        result.sort(
          (a, b) =>
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );
      } else if (sortOption === "title") {
        result.sort((a, b) => a.title.localeCompare(b.title));
      }

      return result;
    },
    [searchTerm, selectedCategory, sortOption]
  );

  useEffect(() => {
    if (!notes) return;
    const filtered = filterAndSortNotes(notes);
    setFilteredNotes(filtered);
  }, [notes, filterAndSortNotes]);

  const handleDeleteNote = async (id: string) => {
    if (isDeletingNote) return;
    try {
      setIsDeletingNote(true);
      await deleteNote(id);
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setIsDeletingNote(false);
    }
  };

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("all"); // Reset to "all" instead of empty string
    setSortOption("newest");
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">All Notes</h1>
        <Button asChild disabled={isLoading}>
          <Link to="/notes/new">
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search notes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="uncategorized">Uncategorized</SelectItem>
            {Array.isArray(categories) &&
              categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Select
          value={sortOption}
          onValueChange={setSortOption}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="title">Title (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(searchTerm || selectedCategory !== "all") && (
        <div className="flex items-center text-sm text-muted-foreground">
          <span>
            Showing {filteredNotes.length}{" "}
            {filteredNotes.length === 1 ? "note" : "notes"}
            {selectedCategory !== "all" && ` in "${selectedCategory}"`}
            {searchTerm && ` matching "${searchTerm}"`}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 h-8 px-2"
            onClick={resetFilters}
            disabled={isLoading}
          >
            <FilterX className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredNotes.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <motion.div
                key={note._id}
                variants={item}
                initial="hidden"
                animate="show"
                exit="exit"
                layout
                className="h-fit"
              >
                <NoteCard
                  note={note}
                  onDelete={handleDeleteNote}
                  disabled={isDeletingNote}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState
          title={
            searchTerm || selectedCategory !== "all"
              ? "No matching notes"
              : "No notes yet"
          }
          description={
            searchTerm || selectedCategory !== "all"
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Create your first note to get started!"
          }
        />
      )}
    </div>
  );
}
