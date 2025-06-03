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

export interface Group {
  self_ref: string;
  parent: { $ref: string };
  children: { $ref: string }[];
  content_layer: string;
  name: string;
  label: string;
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
  groups: Group[];
}
