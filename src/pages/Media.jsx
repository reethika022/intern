import { useState } from "react";
import { Grid2X2, List, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Modal } from "../components/ui/Modal";
import { FormInput, ImageUploader, SelectInput, TextArea } from "../components/ui/FormControls";
import { media } from "../data/mockData";

export function Media() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("grid");
  return (
    <>
      <PageHeader title="Media" description="Review and upload field photos and videos linked to farmers, demos, issues, and dealers." actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Upload Media</Button>} />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">{["Farmer", "Demo", "Issue", "Dealer"].map((filter) => <Button key={filter} variant="secondary" size="sm">{filter}</Button>)}</div>
        <div className="flex gap-2"><Button variant={view === "grid" ? "primary" : "secondary"} size="sm" onClick={() => setView("grid")}><Grid2X2 className="h-4 w-4" /></Button><Button variant={view === "list" ? "primary" : "secondary"} size="sm" onClick={() => setView("list")}><List className="h-4 w-4" /></Button></div>
      </div>
      <div className={view === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-4" : "grid gap-3"}>
        {media.map((item, index) => (
          <Card key={item.title} className={view === "list" ? "p-4" : "overflow-hidden"}>
            <div className={view === "grid" ? "h-40 bg-gradient-to-br from-emerald-500/30 via-slate-800 to-lime-500/20" : "hidden"} />
            <CardContent className={view === "list" ? "flex items-center justify-between p-0" : ""}>
              <div><p className="font-semibold">{item.title}</p><p className="text-sm text-pulse-muted">{item.linked} • {item.uploaded}</p></div>
              <StatusBadge value={item.type} className={index === 0 ? "mt-3" : ""} />
            </CardContent>
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Upload Media">
        <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); toast.success("Media uploaded"); setOpen(false); }}>
          <div className="grid gap-4 md:grid-cols-2"><SelectInput label="Media Type" options={["Farmer", "Demo", "Issue", "Dealer"]} /><FormInput label="Linked Record" /></div>
          <TextArea label="Description" />
          <ImageUploader label="Images / Videos" multiple />
          <div className="flex justify-end"><Button><Upload className="h-4 w-4" /> Upload</Button></div>
        </form>
      </Modal>
    </>
  );
}
