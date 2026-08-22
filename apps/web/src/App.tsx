import { useEffect, useState } from "react";
import TraceDetails from "./components/TraceDetails";
import { getTrace, getTraces } from "./lib/api";
import { getDuration } from "./lib/format";
import type { Trace, TraceDetail as TraceDetailType } from "./types/trace";

function App() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);

  const [selectedTrace, setSelectedTrace] = useState<TraceDetailType | null>(
    null,
  );

  // Fetch all traces
  useEffect(() => {
    getTraces()
      .then((response) => {
        setTraces(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Fetch selected trace
  useEffect(() => {
    if (!selectedTraceId) return;
    
    getTrace(selectedTraceId).then((response) => {
      setSelectedTrace(response.trace);
    });
  }, [selectedTraceId]);

  if (loading) {
    return <div className="p-8">Loading traces...</div>;
  }

  // Show trace detail
  if (selectedTraceId) {
    if (!selectedTrace) {
      return <div className="p-8">Loading trace...</div>;
    }

    return (
      <TraceDetails
        trace={selectedTrace}
        onBack={() => {
          setSelectedTraceId(null);
          setSelectedTrace(null);
        }}
      />
    );
  }

  // Show trace list
  return (
    <main className="min-h-screen bg-gray-500 p-8">
      <h1 className="mb-6 text-3xl font-bold">TraceForge</h1>

      {traces.map((trace) => (
        <div
          key={trace.id}
          onClick={() => setSelectedTraceId(trace.id)}
          className="mb-3 cursor-pointer rounded-lg border bg-white p-4 hover:bg-gray-50"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{trace.name}</h2>

            <span className="text-sm">{trace.status}</span>
          </div>

          <div className="mt-2 flex gap-6 text-sm text-gray-500">
            <span>Duration: {getDuration(trace.startedAt, trace.endedAt)}</span>

            <span>{new Date(trace.startedAt).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </main>
  );
}

export default App;
