import type { TableRendererProps } from "../../types/json-data/types";

export function TableRenderer({ grid }: TableRendererProps) {
  const rendered: boolean[][] = Array.from({ length: grid.length }, () =>
    Array(grid[0]?.length || 0).fill(false)
  );
  return (
    <table className="table-auto max-w-full border">
      <tbody>
        {grid.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {row.map((cell, colIdx) => {
              if (rendered[rowIdx][colIdx]) return null;
              const colSpan = cell.col_span || 1;
              const rowSpan = cell.row_span || 1;

              for (let r = rowIdx; r < rowIdx + rowSpan; r++) {
                for (let c = colIdx; c < colIdx + colSpan; c++) {
                  if (r !== rowIdx || c !== colIdx) rendered[r][c] = true;
                }
              }
              return (
                <td
                  key={colIdx}
                  className="border px-4 py-1"
                  colSpan={colSpan}
                  rowSpan={rowSpan}
                >
                  {cell.text}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
