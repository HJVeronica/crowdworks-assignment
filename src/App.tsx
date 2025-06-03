import jsonData from "./data/report.json";
import { JsonDataPanel } from "./components/JsonDataPanel";
import { PdfPreviewPanel } from "./components/PdfPreviewPanel";
import { createSectionGroups } from "./utils/createSectionGroups";

function App() {
  const sectionGroups = createSectionGroups(jsonData);

  return (
    <div className="w-screen h-screen flex bg-gray-50">
      <PdfPreviewPanel sectionGroups={sectionGroups} />
      <JsonDataPanel sectionGroups={sectionGroups} />
    </div>
  );
}

export default App;
