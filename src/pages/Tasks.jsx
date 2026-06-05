import { Eye, Check, ClipboardList } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { StatCard } from "../components/common/StatCard";
import { DataTable } from "../components/common/DataTable";
import { StatusBadge } from "../components/common/StatusBadge";
import { Button } from "../components/ui/Button";
import { tasks } from "../data/mockData";

const columns = [
  { accessorKey: "name", header: "Task Name" },
  { accessorKey: "village", header: "Village" },
  { accessorKey: "priority", header: "Priority", cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
  { accessorKey: "dueDate", header: "Due Date" },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
  { id: "actions", header: "Actions", cell: () => <div className="flex gap-2"><Button size="sm" variant="secondary"><Eye className="h-3.5 w-3.5" />View</Button><Button size="sm"><Check className="h-3.5 w-3.5" />Complete</Button></div> },
];

export function Tasks() {
  return (
    <>
      <PageHeader title="Tasks" description="Plan, track, and close intern field execution across villages and assigned territories." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending" value="18" icon={ClipboardList} trend="6 due today" />
        <StatCard label="In Progress" value="11" icon={ClipboardList} trend="4 high priority" />
        <StatCard label="Completed" value="74" icon={ClipboardList} trend="+12 this week" />
      </div>
      <DataTable data={tasks} columns={columns} />
    </>
  );
}
