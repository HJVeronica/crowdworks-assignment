import type { SectionGroup } from "../../utils/createSectionGroups";

export interface JsonDataPanelProps {
  sectionGroups: SectionGroup[];
  hoveredGroupIdx: number | null;
  selectedGroupIdx: number | null;
  setSelectedGroupIdx: (idx: number | null) => void;
  onTabChange: () => void;
}

export interface TableCell {
  text: string;
  col_span?: number;
  row_span?: number;
}

export interface TableRendererProps {
  grid: TableCell[][];
}

export interface PictureRendererProps {
  uri?: string;
}

export interface SectionBlockProps {
  section: SectionGroup;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  innerRef?: React.Ref<HTMLDivElement>;
}

export interface TabBarProps {
  tabs: { key: string; label: string }[];
  selected: string;
  onTabChange: (key: string) => void;
}

export interface ScrollablePanelProps {
  children: React.ReactNode;
  className?: string;
  panelRef?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
}
