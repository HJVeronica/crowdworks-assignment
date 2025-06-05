# PDF-JSON Interactive Viewer

## 프로젝트 개요

이 프로젝트는 PDF 문서와 JSON 파싱 데이터를 **양방향으로 연결**하여,  
사용자가 **직관적으로 문서 내용을 탐색**할 수 있는 인터랙션 UI를 구현한 과제입니다.

- **좌측**: PDF 미리보기(react-pdf)
- **우측**: JSON 파싱 데이터(섹션 단위) 출력
- PDF와 JSON 데이터의 **위치 정보(bbox, page_no)**를 기반으로 하이라이트 및 스크롤 연동

---

## 폴더 구조

```
📦src
 ┣ 📂components
 ┃ ┣ 📂json-data              # JSON 데이터 패널
 ┃ ┃ ┣ 📜JsonDataPanel.tsx
 ┃ ┃ ┣ 📜PictureRenderer.tsx
 ┃ ┃ ┣ 📜ScrollablePanel.tsx
 ┃ ┃ ┣ 📜SectionBlock.tsx
 ┃ ┃ ┣ 📜TabBar.tsx
 ┃ ┃ ┗ 📜TableRenderer.tsx
 ┃ ┣ 📂pdf-preview            # 좌측: PDF Preview 패널
 ┃ ┃ ┣ 📜OverlayBox.tsx
 ┃ ┗ ┗ 📜PdfPreviewPanel.tsx
 ┣ 📂data                     # PDF 파일 및 파싱 데이터(JSON)
 ┃ ┣ 📜report.json
 ┃ ┗ 📜report.pdf
 ┣ 📂types                    # 타입 선언 모음
 ┃ ┣ 📂json-data
 ┃ ┃ ┗ 📜types.ts
 ┃ ┣ 📂parsed-pdf
 ┃ ┃ ┗ 📜types.ts
 ┃ ┗ 📂pdf-preview
 ┃ ┃ ┗ 📜types.ts
 ┣ 📂utils                    # 섹션 그룹화 등 유틸 함수
 ┃ ┣ 📜createSectionGroups.ts
 ┃ ┗ 📜getGroupBoundingBox.ts
 ┣ 📜App.tsx
 ┣ 📜index.css
 ┣ 📜main.tsx
 ┗ 📜vite-env.d.ts
```

---

## 주요 구현 기능

- **PDF 미리보기**

  - `react-pdf`로 PDF 렌더링, 페이지 네비게이션 구현
  - 각 섹션별로 bbox 기반 오버레이 박스 표시

- **JSON 데이터 패널**

  - 섹션 단위로 블록을 구성하고, 표/이미지 등의 요소를 구분하여 출력
  - 상단 `Preview`, `HTML`, `JSON` 탭을 구분하여 향후 확장할 수 있도록 함. (과제 구현 부분은 `JSON`)

- **양방향 인터랙션**

  - **PDF → JSON**
    - PDF에서 각 섹션 hover 시, 우측 JSON 패널 해당 항목으로 스크롤 및 강조
  - **JSON → PDF**
    - 텍스트 블록 클릭 시, PDF 오버레이 박스 표시 및 해당 영역으로 스크롤

---

## 리팩토링 및 구조 개선

- **컴포넌트 분리**

  - 역할별로 컴포넌트 분리
  - 각 컴포넌트에서 필요한 타입 선언도 별도 파일로 분리하여 관리

- **상태 관리 최적화**

  - App에서 상태를 객체로 묶어 관리, props drilling 최소화

- **유지보수성/확장성 강화**
  - `report.json`의 데이터 구조와 유사한 PDF 파일이라면(ex. body.children의 논리적 순서 등) 복잡한 문서라도 쉽게 대응 가능하도록 설계

---

## 실행 방법

```bash
yarn install
yarn dev
```
