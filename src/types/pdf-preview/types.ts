import type { SectionGroup } from "../../utils/createSectionGroups";

export interface OverlayBoxProps {
  style: React.CSSProperties;
  isHovered: boolean;
  isSelected: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  innerRef?: React.Ref<HTMLDivElement>;
}

export interface PdfPreviewPanelProps {
  sectionGroups: SectionGroup[];
  hoveredGroupIdx: number | null;
  setHoveredGroupIdx: (idx: number | null) => void;
  selectedGroupIdx: number | null;
  resetScrollTrigger: number;
}
