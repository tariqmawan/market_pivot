import React from "react";
import Chart from "chart.js/auto";

interface ChartJSLineProps {
  data: number[];
  labels?: string[];
  width?: number;
  height?: number;
  color?: string;
}

const ChartJSLine: React.FC<ChartJSLineProps> = ({ data, labels, width = 800, height = 300, color = "#c89b5e" }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const chartRef = React.useRef<Chart | null>(null);

  React.useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) {
      // @ts-ignore
      chartRef.current.data.labels = labels ?? data.map((_, i) => String(i));
      // @ts-ignore
      chartRef.current.data.datasets[0].data = data;
      chartRef.current.update();
      return;
    }

    // @ts-ignore - Chart type is complex; instantiate via Chart
    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels ?? data.map((_, i) => String(i)),
        datasets: [
          {
            label: "Price",
            data,
            borderColor: color,
            backgroundColor: "rgba(200,155,94,0.12)",
            fill: true,
            pointRadius: 0,
            tension: 0.25,
          },
        ],
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: { display: true },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });

    return () => {
      try {
        chartRef.current?.destroy();
      } catch (e) {
        // ignore
      }
      chartRef.current = null;
    };
  }, [data, labels, color]);

  return (
    <div style={{ width, height }}>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
};

export default ChartJSLine;
