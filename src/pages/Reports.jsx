import { Save, Send, Users, MapPinned, Camera } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../components/common/PageHeader";
import { StatCard } from "../components/common/StatCard";
import { DataTable } from "../components/common/DataTable";
import { StatusBadge } from "../components/common/StatusBadge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { TextArea } from "../components/ui/FormControls";
import { reports } from "../data/mockData";

const columns = [
  { accessorKey: "id", header: "Report ID" },
  { accessorKey: "submittedBy", header: "Submitted By" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
];

export function Reports() {
  return (
    <>
      <PageHeader title="Reports" description="Submit daily field summaries, competitor intelligence, learnings, and next-day plans." />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Farmers Met" value="27" icon={Users} trend="+8 vs yesterday" />
        <StatCard label="Demos Created" value="6" icon={MapPinned} trend="2 pending approval" />
        <StatCard label="Media Uploaded" value="42" icon={Camera} trend="+15 today" />
      </div>
      <Card className="mb-6">
        <CardHeader><CardTitle>Daily Report Form</CardTitle></CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); toast.success("Daily report submitted"); }}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextArea label="Key Learnings" />
              <TextArea label="Farmer Objections" />
              <TextArea label="Competitor Activities" />
              <TextArea label="Support Required" />
            </div>
            <TextArea label="Tomorrow Plan" />
            <div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => toast.info("Report draft saved")}><Save className="h-4 w-4" /> Save Draft</Button><Button><Send className="h-4 w-4" /> Submit</Button></div>
          </form>
        </CardContent>
      </Card>
      <DataTable data={reports} columns={columns} />
    </>
  );
}
