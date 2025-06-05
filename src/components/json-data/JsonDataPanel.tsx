import { useRef, useEffect, useState } from "react";
import { SectionBlock } from "./SectionBlock";
import { TabBar } from "./TabBar";
import { ScrollablePanel } from "./ScrollablePanel";
import type { JsonDataPanelProps } from "../../types/json-data/types";

export function JsonDataPanel({
  sectionGroups,
  hoveredGroupIdx,
  selectedGroupIdx,
  setSelectedGroupIdx,
  onTabChange,
}: JsonDataPanelProps) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [tab, setTab] = useState<"preview" | "html" | "json">("json");
  const scrollRef = useRef<HTMLDivElement>(null);

  // sectionGroups 길이가 바뀔 때 refs 배열 초기화
  useEffect(() => {
    refs.current = Array(sectionGroups.length).fill(null);
  }, [sectionGroups.length]);

  // 탭 변경 시 선택 해제 및 스크롤 top 이동
  function handleTabChange(newTab: "preview" | "html" | "json") {
    setTab(newTab);
    setSelectedGroupIdx(null);
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }, 0);
    onTabChange();
  }

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
      {/* 탭 바 */}
      <TabBar
        tabs={[
          { key: "preview", label: "Preview" },
          { key: "html", label: "HTML" },
          { key: "json", label: "JSON" },
        ]}
        selected={tab}
        onTabChange={(key) =>
          handleTabChange(key as "preview" | "html" | "json")
        }
      />
      {/* 컨텐츠 영역 */}
      <ScrollablePanel panelRef={scrollRef} className="flex-1 p-6 bg-white">
        {tab === "json" && (
          <div className="space-y-6">
            {sectionGroups.map((section, idx) => (
              <SectionBlock
                key={section.groupIdx}
                section={section}
                isSelected={selectedGroupIdx === section.groupIdx}
                isHovered={hoveredGroupIdx === section.groupIdx}
                onClick={() =>
                  setSelectedGroupIdx(
                    selectedGroupIdx === section.groupIdx
                      ? null
                      : section.groupIdx
                  )
                }
                innerRef={(el) => {
                  refs.current[idx] = el;
                }}
              />
            ))}
          </div>
        )}
        {tab === "preview" && (
          <div className="text-gray-500 text-center py-20">
            Preview 화면입니다.
          </div>
        )}
        {tab === "html" && (
          <div className="text-gray-500 text-center py-20">
            HTML 화면입니다.
          </div>
        )}
      </ScrollablePanel>
    </div>
  );
}
