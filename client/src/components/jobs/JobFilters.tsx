import { useState } from "react";

interface Props {
  onSearch: (value: string) => void;
  onStatus: (value: string) => void;
  onPriority: (value: string) => void;
}

export default function JobFilters({ onSearch, onStatus, onPriority }: Props) {
  const [search, setSearch] = useState("");

  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onSearch(e.target.value);
        }}
        placeholder="Search company or role..."
        className="flex-1 rounded-lg border p-3"
      />

      <select
        onChange={(e) => onStatus(e.target.value)}
        className="rounded-lg border p-3"
      >
        <option value="All">All Status</option>
        <option>Applied</option>
        <option>Interview</option>
        <option>Offer</option>
        <option>Rejected</option>
      </select>

      <select
        onChange={(e) => onPriority(e.target.value)}
        className="rounded-lg border p-3"
      >
        <option value="All">All Priority</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
    </div>
  );
}
