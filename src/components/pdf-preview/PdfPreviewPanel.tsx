import { Document, Page, pdfjs } from "react-pdf";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import pdfFile from "../../data/report.pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { OverlayBox } from "./OverlayBox";
import type { PdfPreviewPanelProps } from "../../types/pdf-preview/types";

// react-pdf worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const options = {
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
};

export function PdfPreviewPanel({
  sectionGroups,
  hoveredGroupIdx,
  setHoveredGroupIdx,
  selectedGroupIdx,
  resetScrollTrigger,
}: PdfPreviewPanelProps) {
  // PDF 페이지 수, 현재 페이지, PDF 렌더링 크기 상태
  const [totalPageNum, setTotalPageNum] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState({
    width: 0,
    height: 0,
    pdfWidth: 0,
    pdfHeight: 0,
  });

  // 각 오버레이 박스의 DOM Refs
  const overlayRefs = useRef<{ [groupIdx: number]: HTMLDivElement | null }>({});

  // PDF 컨테이너 width 측정
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    // 선택된 오버레이 박스로 스크롤 이동
    if (selectedGroupIdx == null) return;
    const el = overlayRefs.current[selectedGroupIdx];
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [selectedGroupIdx, currentPage]);

  // resetScrollTrigger가 바뀔 때마다 스크롤 top 이동
  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, [resetScrollTrigger]);

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
    const top = (pdfHeight - bbox.t) * scaleY - 5;
    const bottom = (pdfHeight - bbox.b) * scaleY;

    return {
      left,
      top,
      width: right - left,
      height: bottom - top + 5,
    };
  }

  // 현재 페이지의 섹션 bbox 리스트 구하기 (모든 contents의 bbox를 합친 값)
  const sectionBoxes = sectionGroups.filter(
    (section) => section.bbox && section.bbox.page_no === currentPage
  );

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
    <div className="w-1/2 flex flex-col border-r border-gray-300 h-screen max-h-screen overflow-y-auto">
      {/* PDF 미리보기 영역 */}
      <div
        ref={containerRef}
        className="flex-1 flex justify-center bg-white m-3 rounded-lg shadow-sm h-full overflow-y-auto"
        style={{ minHeight: 0 }}
      >
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
            <div
              style={{
                position: "relative",
                width: containerWidth,
                minHeight: 0,
              }}
            >
              <Page
                pageNumber={currentPage}
                width={containerWidth}
                onRenderSuccess={handlePageRenderSuccess}
              />
              {/* 그룹별 오버레이: hover 또는 클릭 시 강조 */}
              {sectionBoxes.map((section) => {
                const bbox = section.bbox;
                if (!bbox) return null;
                const style = pdfToViewport(bbox, pageSize);
                const isHovered = hoveredGroupIdx === section.groupIdx;
                const isSelected = selectedGroupIdx === section.groupIdx;
                return (
                  <OverlayBox
                    key={section.groupIdx}
                    innerRef={(el) => {
                      overlayRefs.current[section.groupIdx] = el;
                    }}
                    style={{
                      left: style.left,
                      top: style.top,
                      width: style.width,
                      height: style.height,
                    }}
                    isHovered={isHovered}
                    isSelected={isSelected}
                    onMouseEnter={() => setHoveredGroupIdx(section.groupIdx)}
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
