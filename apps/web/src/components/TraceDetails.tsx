import { getDuration } from "../lib/format";
import type { TraceDetail } from "../types/trace";
import SpanTree from "./SpanTree";

interface TraceDetailsProps {
  trace: TraceDetail;
  onBack: () => void;
}

function TraceDetails({ trace, onBack }: TraceDetailsProps) {
  return (
    <div className="min-w-0 flex-1">
      {/* Trace Header */}
      <section className="rounded-2xl border border-black/5 bg-white/80 p-5 shadow-sm sm:p-6">
        {/* Back */}
        <button
          type="button"
          onClick={onBack}
          className="mb-5 text-sm text-gray-400 transition hover:text-gray-900"
        >
          ← Back to traces
        </button>

        {/* Title */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="truncate text-2xl font-semibold tracking-tight">
                {trace.name}
              </h1>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  trace.status === "SUCCESS"
                    ? "bg-green-50 text-green-600"
                    : trace.status === "ERROR"
                      ? "bg-red-50 text-red-600"
                      : "bg-yellow-50 text-yellow-600"
                }`}
              >
                {trace.status}
              </span>
            </div>

            <p className="mt-2 max-w-full truncate text-xs text-gray-400">
              {trace.id}
            </p>
          </div>

          {/* Duration */}
          <div className="shrink-0 sm:text-right">
            <p className="text-xs text-gray-400">Duration</p>

            <p className="mt-1 text-xl font-semibold">
              {getDuration(trace.startedAt, trace.endedAt)}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-black/5 pt-5 sm:grid-cols-4">
          <Metric
            label="Started"
            value={new Date(trace.startedAt).toLocaleString()}
          />

          <Metric label="Spans" value={String(trace.spans.length)} />

          <Metric
            label="Evaluations"
            value={String(trace.evaluations.length)}
          />

          <Metric label="Status" value={trace.status} />
        </div>
      </section>

      {/* Execution + Evaluations */}
      <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Execution */}
        <section className="min-w-0 rounded-2xl border border-black/5 bg-white/80 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Execution Trace</h2>

              <p className="mt-1 text-xs text-gray-400">
                {trace.spans.length} spans recorded
              </p>
            </div>

            <span className="rounded-lg bg-[#F5F5EE] px-2.5 py-1.5 text-xs text-gray-500">
              {getDuration(trace.startedAt, trace.endedAt)}
            </span>
          </div>

          <SpanTree spans={trace.spans} />
        </section>

        {/* Evaluations */}
        <section className="min-w-0 rounded-2xl border border-black/5 bg-white/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Evaluations</h2>

              <p className="mt-1 text-xs text-gray-400">
                LLM-as-a-judge results
              </p>
            </div>

            <span className="rounded-lg bg-[#F5F5EE] px-2.5 py-1.5 text-xs text-gray-500">
              {trace.evaluations.length}
            </span>
          </div>

          {trace.evaluations.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-black/10 p-6 text-center">
              <p className="text-sm text-gray-400">No evaluations available.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {trace.evaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="rounded-xl border border-black/5 bg-[#F5F5EE] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {evaluation.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {evaluation.provider}
                      </p>
                    </div>

                    <span className="text-2xl font-semibold text-green-600">
                      {(evaluation.score * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="mt-4 rounded-lg bg-white p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Reasoning
                    </p>

                    <p className="mt-2 wrap-break-words text-sm leading-6 text-gray-600">
                      {evaluation.reason}
                    </p>
                  </div>

                  <p className="mt-3 wrap-break-words text-xs text-gray-400">
                    Model: {evaluation.model}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="min-w-0 rounded-xl bg-[#F5F5EE] p-3">
      <p className="text-xs text-gray-400">{label}</p>

      <p className="mt-1 truncate text-sm font-medium">{value}</p>
    </div>
  );
}

export default TraceDetails;
