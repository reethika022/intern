import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { StatusBadge } from "../components/common/StatusBadge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { FormInput, ImageUploader, SelectInput } from "../components/ui/FormControls";
import { demos, farmers } from "../data/mockData";

const columns = [
  { accessorKey: "id", header: "Demo ID" },
  { accessorKey: "farmer", header: "Farmer" },
  { accessorKey: "crop", header: "Crop" },
  { accessorKey: "product", header: "Product" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
];

export function DemoPlots() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader title="Demo Plots" description="Create and monitor product demonstrations with application details, photos, and next visit schedules." actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Create Demo</Button>} />
      <DataTable data={demos} columns={columns} />
      <Modal open={open} onClose={() => setOpen(false)} title="Create Demo">
        <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); toast.success("Demo created"); setOpen(false); }}>
          <div className="grid gap-4 md:grid-cols-2">
            <SelectInput label="Farmer" options={farmers.map((farmer) => farmer.name)} />
            <FormInput label="Crop" />
            <SelectInput label="Crop Stage" options={["Vegetative", "Flowering", "Fruiting", "Harvest"]} />
            <FormInput label="Area" placeholder="0.5 acre" />
            <FormInput label="Product" />
            <FormInput label="Dosage" />
            <SelectInput label="Application Method" options={["Foliar Spray", "Soil Drench", "Drip", "Seed Treatment"]} />
            <FormInput label="Application Date" type="date" />
            <FormInput label="Next Visit Date" type="date" />
          </div>
          <div className="grid gap-4 md:grid-cols-2"><ImageUploader label="Before Photo" /><ImageUploader label="Application Photo" /></div>
          <div className="flex justify-end"><Button><Send className="h-4 w-4" /> Submit Demo</Button></div>
        </form>
      </Modal>
    </>
  );
}
