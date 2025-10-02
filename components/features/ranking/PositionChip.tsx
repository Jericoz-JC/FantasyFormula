interface PositionChipProps {
  position: number;
}

export function PositionChip({ position }: PositionChipProps) {
  const podiumColors: Record<number, string> = {
    1: "bg-yellow-400 text-black",
    2: "bg-gray-300 text-black",
    3: "bg-amber-700 text-white",
  };
  const base = "bg-muted text-foreground";
  const color = podiumColors[position] ?? base;
  return (
    <div className={`h-8 w-8 shrink-0 rounded-full text-center text-sm font-semibold leading-8 ${color}`}>
      {position}
    </div>
  );
}
