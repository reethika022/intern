import { Clock, MapPin, UploadCloud } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { StatusBadge } from "../components/common/StatusBadge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { FormInput, ImageUploader, TextArea } from "../components/ui/FormControls";
import { attendance } from "../data/mockData";

const columns = [
  { accessorKey: "date", header: "Date" },
  { accessorKey: "checkIn", header: "Check In" },
  { accessorKey: "checkOut", header: "Check Out" },
  { accessorKey: "duration", header: "Duration" },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge value={getValue()} /> },
];

export function Attendance() {
  return (
    <>
      <PageHeader title="Attendance" description="Capture GPS-backed check-ins, check-outs, selfie proofs, and daily attendance status." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Check-In Card</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <ImageUploader label="Selfie Upload" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-pulse-border bg-slate-50 p-4"><MapPin className="h-5 w-5 text-pulse-primary" /><p className="mt-2 text-sm font-semibold">GPS Status</p><p className="text-xs text-pulse-muted">Locked within field territory</p></div>
              <FormInput label="Check-In Time" type="time" defaultValue="08:45" />
            </div>
            <Button><UploadCloud className="h-4 w-4" /> Start Day</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Check-Out Card</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-md border border-pulse-border bg-slate-50 p-4"><Clock className="h-5 w-5 text-pulse-primary" /><p className="mt-2 text-sm font-semibold">Current Session</p><p className="text-xs text-pulse-muted">8h 12m active in Chevella territory</p></div>
            <FormInput label="Check-Out Time" type="time" defaultValue="17:30" />
            <TextArea label="Remarks" placeholder="Summarize today's visits and blockers" />
            <Button>End Day</Button>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6"><DataTable data={attendance} columns={columns} /></div>
    </>
  );
}
