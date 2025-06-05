// PDF 내 bbox, page_no 등 prov 정보
export interface Prov {
  page_no: number;
  bbox: {
    l: number;
    t: number;
    r: number;
    b: number;
    coord_origin: string;
  };
  charspan?: number[];
}

// 텍스트, 표, 그림 등으로 이뤄진 그룹
export interface Group {
  self_ref: string;
  parent: { $ref: string };
  children: { $ref: string }[];
  content_layer: string;
  name: string;
  label: string;
}

// PDF 내 텍스트 블록(문단, 문장 등)
export interface TextBlock {
  self_ref: string;
  text?: string;
  prov?: Prov[];
  label?: string;
  orig?: string;
  [key: string]: unknown;
  bbox?: {
    l: number;
    t: number;
    r: number;
    b: number;
    page_no: number;
    coord_origin?: string;
  };
}

// 표(Table) 정보
export interface Table {
  self_ref: string;
  bbox: { l: number; t: number; r: number; b: number; page_no: number };
  data?: {
    grid: { text: string; col_span?: number; row_span?: number }[][];
  };
}

// 이미지 메타데이터
export interface PictureImage {
  uri?: string;
  dpi?: number;
  mimetype?: string;
  size?: { width: number; height: number };
  // 필요한 필드 추가
}

// PDF 내 이미지 정보
export interface Picture {
  self_ref: string;
  bbox: { l: number; t: number; r: number; b: number; page_no: number };
  image?: PictureImage;
}

// body.children의 각 요소(참조값)
export interface BodyChild {
  $ref: string;
}

// 문서의 논리적 구조(본문 순서 등)
export interface Body {
  children: BodyChild[];
}

// 전체 report JSON의 최상위 타입
export interface ReportJson {
  texts: TextBlock[];
  groups: Group[];
  tables?: Table[];
  pictures?: Picture[];
  body: Body;
}
