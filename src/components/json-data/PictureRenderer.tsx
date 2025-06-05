import type { PictureRendererProps } from "../../types/json-data/types";

export function PictureRenderer({ uri }: PictureRendererProps) {
  if (!uri) return null;
  return (
    <img
      src={uri}
      alt="picture"
      className="max-w-full max-h-60 rounded border"
      style={{ objectFit: "contain" }}
    />
  );
}
