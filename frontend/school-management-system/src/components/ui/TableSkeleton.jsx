export default function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="animate-pulse p-4" aria-label="Loading table" role="status">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 border-b border-slate-800/70 py-4 last:border-b-0">
          {Array.from({ length: cols }, (_, columnIndex) => (
            <div
              key={columnIndex}
              className="h-4 flex-1 rounded bg-slate-800/80"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
