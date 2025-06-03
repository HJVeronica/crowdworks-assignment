import type { Group, TextBlock } from "../types/report";

// 그룹 내 모든 텍스트의 bbox를 합쳐 가장 넓은 영역의 bounding box를 반환
const getGroupBoundingBox = (group: Group, texts: TextBlock[]) => {
  if (!group.children || group.children.length === 0) return null;

  // children의 $ref에서 index 추출
  const getTextIndex = (ref: { $ref: string }) =>
    Number(ref["$ref"].split("/").pop());

  // 그룹 내 모든 텍스트의 bbox 추출
  const bboxes = group.children
    .map((child) => {
      const idx = getTextIndex(child);
      const text = texts[idx];
      return text?.prov?.[0]?.bbox;
    })
    .filter((bbox) => !!bbox);

  if (bboxes.length === 0) return null;

  // 그룹 내 bbox의 min/max 계산 (가장 넓은 영역)
  const left = Math.min(...bboxes.map((b) => b.l));
  const right = Math.max(...bboxes.map((b) => b.r));
  const top = Math.max(...bboxes.map((b) => b.t));
  const bottom = Math.min(...bboxes.map((b) => b.b));
  const page_no = texts[getTextIndex(group.children[0])]?.prov?.[0]?.page_no;

  // 오버레이 박스 위아래에 여백(padding) 추가
  const padding = 5; // pt 단위
  return {
    l: left,
    t: top + padding,
    r: right,
    b: bottom - padding,
    page_no,
  };
};

export default getGroupBoundingBox;
