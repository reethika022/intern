import { UploadCloud } from "lucide-react";
import { cn } from "../../lib/utils";

export function FormInput({ label, className, type = "text", ...props }) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      <span>{label}</span>
      <input
        type={type}
        className={cn("h-10 rounded-md border border-pulse-border bg-slate-950 px-3 text-pulse-text outline-none transition placeholder:text-slate-600 focus:border-pulse-primary", className)}
        {...props}
      />
    </label>
  );
}

export function TextArea({ label, className, ...props }) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      <span>{label}</span>
      <textarea
        rows={4}
        className={cn("rounded-md border border-pulse-border bg-slate-950 px-3 py-2 text-pulse-text outline-none transition placeholder:text-slate-600 focus:border-pulse-primary", className)}
        {...props}
      />
    </label>
  );
}

export function SelectInput({ label, options = [], className, ...props }) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      <span>{label}</span>
      <select
        className={cn("h-10 rounded-md border border-pulse-border bg-slate-950 px-3 text-pulse-text outline-none transition focus:border-pulse-primary", className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ImageUploader({ label = "Upload", multiple = false }) {
  return (
    <label className="grid cursor-pointer gap-2 text-sm text-slate-300">
      <span>{label}</span>
      <div className="flex min-h-28 items-center justify-center rounded-lg border border-dashed border-slate-600 bg-slate-950 px-4 py-5 text-center transition hover:border-pulse-primary">
        <div>
          <UploadCloud className="mx-auto h-7 w-7 text-pulse-primary" />
          <p className="mt-2 text-sm font-medium text-slate-200">Drop files or browse</p>
          <p className="text-xs text-pulse-muted">Images and videos supported</p>
        </div>
      </div>
      <input type="file" className="hidden" multiple={multiple} />
    </label>
  );
}
