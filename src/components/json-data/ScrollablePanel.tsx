import type { ScrollablePanelProps } from "../../types/json-data/types";

export function ScrollablePanel({
  children,
  className = "",
  panelRef,
  style,
}: ScrollablePanelProps) {
  return (
    <div
      ref={panelRef}
      className={`overflow-y-auto ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
