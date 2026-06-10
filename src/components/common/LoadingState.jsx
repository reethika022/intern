export function LoadingState() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-24 animate-pulse rounded-lg border border-pulse-border bg-slate-100" />
      ))}
    </div>
  );
}
