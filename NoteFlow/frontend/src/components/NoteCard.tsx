import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Clock, Edit, Trash } from "lucide-react";
import { Note } from "@/contexts/NotesContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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

export interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => Promise<void>;
  disabled?: boolean;
}

export function NoteCard({ note, onDelete, disabled }: NoteCardProps) {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getCardClass = () => {
    const baseClasses = "transition-colors duration-200";
    if (!note.color) return `${baseClasses} bg-white hover:bg-gray-50`;

    switch (note.color) {
      case "purple":
        return `${baseClasses} bg-note-purple hover:bg-note-purple-hover`;
      case "blue":
        return `${baseClasses} bg-note-blue hover:bg-note-blue-hover`;
      case "green":
        return `${baseClasses} bg-note-green hover:bg-note-green-hover`;
      case "pink":
        return `${baseClasses} bg-note-pink hover:bg-note-pink-hover`;
      case "yellow":
        return `${baseClasses} bg-note-yellow hover:bg-note-yellow-hover`;
      case "orange":
        return `${baseClasses} bg-note-orange hover:bg-note-orange-hover`;
      case "red":
        return `${baseClasses} bg-note-red hover:bg-note-red-hover`;
      case "gray":
        return `${baseClasses} bg-note-gray hover:bg-note-gray-hover`;
      default:
        return `${baseClasses} bg-white hover:bg-gray-50`;
    }
  };

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await onDelete(note._id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = note.updatedAt
    ? format(new Date(note.updatedAt), "MMM d, yyyy h:mm a")
    : "";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        whileHover={{ y: -4 }}
        className="h-full"
      >
        <Card
          className={cn(
            "h-full cursor-pointer note-card border shadow-sm hover:shadow-md",
            getCardClass()
          )}
          onClick={() => navigate(`/notes/${note._id}`)}
        >
          <CardContent className="p-5 relative">
            <div
              className="absolute top-3 right-3"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-black/5"
                    disabled={disabled}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-more-vertical opacity-70 hover:opacity-100"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/notes/edit/${note._id}`);
                    }}
                    disabled={disabled}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeleteDialogOpen(true);
                    }}
                    disabled={disabled}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {note.category && (
              <div className="mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {note.category}
                </span>
              </div>
            )}

            <h3 className="text-lg font-medium line-clamp-1">{note.title}</h3>

            <div className="mt-2 text-sm text-gray-600 line-clamp-4 note-content">
              {truncateContent(note.content)}
            </div>

            <div className="mt-4 pt-2 border-t flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formattedDate}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
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
    </>
  );
}
