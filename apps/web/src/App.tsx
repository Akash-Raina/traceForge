import { useEffect, useState } from "react";
import { getTrace, getTraces } from "./lib/api";
import type {
  Trace,
  TraceDetail,
  TraceDetailResponse,
  TracesResponse,
} from "./types/trace";

import Sidebar from "./components/Sidebar";
import TraceDetails from "./components/TraceDetails";
import TraceList from "./components/TraceList";

function App() {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);
  const [noTraces, setNoTraces] = useState(false);

  const [traceId, setTraceId] = useState<string | null>(null);
  const [traceData, setTraceData] = useState<TraceDetail | null>(null);

  const [showTraceDetails, setShowTraceDetails] = useState(false);

  useEffect(() => {
    getTraces()
      .then((response: TracesResponse) => {
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

  useEffect(() => {
    if (!traceId) return;

    getTrace(traceId)
      .then((response: TraceDetailResponse) => {
        setTraceData(response.trace);
        setShowTraceDetails(true);
      })
      .catch((error) => {
        console.error("Failed to fetch trace:", error);
      });
  }, [traceId]);

  const handleSelectTrace = (id: string) => {
    setTraceId(id);
  };

  const handleBack = () => {
    setShowTraceDetails(false);
    setTraceId(null);
    setTraceData(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F5EE]">
        <p className="text-sm text-gray-500">Loading traces...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5EE] lg:flex-row">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        {noTraces ? (
          <div className="flex min-h-[80vh] items-center justify-center">
            <div className="text-center">
              <h1 className="text-lg font-semibold">Failed to fetch traces</h1>

              <p className="mt-2 text-sm text-gray-500">
                Please try again later.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Traces</h1>

              <p className="mt-1 text-sm text-gray-500">
                Monitor and inspect your AI application traces.
              </p>
            </div>

            <div className="flex min-h-[calc(100vh-150px)] min-w-0 flex-col gap-4 xl:flex-row">
              <TraceList
                traces={traces}
                selectedTraceId={traceId}
                onSelect={handleSelectTrace}
              />

              {showTraceDetails && traceData ? (
                <TraceDetails trace={traceData} onBack={handleBack} />
              ) : (
                <div className="flex min-h-125 min-w-0 flex-1 items-center justify-center rounded-2xl border border-black/5 bg-white/50 shadow-sm">
                  <div className="text-center">
                    <h2 className="font-medium text-gray-700">
                      Select a trace
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      Select a trace from the list to inspect its execution.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
