import jsonData from "./data/report.json";
import { JsonDataPanel } from "./components/JsonDataPanel";
import { PdfPreviewPanel } from "./components/PdfPreviewPanel";
import { createSectionGroups } from "./utils/createSectionGroups";
import { useState } from "react";
import type { ReportJson } from "./types/report";

// 원본 jsonData에서 필요한 필드만 추출하여 ReportJson 타입으로 변환
function toReportJson(raw: unknown): ReportJson {
  const data = raw as { [key: string]: unknown };
  return {
    texts: data.texts as ReportJson["texts"],
    groups: data.groups as ReportJson["groups"],
    tables: data.tables as ReportJson["tables"],
    pictures: data.pictures as ReportJson["pictures"],
    body: data.body as ReportJson["body"],
  };
}

function App() {
  const sectionGroups = createSectionGroups(toReportJson(jsonData));
  const [hoveredGroupIdx, setHoveredGroupIdx] = useState<number | null>(null);
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number | null>(null);
  const [resetScrollTrigger, setResetScrollTrigger] = useState(0);

  function handleTabChange() {
    setResetScrollTrigger((v) => v + 1);
  }

  return (
    <div className="w-screen h-screen flex bg-gray-50">
      <PdfPreviewPanel
        sectionGroups={sectionGroups}
        hoveredGroupIdx={hoveredGroupIdx}
        setHoveredGroupIdx={setHoveredGroupIdx}
        selectedGroupIdx={selectedGroupIdx}
        resetScrollTrigger={resetScrollTrigger}
      />
      <JsonDataPanel
        sectionGroups={sectionGroups}
        hoveredGroupIdx={hoveredGroupIdx}
        selectedGroupIdx={selectedGroupIdx}
        setSelectedGroupIdx={setSelectedGroupIdx}
        onTabChange={handleTabChange}
      />
    </div>
  );
}

export default App;
