interface PdfPreviewPanelProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function PdfPreviewPanel({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}: PdfPreviewPanelProps) {
  return (
    <div className="w-1/2 flex flex-col border-r border-gray-300">
      {/* PDF 미리보기 영역 */}
      <div className="flex-1 flex items-center justify-center bg-white m-4 rounded-lg shadow-sm">
        <div className="text-center text-gray-800">
          <div className="text-6xl mb-4">📄</div>
          <div className="text-lg">PDF Preview</div>
          <div className="text-sm text-gray-500 mt-2">1.report.pdf</div>
        </div>
      </div>

      {/* 페이지 네비게이션 */}
      <div className="flex items-center justify-center gap-4 p-4 bg-gray-50">
        <button
          onClick={onPrevPage}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center bg-transparent text-gray-800 rounded disabled:text-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          ←
        </button>
        <span className="text-sm text-gray-800">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center bg-transparent text-gray-800 rounded disabled:text-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          →
        </button>
      </div>
    </div>
  );
}
