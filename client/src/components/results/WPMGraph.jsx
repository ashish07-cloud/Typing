import { useMemo, useRef, useEffect, useState } from "react";

export default function WPMGraph({ timeline = [] }) {
  const pathRef = useRef(null);
  const [isAnimated, setIsAnimated] = useState(false);

  // Calculate graph coordinates and paths
  const graph = useMemo(() => {
    if (!timeline || timeline.length < 2) return null;

    const width = 1000;
    const height = 320;
    const padding = 70;

    const max = Math.max(...timeline);
    const min = Math.min(...timeline);

    // Dynamic Y-axis upper bound with minimum headroom of 10
    const yMax = Math.ceil(Math.max(max * 1.15, max + 10));
    const yMin = 0; // baseline

    const xStep = (width - padding * 2) / (timeline.length - 1);
    const yScale = (height - padding * 2) / (yMax - yMin || 1);

    const coords = timeline.map((value, i) => ({
      x: padding + i * xStep,
      y: height - padding - (value - yMin) * yScale,
    }));

    // Path for the line
    const linePath = coords.reduce(
      (acc, point, i) =>
        i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`,
      ""
    );

    // Path for the filled area (closed to baseline)
    const fillPath = `
      ${linePath} 
      L ${coords[coords.length - 1].x} ${height - padding} 
      L ${coords[0].x} ${height - padding} 
      Z
    `;

    return {
      linePath,
      fillPath,
      coords,
      width,
      height,
      padding,
      yMax,
      yMin,
      totalSeconds: timeline.length,
    };
  }, [timeline]);

  // Trigger animation after component mounts or timeline changes
  useEffect(() => {
    if (!graph) return;

    setIsAnimated(false); // reset animation

    // Small delay to ensure DOM is ready, then start animation
    const timer = setTimeout(() => {
      setIsAnimated(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [graph]);

  // Update stroke-dasharray/offset based on path length and animation state
  useEffect(() => {
    if (pathRef.current && graph) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = isAnimated ? 0 : length;
    }
  }, [graph, isAnimated]);

  if (!graph)
    return (
      <div className="text-sub font-mono text-sm">
        Not enough data for graph...
      </div>
    );

  const yTicks = 5;
  const xTicks = Math.min(8, graph.totalSeconds);

  return (
    <div className="w-full">
      <h3 className="text-sub text-xs font-mono mb-6 uppercase tracking-widest">
        WPM Over Time
      </h3>

      <svg
        viewBox={`0 0 ${graph.width} ${graph.height}`}
        className="w-full h-auto overflow-visible"
        style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--main-color)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--main-color)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* ===== Y-AXIS GRID AND LABELS ===== */}
        {Array.from({ length: yTicks }).map((_, i) => {
          const ratio = i / (yTicks - 1);
          const value = graph.yMax - ratio * (graph.yMax - graph.yMin);
          const y = graph.padding + ratio * (graph.height - graph.padding * 2);

          return (
            <g key={i}>
              <line
                x1={graph.padding}
                x2={graph.width - graph.padding}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeWidth="1"
              />
              <text
                x={graph.padding - 16}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="currentColor"
                opacity="0.6"
                className="font-mono"
              >
                {Math.round(value)}
              </text>
            </g>
          );
        })}

        {/* ===== X-AXIS LABELS AND TICKS ===== */}
        {Array.from({ length: xTicks }).map((_, i) => {
          const ratio = i / (xTicks - 1);
          const second = Math.round(ratio * graph.totalSeconds);
          const x = graph.padding + ratio * (graph.width - graph.padding * 2);

          return (
            <g key={i}>
              <line
                x1={x}
                x2={x}
                y1={graph.height - graph.padding}
                y2={graph.height - graph.padding + 8}
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
              <text
                x={x}
                y={graph.height - graph.padding + 24}
                textAnchor="middle"
                fontSize="11"
                fill="currentColor"
                opacity="0.7"
                className="font-mono"
              >
                {second}s
              </text>
            </g>
          );
        })}

        {/* ===== GRADIENT FILL (fades in) ===== */}
        <path
          d={graph.fillPath}
          fill="url(#lineGradient)"
          stroke="none"
          style={{
            transition: "opacity 1s ease",
            opacity: isAnimated ? 1 : 0,
          }}
        />

        {/* ===== MAIN LINE (draws from left to right) ===== */}
        <path
          ref={pathRef}
          d={graph.linePath}
          fill="none"
          stroke="var(--main-color)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "stroke-dashoffset 4s ease-in-out",
          }}
        />

        {/* ===== DATA POINTS (staggered fade-in) ===== */}
        {graph.coords.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="5"
            fill="var(--main-color)"
            stroke="var(--bg-color)"
            strokeWidth="2"
            style={{
              transition: "opacity 0.5s ease",
              opacity: isAnimated ? 1 : 0,
              transitionDelay: isAnimated ? `${0.5 + i * 0.02}s` : "0s",
            }}
            onMouseEnter={(e) => (e.target.r.baseVal.value = 7)}
            onMouseLeave={(e) => (e.target.r.baseVal.value = 5)}
          >
            <title>{`${Math.round(timeline[i])} WPM`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}