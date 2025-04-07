import { useEffect, useState } from "react";
import { useNotes } from "@/contexts";
import { useAuth } from "@/contexts/AuthContext";
import { NoteCard } from "@/components/NoteCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { notes, getAllNotes, deleteNote, isLoading } = useNotes();
  const { user } = useAuth();
  const [recentNotes, setRecentNotes] = useState([]);

  useEffect(() => {
    getAllNotes();
  }, []);

  useEffect(() => {
    // Get the 6 most recent notes
    const sorted = [...notes].sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    setRecentNotes(sorted.slice(0, 6));
  }, [notes]);

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {getGreeting()}, {user?.name.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your notes.
        </p>
      </motion.div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Recent Notes</h2>
        <Button asChild>
          <Link to="/notes/new">
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : recentNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentNotes.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={handleDeleteNote} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">All Notes</h2>
          <Button variant="outline" asChild>
            <Link to="/notes">View all notes</Link>
          </Button>
        </div>
        <div className="text-muted-foreground">
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading your notes...
            </div>
          ) : (
            <p>
              You have {notes.length} note{notes.length !== 1 ? "s" : ""} in
              total.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
