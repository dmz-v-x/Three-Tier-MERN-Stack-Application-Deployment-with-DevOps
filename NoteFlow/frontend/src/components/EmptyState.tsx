
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionLink?: string;
  showAction?: boolean;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "No notes found",
  description = "You don't have any notes yet. Start creating one now!",
  actionText = "Create Note",
  actionLink = "/notes/new",
  showAction = true,
  icon = <FileText className="h-12 w-12 text-muted-foreground" />,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center p-8 h-[400px] rounded-lg border border-dashed"
    >
      <div className="flex flex-col items-center justify-center gap-2 mb-6">
        {icon}
        <h3 className="text-xl font-semibold mt-4">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      {showAction && (
        <Button asChild>
          <Link to={actionLink}>
            <Plus className="mr-2 h-4 w-4" />
            {actionText}
          </Link>
        </Button>
      )}
    </motion.div>
  );
}
