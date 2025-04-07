import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotes } from "@/contexts";
import { NoteCard } from "@/components/NoteCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Plus, Tag } from "lucide-react";
import { Note } from "@/contexts/NotesContext";
import { motion } from "framer-motion";

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { notes, getAllNotes, deleteNote, isLoading } = useNotes();
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllNotes();
  }, []);

  useEffect(() => {
    if (category) {
      const filtered = notes.filter((note) => note.category === category);
      // Sort by most recently updated
      filtered.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setFilteredNotes(filtered);
    }
  }, [notes, category]);

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex items-center">
          <Tag className="h-5 w-5 mr-2 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">{category}</h1>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"}{" "}
          in this category
        </p>

        <Button asChild>
          <a
            href="/notes/new"
            onClick={(e) => {
              e.preventDefault();
              navigate("/notes/new", { state: { category } });
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </a>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredNotes.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredNotes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={handleDeleteNote} />
          ))}
        </motion.div>
      ) : (
        <EmptyState
          title={`No notes in ${category}`}
          description={`Start by creating a note in the ${category} category.`}
          actionText="Create Note"
          actionLink="/notes/new"
        />
      )}
    </div>
  );
}
