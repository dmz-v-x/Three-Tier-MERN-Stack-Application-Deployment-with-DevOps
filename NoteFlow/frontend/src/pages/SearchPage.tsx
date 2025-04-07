import { useState, useEffect } from "react";
import { useNotes } from "@/contexts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NoteCard } from "@/components/NoteCard";
import { EmptyState } from "@/components/EmptyState";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Note } from "@/contexts/NotesContext";

export default function SearchPage() {
  const { notes, getAllNotes, deleteNote } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAllNotes();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    // Simulate a brief loading state for better UX
    setTimeout(() => {
      const results = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setIsLoading(false);
    }, 300);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    // Update search results after deletion
    setSearchResults((prevResults) =>
      prevResults.filter((note) => note._id !== id)
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Search Notes</h1>
        <p className="text-muted-foreground">Find notes by title or content</p>
      </div>

      <div className="flex space-x-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for notes..."
            className="pl-9 pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          onClick={handleSearch}
          disabled={!searchTerm.trim() || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <SearchIcon className="h-4 w-4 mr-2" />
          )}
          Search
        </Button>
      </div>

      <AnimatePresence>
        {hasSearched && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <p className="text-muted-foreground">
                {searchResults.length === 0
                  ? `No results found for "${searchTerm}"`
                  : `Found ${searchResults.length} ${
                      searchResults.length === 1 ? "result" : "results"
                    } for "${searchTerm}"`}
              </p>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No matching notes"
                description="Try searching for something else"
                showAction={false}
                icon={
                  <div className="rounded-full bg-muted p-3">
                    <SearchIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                }
              />
            )}
          </motion.div>
        )}

        {!hasSearched && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center items-center py-12"
          >
            <div className="text-center max-w-md">
              <div className="bg-muted/50 rounded-full p-6 inline-block mb-4">
                <SearchIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">Search your notes</h3>
              <p className="text-muted-foreground">
                Enter a search term above to find notes by title or content
              </p>
            </div>
          </motion.div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
