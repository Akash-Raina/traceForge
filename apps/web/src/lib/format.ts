export function getDuration(
  startedAt: string,
  endedAt?: string,
) {
  if (!endedAt) return "-";

  const duration =
    new Date(endedAt).getTime() -
    new Date(startedAt).getTime();

  if (duration < 1000) {
    return `${duration}ms`;
  }

  return `${(duration / 1000).toFixed(2)}s`;
}
