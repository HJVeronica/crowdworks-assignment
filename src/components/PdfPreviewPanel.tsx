import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import pdfFile from "../data/report.pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// react-pdf worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
};

export function PdfPreviewPanel() {
  const [totalPageNum, setTotalPageNum] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setTotalPageNum(numPages);
    setCurrentPage(1);
  }

  function onPageChange(offset: number) {
    setCurrentPage((prevCurrentPage) => prevCurrentPage + offset);
  }

  const handlePrevPage = () => {
    onPageChange(-1);
  };

  const handleNextPage = () => {
    onPageChange(1);
  };

  return (
    <div className="w-1/2 flex flex-col border-r border-gray-300">
      {/* PDF 미리보기 영역 */}
      <div className="flex-1 flex items-center justify-center bg-white m-3 rounded-lg shadow-sm">
        <div className="w-full flex flex-col items-center">
          <Document
            file={pdfFile}
            loading={<div className="text-gray-400">PDF 로딩 중...</div>}
            error={
              <div className="text-red-500">PDF를 불러올 수 없습니다.</div>
            }
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            <Page pageNumber={currentPage} />
          </Document>
        </div>
      </div>

      {/* 페이지 네비게이션 */}
      <div className="flex items-center justify-center gap-4 px-3 py-2 bg-gray-50">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center bg-transparent text-gray-800 rounded disabled:text-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          ←
        </button>
        <span className="text-sm text-gray-800">
          {currentPage} / {totalPageNum}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPageNum}
          className="w-8 h-8 flex items-center justify-center bg-transparent text-gray-800 rounded disabled:text-gray-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          →
        </button>
      </div>
    </div>
  );
}
