import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NoteEditor, NoteFormData } from "@/components/NoteEditor";
import { useNotes } from "@/contexts";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditNotePage() {
  const { id } = useParams<{ id: string }>();
  const { getNoteById, updateNote } = useNotes();
  const navigate = useNavigate();
  const [note, setNote] = useState<NoteFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      if (id) {
        try {
          const data = await getNoteById(id);
          if (data) {
            setNote({
              title: data.title,
              content: data.content,
              category: data.category || "",
              color: data.color || "",
            });
          } else {
            navigate("/notes", { replace: true });
          }
        } catch (error) {
          console.error("Error fetching note:", error);
          navigate("/notes", { replace: true });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchNote();
  }, [id, getNoteById, navigate]);

  const handleSubmit = async (data: NoteFormData) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      const result = await updateNote(id, data);
      if (result) {
        navigate(`/notes/${id}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Note</h1>
      </div>

      {note && (
        <NoteEditor
          initialData={note}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
