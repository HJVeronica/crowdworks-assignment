import type { SectionGroup } from "../utils/createSectionGroups";
import { useRef, useEffect, useState } from "react";

export function JsonDataPanel({
  sectionGroups,
  hoveredGroupIdx,
  selectedGroupIdx,
  setSelectedGroupIdx,
  onTabChange,
}: {
  sectionGroups: SectionGroup[];
  hoveredGroupIdx: number | null;
  selectedGroupIdx: number | null;
  setSelectedGroupIdx: (idx: number | null) => void;
  onTabChange: () => void;
}) {
  // 각 블록의 DOM 참조 저장
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  // 탭 상태
  const [tab, setTab] = useState<"preview" | "html" | "json">("json");
  // 컨텐츠 스크롤 영역 ref
  const scrollRef = useRef<HTMLDivElement>(null);

  // 탭 변경 시 선택 해제 및 스크롤 top 이동
  function handleTabChange(newTab: "preview" | "html" | "json") {
    setTab(newTab);
    setSelectedGroupIdx(null);
    // 스크롤 최상단 이동
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
      {/* 탭 버튼 */}
      <div className="flex gap-2 px-6 pt-4 pb-2">
        {[
          { key: "preview", label: "Preview" },
          { key: "html", label: "HTML" },
          { key: "json", label: "JSON" },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`px-4 py-1 rounded-t font-semibold focus:outline-none transition-colors duration-150 ${
              tab === key
                ? "bg-yellow-400 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-yellow-100"
            }`}
            onClick={() => handleTabChange(key as "preview" | "html" | "json")}
          >
            {label}
          </button>
        ))}
      </div>
      {/* 컨텐츠 영역 */}
      <div ref={scrollRef} className="flex-1 p-6 bg-white overflow-y-auto">
        {tab === "json" && (
          <div className="space-y-6">
            {sectionGroups.map((section, idx) => (
              <div
                key={section.groupIdx}
                // 각 블록의 ref 저장 (스크롤 연동용)
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
                  {section.contents.map((content, i) => {
                    if (content.type === "group") {
                      return content.texts.map((line, j) => (
                        <div
                          key={"g" + i + "-" + j}
                          className="text-gray-800 text-[15px]"
                        >
                          {line}
                        </div>
                      ));
                    }
                    if (content.type === "text") {
                      return (
                        <div key={"t" + i} className="my-2">
                          {content.text}
                        </div>
                      );
                    }
                    if (content.type === "table") {
                      const table = content.value;
                      const grid = table.data?.grid ?? [];
                      // 셀 렌더링 여부 체크용 2차원 배열
                      const rendered: boolean[][] = Array.from(
                        { length: grid.length },
                        () => Array(grid[0]?.length || 0).fill(false)
                      );
                      return (
                        <div key={"t" + i} className="my-2">
                          <table className="table-auto max-w-full border">
                            <tbody>
                              {grid.map(
                                (
                                  row: {
                                    text: string;
                                    col_span?: number;
                                    row_span?: number;
                                  }[],
                                  rowIdx: number
                                ) => (
                                  <tr key={rowIdx}>
                                    {row.map((cell, colIdx: number) => {
                                      if (rendered[rowIdx][colIdx]) return null;
                                      const colSpan = cell.col_span || 1;
                                      const rowSpan = cell.row_span || 1;
                                      // 병합된 셀 영역을 렌더링된 것으로 표시
                                      for (
                                        let r = rowIdx;
                                        r < rowIdx + rowSpan;
                                        r++
                                      ) {
                                        for (
                                          let c = colIdx;
                                          c < colIdx + colSpan;
                                          c++
                                        ) {
                                          if (r !== rowIdx || c !== colIdx)
                                            rendered[r][c] = true;
                                        }
                                      }
                                      return (
                                        <td
                                          key={colIdx}
                                          className="border px-4 py-1"
                                          colSpan={colSpan}
                                          rowSpan={rowSpan}
                                        >
                                          {cell.text}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                    if (content.type === "picture") {
                      const picture = content.value;
                      const uri = picture.image?.uri;
                      return (
                        <div key={"p" + i} className="my-2">
                          {uri && (
                            <img
                              src={uri}
                              alt="picture"
                              className="max-w-full max-h-60 rounded border"
                              style={{ objectFit: "contain" }}
                            />
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
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
      </div>
    </div>
  );
}
