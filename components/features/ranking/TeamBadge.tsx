interface TeamBadgeProps {
  name: string;
  primary: string;
  secondary?: string;
}

export function TeamBadge({ name, primary, secondary }: TeamBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-medium"
      style={{
        backgroundColor: `${primary}16`, // subtle tint
        color: primary,
        border: `1px solid ${primary}33`,
      }}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: primary }} />
      {name}
    </span>
  );
}
