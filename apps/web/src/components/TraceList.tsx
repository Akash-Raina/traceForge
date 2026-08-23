import { getDuration } from "../lib/format";
import type { Trace } from "../types/trace";

interface TraceListProps {
  traces: Trace[];
  selectedTraceId: string | null;
  onSelect: (traceId: string) => void;
}

function TraceList({ traces, selectedTraceId, onSelect }: TraceListProps) {
  return (
    <div className="w-full shrink-0 rounded-2xl border border-black/5 bg-white/70 p-3 shadow-sm xl:w-105">
      {/* Header */}
      <div className="border-b border-black/5 px-3 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Traces</h2>

            <p className="mt-1 text-xs text-gray-400">{traces.length} traces</p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 flex items-center rounded-xl border border-black/10 bg-[#F5F5EE] px-3">
          <span className="text-gray-400">⌕</span>

          <input
            placeholder="Search traces..."
            className="w-full min-w-0 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Trace rows */}
      <div className="mt-3 space-y-2">
        {traces.map((trace) => {
          const selected = trace.id === selectedTraceId;

          const statusStyles =
            trace.status === "SUCCESS"
              ? "bg-green-50 text-green-600"
              : trace.status === "ERROR"
                ? "bg-red-50 text-red-600"
                : "bg-yellow-50 text-yellow-600";

          return (
            <button
              key={trace.id}
              type="button"
              onClick={() => onSelect(trace.id)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-black/10 bg-[#F5F5EE] shadow-sm"
                  : "border-transparent hover:border-black/5 hover:bg-[#F5F5EE]/60"
              }`}
            >
              {/* Name + status */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {trace.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-400">
                    {trace.id}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${statusStyles}`}
                >
                  {trace.status}
                </span>
              </div>

              {/* Metadata */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
                <span>{getDuration(trace.startedAt, trace.endedAt)}</span>

                <span>{new Date(trace.startedAt).toLocaleString()}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TraceList;
