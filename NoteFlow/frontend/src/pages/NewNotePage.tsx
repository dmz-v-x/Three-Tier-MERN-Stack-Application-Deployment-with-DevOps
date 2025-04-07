import { useNavigate } from "react-router-dom";
import { NoteEditor, NoteFormData } from "@/components/NoteEditor";
import { useNotes } from "@/contexts";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function NewNotePage() {
  const { createNote } = useNotes();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: NoteFormData) => {
    try {
      setIsSubmitting(true);
      const result = await createNote(data);
      if (result) {
        navigate(`/notes/${result._id}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-3xl font-bold tracking-tight">Create New Note</h1>
      </div>

      <NoteEditor onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}
