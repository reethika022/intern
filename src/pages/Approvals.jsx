import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { StatusBadge } from "../components/common/StatusBadge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { TextArea } from "../components/ui/FormControls";
import { demos, farmers, reports } from "../data/mockData";

function rowsFor(tab) {
  if (tab === "Farmers") return farmers.map((item) => ({ id: item.id, submittedBy: item.name, date: "2026-06-04", status: item.status }));
  if (tab === "Demos") return demos.map((item) => ({ id: item.id, submittedBy: item.farmer, date: item.date, status: item.status }));
  return reports.map((item) => ({ id: item.id, submittedBy: item.submittedBy, date: item.date, status: item.status }));
}

export function Approvals() {
  const [tab, setTab] = useState("Farmers");
  const [rejectOpen, setRejectOpen] = useState(false);
  const columns = [
    { accessorKey: "id", header: "Record ID" },
    { accessorKey: "submittedBy", header: "Submitted By" },
    { accessorKey: "date", header: "Date" },
    { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
    { id: "actions", header: "Actions", cell: () => <div className="flex flex-wrap gap-2"><Button size="sm" onClick={() => toast.success("Record approved")}><Check className="h-3.5 w-3.5" />Approve</Button><Button size="sm" variant="danger" onClick={() => setRejectOpen(true)}><X className="h-3.5 w-3.5" />Reject</Button><Button size="sm" variant="secondary" onClick={() => toast.info("Record sent back")}><RotateCcw className="h-3.5 w-3.5" />Send Back</Button></div> },
  ];
  return (
    <>
      <PageHeader title="Approvals" description="Approve, reject, or send back submitted farmers, demos, and daily reports." />
      <div className="mb-5 flex gap-2">{["Farmers", "Demos", "Reports"].map((item) => <Button key={item} variant={tab === item ? "primary" : "secondary"} onClick={() => setTab(item)}>{item}</Button>)}</div>
      <DataTable data={rowsFor(tab)} columns={columns} />
      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Reject Record">
        <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); toast.error("Record rejected"); setRejectOpen(false); }}>
          <TextArea label="Reason Field Required" required placeholder="Explain what needs correction before resubmission" />
          <div className="flex justify-end"><Button variant="danger">Reject</Button></div>
        </form>
      </Modal>
    </>
  );
}
