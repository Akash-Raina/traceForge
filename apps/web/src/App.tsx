import { useEffect, useState } from "react";
import { getTraces } from "./lib/api";
import { getDuration } from "./lib/format";
import type { Trace } from "./types/trace";

function App() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTraces()
      .then((response) => {
        setTraces(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8">Loading traces...</div>;
  }

  return (
    <main className="min-h-screen p-8 bg-gray-500">
      <h1 className="mb-6 text-3xl font-bold">TraceForge</h1>

      {traces.map((trace) => (
        <div key={trace.id} className="mb-3 rounded-lg border bg-white p-4">
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
