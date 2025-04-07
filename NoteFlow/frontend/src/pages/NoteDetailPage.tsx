import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotes, Note } from "@/contexts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Edit,
  MoreVertical,
  Trash,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getNoteById, deleteNote } = useNotes();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchNote = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const data = await getNoteById(id);

        if (isMounted) {
          if (!data) {
            navigate("/notes", { replace: true });
            return;
          }
          setNote(data);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        if (isMounted) {
          navigate("/notes", { replace: true });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchNote();

    return () => {
      isMounted = false;
    };
  }, [id, getNoteById, navigate]);

  const handleDelete = async () => {
    if (!id || isDeleting) return;

    try {
      setIsDeleting(true);
      const success = await deleteNote(id);
      if (success) {
        navigate("/notes", { replace: true });
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const getCardClass = () => {
    const baseClasses = "transition-colors duration-200";
    if (!note?.color) return `${baseClasses} bg-white`;

    switch (note.color) {
      case "purple":
        return `${baseClasses} bg-note-purple`;
      case "blue":
        return `${baseClasses} bg-note-blue`;
      case "green":
        return `${baseClasses} bg-note-green`;
      case "pink":
        return `${baseClasses} bg-note-pink`;
      case "yellow":
        return `${baseClasses} bg-note-yellow`;
      case "orange":
        return `${baseClasses} bg-note-orange`;
      case "red":
        return `${baseClasses} bg-note-red`;
      case "gray":
        return `${baseClasses} bg-note-gray`;
      default:
        return `${baseClasses} bg-white`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!note) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h2 className="text-2xl font-bold">Note not found</h2>
        <p className="text-muted-foreground mt-2">
          The note you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate("/notes")} className="mt-4">
          Go back to notes
        </Button>
      </motion.div>
    );
  }

  const formattedDate = format(new Date(note.updatedAt), "MMMM d, yyyy h:mm a");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={note._id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(`/notes/edit/${note._id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn("border rounded-lg p-6 shadow-sm", getCardClass())}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {note.title}
              </h1>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                Last updated {formattedDate}
              </div>
            </div>

            {note.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {note.category}
              </span>
            )}
          </div>

          <div
            className="prose prose-gray max-w-none note-content"
            dangerouslySetInnerHTML={{
              __html: note.content.replace(/\n/g, "<br />"),
            }}
          />
        </motion.div>

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </AnimatePresence>
  );
}
