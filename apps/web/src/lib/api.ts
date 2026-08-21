const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_TRACEFORGE_API_KEY;

export async function getTraces() {
  const response = await fetch(`${API_URL}/traces`, {
    headers: {
      "X-API-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch traces");
  }

  return response.json();
}

export async function getTrace(traceId: string) {
  const response = await fetch(`${API_URL}/traces/${traceId}`, {
    headers: {
      "X-API-Key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch trace");
  }

  return response.json();
}
