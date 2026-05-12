import React from "react";

interface LineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, width = 600, height = 200, color = "#c89b5e" }) => {
  const padding = 12;
  const w = width - padding * 2;
  const h = height - padding * 2;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * w + padding;
    const y = padding + h - ((d - min) / range) * h;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;

  // simple area path
  const areaD = `M ${points[0]} L ${points.join(" L ")} L ${w + padding},${h + padding} L ${padding},${h + padding} Z`;

  return (
    <svg width={width} height={height} role="img" aria-label="line chart">
      <defs>
        <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x={0} y={0} width={width} height={height} fill="transparent" />
      <path d={areaD} fill="url(#chartGrad)" stroke="none" />
      <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

      {/* mini dots */}
      {data.map((d, i) => {
        const [xStr, yStr] = points[i].split(",");
        return <circle key={i} cx={Number(xStr)} cy={Number(yStr)} r={i === data.length - 1 ? 3.5 : 2} fill={color} />;
      })}
    </svg>
  );
};

export default LineChart;
