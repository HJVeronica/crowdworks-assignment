import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import pdfFile from "../data/report.pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import type { ReportJson } from "../types/report";
import getGroupBoundingBox from "../utils/getGroupBoundingBox";

// react-pdf worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
};

export function PdfPreviewPanel({ jsonData }: { jsonData: ReportJson }) {
  // PDF 페이지 수, 현재 페이지, PDF 렌더링 크기 상태
  const [totalPageNum, setTotalPageNum] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState({
    width: 0,
    height: 0,
    pdfWidth: 0,
    pdfHeight: 0,
  });

  // 현재 hover 중인 그룹 인덱스
  const [hoveredGroupIdx, setHoveredGroupIdx] = useState<number | null>(null);

  // PDF 페이지 렌더링 성공 시 크기 정보 저장
  function handlePageRenderSuccess(page: {
    view: number[];
    width: number;
    height: number;
  }) {
    const [xMin, yMin, xMax, yMax] =
      page.view.length === 4 ? page.view : [0, 0, page.width, page.height];

    setPageSize({
      width: page.width,
      height: page.height,
      pdfWidth: xMax - xMin,
      pdfHeight: yMax - yMin,
    });
  }

  // PDF 좌표 → 브라우저 픽셀 좌표 변환
  function pdfToViewport(
    bbox: { l: number; t: number; r: number; b: number },
    pageSize: {
      width: number;
      height: number;
      pdfWidth: number;
      pdfHeight: number;
    }
  ) {
    const { width, height, pdfHeight } = pageSize;
    const scaleX = width / pageSize.pdfWidth;
    const scaleY = height / pageSize.pdfHeight;

    const left = bbox.l * scaleX;
    const right = bbox.r * scaleX;
    const top = (pdfHeight - bbox.t) * scaleY;
    const bottom = (pdfHeight - bbox.b) * scaleY;

    return {
      left,
      top,
      width: right - left,
      height: bottom - top,
    };
  }

  // 현재 페이지의 그룹 bbox 리스트 구하기
  const groupBoxes = (jsonData.groups ?? [])
    .map((group) => getGroupBoundingBox(group, jsonData.texts))
    .filter(
      (
        box
      ): box is {
        l: number;
        t: number;
        r: number;
        b: number;
        page_no: number;
      } => !!box && box.page_no === currentPage
    );

  // PDF 문서 전체 로드 성공 시 페이지 수 저장
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setTotalPageNum(numPages);
    setCurrentPage(1);
  }

  // 페이지 이동 핸들러
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
            noData={<div className="text-gray-400">PDF 파일이 없습니다.</div>}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            {/* PDF Page와 오버레이 박스를 같은 relative 컨테이너에 렌더링 */}
            <div
              style={{
                position: "relative",
                width: pageSize.width,
                height: pageSize.height,
              }}
            >
              <Page
                pageNumber={currentPage}
                onRenderSuccess={handlePageRenderSuccess}
              />
              {/* 그룹별 오버레이: hover 시만 강조 */}
              {groupBoxes.map((box, idx) => {
                const style = pdfToViewport(box, pageSize);
                const isHovered = hoveredGroupIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`absolute rounded ${
                      isHovered
                        ? "border-2 border-yellow-400 bg-yellow-200/20"
                        : ""
                    } cursor-pointer`}
                    style={{
                      left: style.left,
                      top: style.top,
                      width: style.width,
                      height: style.height,
                      position: "absolute",
                      pointerEvents: "auto",
                      zIndex: 10,
                    }}
                    onMouseEnter={() => setHoveredGroupIdx(idx)}
                    onMouseLeave={() => setHoveredGroupIdx(null)}
                  />
                );
              })}
            </div>
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
