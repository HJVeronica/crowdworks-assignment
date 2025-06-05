import jsonData from "./data/report.json";
import { JsonDataPanel } from "./components/json-data/JsonDataPanel";
import { PdfPreviewPanel } from "./components/pdf-preview/PdfPreviewPanel";
import { createSectionGroups } from "./utils/createSectionGroups";
import { useState } from "react";
import type { ReportJson } from "./types/parsed-pdf/types";

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
  const [panelState, setPanelState] = useState({
    hoveredGroupIdx: null as number | null,
    selectedGroupIdx: null as number | null,
    resetScrollTrigger: 0,
  });

  function handleTabChange() {
    setPanelState((s) => ({
      ...s,
      resetScrollTrigger: s.resetScrollTrigger + 1,
    }));
  }

  return (
    <div className="w-screen h-screen flex bg-gray-50">
      <PdfPreviewPanel
        sectionGroups={sectionGroups}
        hoveredGroupIdx={panelState.hoveredGroupIdx}
        setHoveredGroupIdx={(idx: number | null) =>
          setPanelState((s) => ({
            ...s,
            hoveredGroupIdx: idx as number | null,
          }))
        }
        selectedGroupIdx={panelState.selectedGroupIdx}
        resetScrollTrigger={panelState.resetScrollTrigger}
      />
      <JsonDataPanel
        sectionGroups={sectionGroups}
        hoveredGroupIdx={panelState.hoveredGroupIdx}
        selectedGroupIdx={panelState.selectedGroupIdx}
        setSelectedGroupIdx={(idx: number | null) =>
          setPanelState((s) => ({
            ...s,
            selectedGroupIdx: idx as number | null,
          }))
        }
        onTabChange={handleTabChange}
      />
    </div>
  );
}

export default App;
