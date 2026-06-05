import { Edit, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/Button";

export function RecordActions({ deletable = true }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="secondary" onClick={() => toast.info("Opening record preview")}>
        <Eye className="h-3.5 w-3.5" /> View
      </Button>
      <Button size="sm" variant="secondary" onClick={() => toast.info("Edit mode enabled")}>
        <Edit className="h-3.5 w-3.5" /> Edit
      </Button>
      {deletable ? (
        <Button size="sm" variant="danger" onClick={() => toast.warning("Delete confirmation required")}>
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </Button>
      ) : null}
    </div>
  );
}
