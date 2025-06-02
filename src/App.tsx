import { JsonDataPanel } from "./components/JsonDataPanel";
import { PdfPreviewPanel } from "./components/PdfPreviewPanel";

function App() {
  return (
    <div className="w-screen h-screen flex bg-gray-50">
      <PdfPreviewPanel />
      <JsonDataPanel />
    </div>
  );
}

export default App;
