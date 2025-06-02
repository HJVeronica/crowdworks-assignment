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

export interface TextBlock {
  self_ref: string;
  text?: string;
  prov?: Prov[];
  label?: string;
  orig?: string;
  [key: string]: unknown;
}

export interface ReportJson {
  texts: TextBlock[];
  // 필요시 groups, tables 등 추가
}
