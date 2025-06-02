import jsonData from "./data/report.json";
import { JsonDataPanel } from "./components/JsonDataPanel";
import { PdfPreviewPanel } from "./components/PdfPreviewPanel";

function App() {
  return (
    <div className="w-screen h-screen flex bg-gray-50">
      <PdfPreviewPanel jsonData={jsonData} />
      <JsonDataPanel jsonData={jsonData} />
    </div>
  );
}

export default App;
