import type {
  ReportJson,
  Group,
  Table,
  Picture,
  TextBlock,
} from "../types/parsed-pdf/types";
import getGroupBoundingBox from "./getGroupBoundingBox";

export interface SectionGroup {
  groupIdx: number;
  header: string;
  contents: (
    | {
        type: "group";
        value: Group;
        texts: string[];
        bbox: ReturnType<typeof getGroupBoundingBox>;
      }
    | { type: "table"; value: Table; bbox: Table["bbox"] }
    | { type: "picture"; value: Picture; bbox: Picture["bbox"] }
    | {
        type: "text";
        value: TextBlock;
        text: string;
        bbox: ReturnType<typeof getGroupBoundingBox>;
      }
  )[];
  bbox: { l: number; t: number; r: number; b: number; page_no: number };
}

export function createSectionGroups(jsonData: ReportJson): SectionGroup[] {
  const { texts, groups, tables = [], pictures = [], body } = jsonData;
  const result: SectionGroup[] = [];
  let currentSection: SectionGroup | null = null;
  let groupIdx = 0;

  // body.children을 순회하며 순서대로 각 요소를 처리
  for (const child of body.children) {
    if (child.$ref.startsWith("#/texts/")) {
      const text = texts.find((t: TextBlock) => t.self_ref === child.$ref);

      // section_header를 만나면 새 섹션 시작
      if (text?.label === "section_header") {
        if (currentSection) result.push(currentSection);
        currentSection = {
          groupIdx: groupIdx++,
          header: text.text ?? "",
          contents: [],
          bbox: { l: 0, t: 0, r: 0, b: 0, page_no: 0 },
        };
      } else if (text && currentSection) {
        // section_header가 아닌 text도 그룹에 추가
        const bbox =
          (text.prov && text.prov[0]?.bbox) ||
          (typeof text.bbox === "object" ? text.bbox : undefined);
        if (bbox) {
          const bboxWithoutCoord = { ...bbox };
          delete (bboxWithoutCoord as { coord_origin?: string }).coord_origin;
          currentSection.contents.push({
            type: "text",
            value: text,
            text: text.text ?? "",
            bbox: {
              ...bboxWithoutCoord,
              page_no: Number(text.prov?.[0]?.page_no ?? text.page_no ?? 0),
            },
          });
        }
      }
    } else if (child.$ref.startsWith("#/groups/")) {
      const group = groups.find((g: Group) => g.self_ref === child.$ref);

      if (group && currentSection) {
        // group의 children에서 텍스트 추출
        const groupTexts = group.children
          .map(
            (c) =>
              texts.find((t: TextBlock) => t.self_ref === c.$ref)?.text ?? ""
          )
          .filter(Boolean);
        // group bbox 계산
        const bbox = getGroupBoundingBox(group, texts);
        currentSection.contents.push({
          type: "group",
          value: group,
          texts: groupTexts,
          bbox,
        });
      }
    } else if (child.$ref.startsWith("#/tables/")) {
      const table = tables.find((t: Table) => t.self_ref === child.$ref);

      if (table && currentSection) {
        const bbox =
          table.bbox ??
          (table as Table & { prov?: { bbox: Table["bbox"] }[] }).prov?.[0]
            ?.bbox;
        if (bbox) {
          currentSection.contents.push({
            type: "table",
            value: table,
            bbox,
          });
        }
      }
    } else if (child.$ref.startsWith("#/pictures/")) {
      const picture = pictures.find((p: Picture) => p.self_ref === child.$ref);

      if (picture && currentSection) {
        const bbox =
          picture.bbox ??
          (picture as Picture & { prov?: { bbox: Picture["bbox"] }[] })
            .prov?.[0]?.bbox;
        if (bbox) {
          currentSection.contents.push({
            type: "picture",
            value: picture,
            bbox,
          });
        }
      }
    }
  }
  if (currentSection) result.push(currentSection);

  // 각 섹션의 bbox는 포함된 모든 contents의 bbox를 합쳐서 계산
  for (const section of result) {
    const bboxes = section.contents.map((c) => c.bbox).filter(Boolean) as {
      l: number;
      t: number;
      r: number;
      b: number;
      page_no: number;
    }[];
    if (bboxes.length) {
      const pageNo = bboxes.find((b) => b.page_no !== undefined)?.page_no ?? 0;
      section.bbox = {
        l: Math.min(...bboxes.map((b) => b.l)),
        t: Math.max(...bboxes.map((b) => b.t)),
        r: Math.max(...bboxes.map((b) => b.r)),
        b: Math.min(...bboxes.map((b) => b.b)),
        page_no: pageNo,
      };
    }
  }

  return result;
}
