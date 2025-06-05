import type { TabBarProps } from "../../types/json-data/types";

export function TabBar({ tabs, selected, onTabChange }: TabBarProps) {
  return (
    <div className="flex gap-2 px-6 pt-4 pb-2">
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          className={`px-4 py-1 rounded-t font-semibold focus:outline-none transition-colors duration-150 ${
            selected === key
              ? "bg-yellow-400 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-yellow-100"
          }`}
          onClick={() => onTabChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
