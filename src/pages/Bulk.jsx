import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { StatusBadge } from "../components/common/StatusBadge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { FormInput, SelectInput, TextArea } from "../components/ui/FormControls";
import { bulk } from "../data/mockData";

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "internName", header: "Intern Name" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "quantity", header: "Quantity" },
  { accessorKey: "qualification", header: "Qualification" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "mandal", header: "Mandal" },
  { accessorKey: "district", header: "District" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
];

export function Bulk() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader 
        title="Bulk Registration" 
        description="Track all bulk uploads and registrations by interns including farmers, demos, dealers, and media imports."
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> New Bulk Upload</Button>}
      />
      <DataTable data={bulk} columns={columns} />
      <Modal open={open} onClose={() => setOpen(false)} title="Add New Bulk Upload">
        <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); toast.success("Bulk upload added successfully"); setOpen(false); }}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Intern Name" />
            <SelectInput label="Upload Type" options={["Farmers", "Demos", "Dealers", "Media"]} />
            <FormInput label="Quantity" type="number" />
            <FormInput label="Qualification" />
            <FormInput label="Phone Number" />
            <FormInput label="Mandal" />
            <FormInput label="District" />
            <FormInput label="Date" type="date" />
            <SelectInput label="Status" options={["Pending", "In Progress", "Completed", "Submitted"]} />
          </div>
          <TextArea label="Notes" />
          <div className="flex justify-end"><Button><Send className="h-4 w-4" /> Submit Upload</Button></div>
        </form>
      </Modal>
    </>
  );
}
