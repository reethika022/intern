export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pulse-primary">BIOFACTOR PULSE</p>
        <h1 className="mt-2 text-2xl font-bold text-pulse-text sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1 max-w-3xl text-sm text-pulse-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
