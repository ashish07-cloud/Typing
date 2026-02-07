/**
 * Simple moving average smoothing
 * windowSize = how many points to average
 */
export function smoothWPM(data, windowSize = 3) {
  if (!Array.isArray(data)) return [];
  if (data.length <= 2) return data;

  return data.map((_, index) => {
    const start = Math.max(0, index - windowSize + 1);
    const slice = data.slice(start, index + 1);

    const avg =
      slice.reduce((sum, v) => sum + v, 0) /
      slice.length;

    return Math.round(avg);
  });
}
