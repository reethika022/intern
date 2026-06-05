import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { StatusBadge } from "../components/common/StatusBadge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { FormInput, ImageUploader, SelectInput, TextArea } from "../components/ui/FormControls";
import { dealers } from "../data/mockData";

const columns = [
  { accessorKey: "name", header: "Dealer Name" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "visitDate", header: "Visit Date" },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
];

export function Dealers() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Dealers" description="Track dealer visits, stock status, competitor products, and support requirements." actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add Dealer Visit</Button>} />
      <DataTable data={dealers} columns={columns} />
      <Modal open={open} onClose={() => setOpen(false)} title="Add Dealer Visit">
        <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); toast.success("Dealer visit submitted"); setOpen(false); }}>
          <div className="grid gap-4 md:grid-cols-2">
            <FormInput label="Dealer Name" />
            <FormInput label="Location" />
            <SelectInput label="Stock Status" options={["Available", "Low Stock", "Out of Stock", "New Order Required"]} />
            <FormInput label="Competitor Products" />
          </div>
          <TextArea label="Feedback" />
          <TextArea label="Support Required" />
          <ImageUploader label="Shop Photo" />
          <div className="flex justify-end"><Button><Send className="h-4 w-4" /> Submit Visit</Button></div>
        </form>
      </Modal>
    </>
  );
}
