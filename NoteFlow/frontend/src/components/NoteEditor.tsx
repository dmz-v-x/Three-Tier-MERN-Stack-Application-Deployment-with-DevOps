import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { useNotes } from "@/contexts/useNotes";

export interface NoteFormData {
  title: string;
  content: string;
  category: string;
  color: string;
}

interface NoteEditorProps {
  initialData?: Partial<NoteFormData>;
  onSubmit: (data: NoteFormData) => Promise<void>;
  isLoading?: boolean;
}

export function NoteEditor({
  initialData,
  onSubmit,
  isLoading = false,
}: NoteEditorProps) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<NoteFormData>({
    title: initialData?.title || "",
    content: initialData?.content || "",
    category: initialData?.category || "",
    color: initialData?.color || "default",
  });
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const { categories = [], refreshCategories, createCategory } = useNotes();

  const colorOptions = [
    { value: "default", label: "Default (White)", class: "bg-white" },
    { value: "purple", label: "Purple", class: "bg-note-purple" },
    { value: "blue", label: "Blue", class: "bg-note-blue" },
    { value: "green", label: "Green", class: "bg-note-green" },
    { value: "pink", label: "Pink", class: "bg-note-pink" },
    { value: "yellow", label: "Yellow", class: "bg-note-yellow" },
    { value: "orange", label: "Orange", class: "bg-note-orange" },
    { value: "red", label: "Red", class: "bg-note-red" },
    { value: "gray", label: "Gray", class: "bg-note-gray" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        await createCategory(newCategory.trim());
        setFormData((prev) => ({ ...prev, category: newCategory.trim() }));
        setNewCategory("");
        setShowCategoryInput(false);
        await refreshCategories();
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);
      const finalFormData = {
        ...formData,
        category: formData.category || "uncategorized",
      };
      await onSubmit(finalFormData);
      // Navigate after successful submission
      navigate("/notes", { replace: true });
    } catch (error) {
      console.error("Error saving note:", error);
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (showCategoryInput && categoryInputRef.current) {
      categoryInputRef.current.focus();
    }
  }, [showCategoryInput]);

  const getColorClass = (color: string) => {
    const baseClasses = "transition-colors duration-200";
    switch (color) {
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
        return `${baseClasses} bg-white`;
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`space-y-6 p-6 rounded-lg border shadow-sm ${getColorClass(
        formData.color
      )}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Note title"
          className="text-lg font-medium bg-white/50 backdrop-blur-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your note here..."
          className="min-h-[200px] resize-y bg-white/50 backdrop-blur-sm"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          {showCategoryInput ? (
            <div className="flex gap-2">
              <Input
                ref={categoryInputRef}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category name"
                className="flex-1 bg-white/50 backdrop-blur-sm"
              />
              <Button
                type="button"
                onClick={handleAddCategory}
                variant="secondary"
                disabled={!newCategory.trim()}
              >
                Add
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowCategoryInput(false);
                  setNewCategory("");
                }}
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger className="flex-1 bg-white/50 backdrop-blur-sm">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uncategorized">No category</SelectItem>
                  {Array.isArray(categories) &&
                    categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={() => setShowCategoryInput(true)}
                variant="outline"
              >
                New
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Color</Label>
          <Select
            value={formData.color}
            onValueChange={(value) => handleSelectChange("color", value)}
          >
            <SelectTrigger className="bg-white/50 backdrop-blur-sm">
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {colorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border border-gray-200 ${option.class}`}
                    />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Color Preview */}
      <div className="mt-4 p-3 rounded-md border bg-white/50 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground">
          Preview with{" "}
          {formData.color === "default" ? "default" : formData.color} background
        </p>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isSaving || isLoading}>
          {isSaving || isLoading ? "Saving..." : "Save Note"}
        </Button>
      </div>
    </motion.form>
  );
}
