import type { TraceDetail } from "../types/trace";
import SpanTree from "./SpanTree";

interface TraceDetailProps {
  trace: TraceDetail;
  onBack: () => void;
}

function TraceDetails({ trace, onBack }: TraceDetailProps) {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={onBack}
        className="mb-6 rounded-md border bg-white px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
      >
        ← Back
      </button>

      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{trace.name}</h1>

            <p className="mt-1 text-sm text-gray-500">{trace.id}</p>
          </div>

          <span className="rounded-full border px-3 py-1 text-sm">
            {trace.status}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Started</p>
            <p className="font-medium">
              {new Date(trace.startedAt).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Ended</p>
            <p className="font-medium">
              {trace.endedAt ? new Date(trace.endedAt).toLocaleString() : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Spans</p>
            <p className="font-medium">{trace.spans.length}</p>
          </div>
        </div>
        <h2 className="mt-8 mb-4 text-xl font-semibold">Execution</h2>

        <SpanTree spans={trace.spans} />

        {trace.evaluations.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-semibold">Evaluations</h2>

            <div className="space-y-3">
              {trace.evaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="rounded-lg border bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{evaluation.name}</h3>

                    <span className="font-semibold">
                      {(evaluation.score * 100).toFixed(0)}%
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    {evaluation.reason}
                  </p>

                  <div className="mt-3 text-xs text-gray-400">
                    {evaluation.provider} · {evaluation.model}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default TraceDetails;
