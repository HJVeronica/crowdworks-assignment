import type { ReportJson } from "../types/report";

export function JsonDataPanel({ jsonData }: { jsonData: ReportJson }) {
  const texts = jsonData.texts;

  return (
    <div className="w-1/2 flex flex-col">
      {/* 컨텐츠 영역 */}
      <div className="flex-1 p-6 bg-white overflow-y-auto">
        <div className="space-y-4">
          {texts.map((block, idx) => {
            const prov = block.prov?.[0];
            return (
              <div
                key={block.self_ref || idx}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                  {block.text}
                </div>
                {prov && (
                  <div className="mt-2 text-xs text-gray-400">
                    page: {prov.page_no} | bbox: [l:{prov.bbox.l.toFixed(1)}, t:
                    {prov.bbox.t.toFixed(1)}, r:{prov.bbox.r.toFixed(1)}, b:
                    {prov.bbox.b.toFixed(1)}]
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
