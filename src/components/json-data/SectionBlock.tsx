import type { SectionBlockProps } from "../../types/json-data/types";
import { TableRenderer } from "./TableRenderer";
import { PictureRenderer } from "./PictureRenderer";

export function SectionBlock({
  section,
  isSelected,
  isHovered,
  onClick,
  innerRef,
}: SectionBlockProps) {
  return (
    <div
      ref={innerRef}
      className={`bg-gray-50 rounded-lg p-6 shadow-sm mb-2 transition-colors duration-200 cursor-pointer ${
        isSelected || isHovered
          ? "border-2 border-yellow-400 bg-yellow-200/20"
          : ""
      }`}
      onClick={onClick}
    >
      <div className="text-lg font-bold text-gray-800 mb-2">
        {section.header}
      </div>
      <div className="space-y-1">
        {section.contents.map((content, i) => {
          if (content.type === "group") {
            return content.texts.map((line, j) => (
              <div
                key={"g" + i + "-" + j}
                className="text-gray-800 text-[15px]"
              >
                {line}
              </div>
            ));
          }
          if (content.type === "text") {
            return (
              <div key={"t" + i} className="my-2">
                {content.text}
              </div>
            );
          }
          if (content.type === "table") {
            const table = content.value;
            const grid = table.data?.grid ?? [];
            return (
              <div key={"t" + i} className="my-2">
                <TableRenderer grid={grid} />
              </div>
            );
          }
          if (content.type === "picture") {
            const picture = content.value;
            const uri = picture.image?.uri;
            return (
              <div key={"p" + i} className="my-2">
                <PictureRenderer uri={uri} />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
