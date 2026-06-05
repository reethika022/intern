import { Bell, Palette, Shield, SlidersHorizontal, User } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { FormInput, SelectInput } from "../components/ui/FormControls";

const sections = [
  { title: "Profile", icon: User, fields: ["Full Name", "Mobile", "Email"] },
  { title: "Notifications", icon: Bell, fields: ["Daily Digest Time", "Approval Alerts", "Issue Escalations"] },
  { title: "Theme", icon: Palette, fields: ["Theme Mode", "Density", "Chart Style"] },
  { title: "Roles", icon: Shield, fields: ["Role", "Territory", "Approval Level"] },
  { title: "System Preferences", icon: SlidersHorizontal, fields: ["Language", "Timezone", "Data Export"] },
];

export function Settings() {
  return (
    <>
      <PageHeader title="Settings" description="Manage profile preferences, notifications, role configuration, and platform behavior." />
      <div className="grid gap-6 xl:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader><CardTitle className="flex items-center gap-2"><section.icon className="h-5 w-5 text-pulse-primary" />{section.title}</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              {section.fields.map((field, index) => index === 1 ? <SelectInput key={field} label={field} options={["Enabled", "Disabled", "Manager Only"]} /> : <FormInput key={field} label={field} />)}
              <div className="flex justify-end"><Button variant="secondary">Save {section.title}</Button></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
