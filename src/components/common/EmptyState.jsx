import { Sprout } from "lucide-react";
import { Card } from "../ui/Card";

export function EmptyState({ title = "No records found", description = "Try adjusting filters or create a new record." }) {
  return (
    <Card className="flex min-h-48 items-center justify-center p-6 text-center">
      <div>
        <Sprout className="mx-auto h-10 w-10 text-pulse-primary" />
        <h3 className="mt-3 font-semibold text-pulse-text">{title}</h3>
        <p className="mt-1 text-sm text-pulse-muted">{description}</p>
      </div>
    </Card>
  );
}
