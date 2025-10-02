"use client";

interface SubmitBarProps {
  isValid: boolean;
  isLocked: boolean;
  onSaveDraft?: () => void;
  onSubmit?: () => void;
  onClear?: () => void;
}

export function SubmitBar({ isValid, isLocked, onSaveDraft, onSubmit, onClear }: SubmitBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-12 z-40 md:bottom-0">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="rounded-lg border border-border bg-background/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm">
              {isLocked ? (
                <span className="text-destructive">Rankings locked</span>
              ) : isValid ? (
                <span className="text-green-600">All 20 drivers ranked</span>
              ) : (
                <span className="text-muted-foreground">Rank all 20 drivers</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onClear} className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-muted/50">
                Clear
              </button>
              <button onClick={onSaveDraft} className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-muted/50">
                Save Draft
              </button>
              <button
                onClick={onSubmit}
                disabled={!isValid || isLocked}
                className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
