import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { StatusBadge } from "../components/common/StatusBadge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { FormInput, ImageUploader, SelectInput, TextArea } from "../components/ui/FormControls";
import { farmers, issues } from "../data/mockData";

const columns = [
  { accessorKey: "farmer", header: "Farmer" },
  { accessorKey: "crop", header: "Crop" },
  { accessorKey: "type", header: "Issue Type" },
  { accessorKey: "severity", header: "Severity", cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
];

export function Issues() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Issues" description="Capture crop issues with severity, suspected causes, recommendations, and evidence media." actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add Issue</Button>} />
      <DataTable data={issues} columns={columns} />
      <Modal open={open} onClose={() => setOpen(false)} title="Issue Details">
        <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); toast.success("Issue submitted"); setOpen(false); }}>
          <div className="grid gap-4 md:grid-cols-2">
            <SelectInput label="Farmer" options={farmers.map((farmer) => farmer.name)} />
            <FormInput label="Crop" />
            <SelectInput label="Stage" options={["Nursery", "Vegetative", "Flowering", "Fruiting"]} />
            <FormInput label="Issue Type" />
            <SelectInput label="Severity" options={["Critical", "High", "Medium", "Low"]} />
          </div>
          <TextArea label="Cause" />
          <TextArea label="Recommendation" />
          <div className="grid gap-4 md:grid-cols-2"><ImageUploader label="Image" /><ImageUploader label="Video" /></div>
          <div className="flex justify-end"><Button><Send className="h-4 w-4" /> Submit Issue</Button></div>
        </form>
      </Modal>
    </>
  );
}
