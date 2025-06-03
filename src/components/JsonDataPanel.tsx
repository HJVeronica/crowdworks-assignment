import type { SectionGroup } from "../utils/createSectionGroups";
import { useRef, useEffect } from "react";

export function JsonDataPanel({
  sectionGroups,
  hoveredGroupIdx,
  selectedGroupIdx,
  setSelectedGroupIdx,
}: {
  sectionGroups: SectionGroup[];
  hoveredGroupIdx: number | null;
  selectedGroupIdx: number | null;
  setSelectedGroupIdx: (idx: number | null) => void;
}) {
  // 각 블록의 DOM 참조 저장
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // hover 또는 클릭된 블록으로 스크롤 이동
    const idx = sectionGroups.findIndex(
      (s) => s.groupIdx === (hoveredGroupIdx ?? selectedGroupIdx)
    );
    if (idx !== -1 && refs.current[idx]) {
      refs.current[idx]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [hoveredGroupIdx, selectedGroupIdx, sectionGroups]);

  return (
    <div className="w-1/2 flex flex-col">
      {/* 컨텐츠 영역 */}
      <div className="flex-1 p-6 bg-white overflow-y-auto">
        <div className="space-y-6">
          {sectionGroups.map((section, idx) => (
            <div
              key={section.groupIdx}
              // 각 블록의 ref 저장
              ref={(el) => {
                refs.current[idx] = el;
              }}
              // hover 또는 클릭 시 노란색 강조
              className={`bg-gray-50 rounded-lg p-6 shadow-sm mb-2 transition-colors duration-200 cursor-pointer ${
                hoveredGroupIdx === section.groupIdx ||
                selectedGroupIdx === section.groupIdx
                  ? "border-2 border-yellow-400 bg-yellow-200/20"
                  : ""
              }`}
              // 클릭 시 해당 groupIdx를 선택 상태로 변경 (다시 클릭 시 선택 해제)
              onClick={() =>
                setSelectedGroupIdx(
                  selectedGroupIdx === section.groupIdx
                    ? null
                    : section.groupIdx
                )
              }
            >
              <div className="text-lg font-bold text-gray-800 mb-2">
                {section.header}
              </div>
              <div className="space-y-1">
                {section.contents.map((line, i) => (
                  <div key={i} className="text-gray-800 text-[15px]">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
