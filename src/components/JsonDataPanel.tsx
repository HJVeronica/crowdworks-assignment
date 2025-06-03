import type { SectionGroup } from "../utils/createSectionGroups";

export function JsonDataPanel({
  sectionGroups,
}: {
  sectionGroups: SectionGroup[];
}) {
  return (
    <div className="w-1/2 flex flex-col">
      {/* 컨텐츠 영역 */}
      <div className="flex-1 p-6 bg-white overflow-y-auto">
        <div className="space-y-6">
          {sectionGroups.map((section) => (
            <div
              key={section.groupIdx}
              className="bg-gray-50 rounded-lg p-6 shadow-sm mb-2"
              // onClick={() => ...} // 추후 클릭 이벤트용
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
