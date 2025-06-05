import type { OverlayBoxProps } from "../../types/pdf-preview/types";

export function OverlayBox({
  style,
  isHovered,
  isSelected,
  onMouseEnter,
  onMouseLeave,
  innerRef,
}: OverlayBoxProps) {
  return (
    <div
      ref={innerRef}
      className={`absolute rounded cursor-pointer transition-colors duration-200 ${
        isHovered || isSelected
          ? "border-2 border-yellow-400 bg-yellow-200/20"
          : ""
      }`}
      style={{
        ...style,
        position: "absolute",
        pointerEvents: "auto",
        zIndex: 10,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}
