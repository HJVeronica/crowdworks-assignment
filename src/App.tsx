import { useState } from "react";
import { JsonDataPanel } from "./components/JsonDataPanel";
import { PdfPreviewPanel } from "./components/PdfPreviewPanel";

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 2;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="w-screen h-screen flex bg-gray-50">
      <PdfPreviewPanel
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
      />
      <JsonDataPanel />
    </div>
  );
}

export default App;
