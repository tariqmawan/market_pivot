import React from "react";
import Chart from "chart.js/auto";

interface ChartJSLineProps {
  data: number[];
  labels?: string[];
  width?: number;
  height?: number;
  color?: string;
}

const ChartJSLine: React.FC<ChartJSLineProps> = ({
  data,
  labels,
  width = 800,
  height = 300,
  color = "#c89b5e",
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const chartRef = React.useRef<Chart | null>(null);

  const safeLabels = React.useMemo(() => {
    if (labels && labels.length === data.length) return labels;
    return data.map((_, i) => String(i));
  }, [labels, data]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // If chart exists, update dataset + labels and stop.
    if (chartRef.current) {
      // @ts-ignore - chart.js types are complex
      chartRef.current.data.labels = safeLabels;
      // @ts-ignore
      chartRef.current.data.datasets[0].data = data;
      chartRef.current.update();
      return;
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `${color}33`); // ~20%
    gradient.addColorStop(1, `${color}00`);

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: safeLabels,
        datasets: [
          {
            label: "Price",
            data,
            borderColor: color,
            backgroundColor: gradient,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.35,
            borderWidth: 2,
            borderJoinStyle: "round",
            // @ts-ignore (Chart.js supports shadows via ctx)
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        animation: {
          duration: 500,
        },
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          x: {
            display: false,
            grid: { display: false },
          },
          y: {
            display: true,
            grid: {
              color: "rgba(255,255,255,0.06)",
            },
            ticks: {
              color: "rgba(255,255,255,0.65)",
              maxTicksLimit: 4,
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(10, 14, 22, 0.95)",
            borderColor: "rgba(255,255,255,0.12)",
            borderWidth: 1,
            titleColor: "rgba(255,255,255,0.92)",
            bodyColor: "rgba(255,255,255,0.78)",
            padding: 10,
            callbacks: {
              label: (ctx) => ` ${Number(ctx.parsed?.y ?? 0).toFixed(2)}`,
            },
          },
        },
      },
    });

    return () => {
      try {
        chartRef.current?.destroy();
      } catch {
        // ignore
      }
      chartRef.current = null;
    };
  }, [data, safeLabels, color, height]);

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        display: "block",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))",
        borderRadius: 14,
        padding: 10,
        boxShadow: "0 12px 30px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default ChartJSLine;

