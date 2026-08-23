import { useEffect, useState } from "react";
import TraceDetails from "./components/TraceDetails";
import { getTrace, getTraces } from "./lib/api";
import type {
  Trace,
  TraceDetail,
  TraceDetailResponse,
  TracesResponse,
} from "./types/trace";

function App() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [noTraces, setNoTraces] = useState(false);
  const [loading, setLoading] = useState(true);

  const [traceData, setTraceData] = useState<TraceDetail | null>(null);

  const [traceId, setTraceId] = useState<string | null>(null);

  const [showTraceDetails, setShowTraceDetails] = useState(false);

  // Fetch all traces
  useEffect(() => {
    getTraces()
      .then((response: TracesResponse) => {
        console.log("traces response", response);

        setTraces(response.traces);
      })
      .catch((error) => {
        console.error("Failed to fetch traces:", error);
        setNoTraces(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Fetch selected trace
  useEffect(() => {
    if (!traceId) return;

    getTrace(traceId)
      .then((response: TraceDetailResponse) => {
        console.log("trace response", response);

        setTraceData(response.trace);
        setShowTraceDetails(true);
      })
      .catch((error) => {
        console.error("Failed to fetch trace:", error);
      })
      .finally(() => {
        // We can add trace-specific loading here later
      });
  }, [traceId]);

  // Show trace details
  if (showTraceDetails && traceData) {
    return (
      <TraceDetails
        trace={traceData}
        onBack={() => {
          setShowTraceDetails(false);
          setTraceId(null);
          setTraceData(null);
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gray-500 p-8">
      <h1 className="mb-6 text-3xl font-bold">TraceForge</h1>

      {loading ? (
        <div>...loading traces</div>
      ) : noTraces ? (
        <div>Failed to fetch traces</div>
      ) : traces.length === 0 ? (
        <div>No traces found</div>
      ) : (
        <div className="space-y-3">
          {traces.map((trace) => (
            <div
              key={trace.id}
              className="cursor-pointer rounded border-2 bg-amber-300 p-4"
              onClick={() => {
                setTraceId(trace.id);
              }}
            >
              <div>{trace.name}</div>
              <div>{trace.startedAt}</div>
              <div>{trace.status}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;
