import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { StatusBadge } from "../components/common/StatusBadge";
import { RecordActions } from "../components/common/RecordActions";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { FormInput, ImageUploader, SelectInput, TextArea } from "../components/ui/FormControls";
import { farmers } from "../data/mockData";

const columns = [
  { accessorKey: "name", header: "Farmer Name" },
  { accessorKey: "mobile", header: "Mobile" },
  { accessorKey: "village", header: "Village" },
  { accessorKey: "crop", header: "Crop" },
  { accessorKey: "interest", header: "Interest Level", cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
  { id: "actions", header: "Actions", cell: () => <RecordActions /> },
];

export function Farmers() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit } = useForm();
  const onSubmit = () => { toast.success("Farmer submitted for approval"); setOpen(false); };

  return (
    <>
      <PageHeader title="Farmers" description="Manage farmer profiles, farm details, business interest, and uploaded field evidence." actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add Farmer</Button>} />
      <DataTable data={farmers} columns={columns} />
      <Modal open={open} onClose={() => setOpen(false)} title="Add Farmer">
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <Card>
            <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormInput label="Farmer Name" {...register("name", { required: true })} />
              <FormInput label="Mobile" {...register("mobile", { required: true })} />
              <FormInput label="Village" {...register("village")} />
              <FormInput label="Mandal" {...register("mandal")} />
              <FormInput label="District" {...register("district")} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Farm Details</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <FormInput label="Crop" {...register("crop")} />
              <FormInput label="Acreage" type="number" {...register("acreage")} />
              <SelectInput label="Irrigation Type" options={["Drip", "Canal", "Borewell", "Rainfed"]} {...register("irrigation")} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Business Details</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <TextArea label="Problem Statement" {...register("problem")} />
              <TextArea label="Suggested Product" {...register("product")} />
              <SelectInput label="Interest Level" options={["High", "Medium", "Low"]} {...register("interest")} />
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <ImageUploader label="Farmer Photo" />
            <ImageUploader label="Field Photo" />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => toast.info("Draft saved")}><Save className="h-4 w-4" /> Save Draft</Button>
            <Button type="submit"><Send className="h-4 w-4" /> Submit</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
