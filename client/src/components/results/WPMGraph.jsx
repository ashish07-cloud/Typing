import { smoothWPM } from "../../utils/smoothTelemetry";

export default function WPMGraph({ data }) {
  if (!data || data.length < 2) return null;

  const width = 600;
  const height = 160;
  const padding = 20;

  const smoothedData = smoothWPM(data, 3);

  // scale using raw data (important!)
  const maxWPM = Math.max(...data, 20);

  const points = smoothedData.map((wpm, index) => {
    const x =
      padding + (index / (smoothedData.length - 1)) * (width - padding * 2);

    // if (smoothedData < 2) {
    //   return null;
    // }

    const y = height - padding - (wpm / maxWPM) * (height - padding * 2);

    return `${x},${y}`;
  });

  const polylinePoints = points.join(" ");

  return (
    <div className="mt-8">
      <h3 className="mb-2 text-sm font-medium text-olive-700">WPM over time</h3>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full rounded-lg border border-creamy-300 bg-creamy-100"
      >
        {/* grid */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#d6d3c4"
          strokeWidth="1"
        />

        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#d6d3c4"
          strokeWidth="1"
        />

        {/* line */}
        <polyline
          fill="none"
          stroke="#6B8E23"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={polylinePoints}
        />

        {/* points */}
        {points.map((point, i) => {
          const [x, y] = point.split(",");

          return <circle key={i} cx={x} cy={y} r="2.5" fill="#6B8E23" />;
        })}
      </svg>
    </div>
  );
}
