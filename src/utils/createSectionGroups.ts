import type { ReportJson } from "../types/report";
import getGroupBoundingBox from "./getGroupBoundingBox";

export interface SectionGroup {
  groupIdx: number;
  header: string;
  contents: string[];
  bbox: ReturnType<typeof getGroupBoundingBox>;
}

export function createSectionGroups(jsonData: ReportJson): SectionGroup[] {
  const { texts, groups } = jsonData;
  const result: SectionGroup[] = [];

  // section_header의 인덱스 목록
  const sectionHeaderIndices = texts
    .map((t, i) => (t.label === "section_header" ? i : -1))
    .filter((i) => i !== -1);

  for (let s = 0; s < sectionHeaderIndices.length; s++) {
    const headerIdx = sectionHeaderIndices[s];
    const nextHeaderIdx = sectionHeaderIndices[s + 1] ?? texts.length;
    const header = texts[headerIdx].text ?? "";

    // 해당 구간에 속하는 group 모두 찾기
    const sectionGroups = groups
      .map((g, groupIdx) => {
        const firstChildIdx = Number(g.children[0]?.$ref.split("/").pop());
        if (firstChildIdx > headerIdx && firstChildIdx < nextHeaderIdx) {
          const groupTexts = g.children
            .map((child) => {
              const idx = Number(child.$ref.split("/").pop());
              return texts[idx]?.text ?? "";
            })
            .filter((text) => !!text);
          const bbox = getGroupBoundingBox(g, texts);
          return {
            groupIdx,
            header,
            contents: groupTexts,
            bbox,
          };
        }
        return null;
      })
      .filter((g): g is SectionGroup => !!g);

    result.push(...sectionGroups);
  }

  return result;
}
