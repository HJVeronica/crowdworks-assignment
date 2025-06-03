import jsonData from "./data/report.json";
import { JsonDataPanel } from "./components/JsonDataPanel";
import { PdfPreviewPanel } from "./components/PdfPreviewPanel";
import { createSectionGroups } from "./utils/createSectionGroups";
import { useState } from "react";

function App() {
  const sectionGroups = createSectionGroups(jsonData);
  const [hoveredGroupIdx, setHoveredGroupIdx] = useState<number | null>(null);
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number | null>(null);

  return (
    <div className="w-screen h-screen flex bg-gray-50">
      <PdfPreviewPanel
        sectionGroups={sectionGroups}
        hoveredGroupIdx={hoveredGroupIdx}
        setHoveredGroupIdx={setHoveredGroupIdx}
        selectedGroupIdx={selectedGroupIdx}
      />
      <JsonDataPanel
        sectionGroups={sectionGroups}
        hoveredGroupIdx={hoveredGroupIdx}
        selectedGroupIdx={selectedGroupIdx}
        setSelectedGroupIdx={setSelectedGroupIdx}
      />
    </div>
  );
}

export default App;
