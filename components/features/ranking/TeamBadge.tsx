interface TeamBadgeProps {
  name: string;
  primary: string;
  secondary?: string;
}

export function TeamBadge({ name, primary, secondary }: TeamBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium"
      style={{
        backgroundColor: secondary ?? "transparent",
        border: `1px solid ${primary}`,
        color: primary,
      }}
    >
      <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: primary }} />
      {name}
    </span>
  );
}
