import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type Time,
} from "lightweight-charts";

/** Generate synthetic OHLCV data for demonstration purposes. */
function generateDemoCandles(count: number): CandlestickData[] {
  const candles: CandlestickData[] = [];
  let time = Math.floor(Date.now() / 1000) - count * 60;
  let close = 1.0842;

  for (let i = 0; i < count; i++) {
    const volatility = 0.0003;
    const open = close;
    const change = (Math.random() - 0.5) * volatility * 2;
    close = parseFloat((open + change).toFixed(5));
    const high = parseFloat(
      (Math.max(open, close) + Math.random() * volatility).toFixed(5)
    );
    const low = parseFloat(
      (Math.min(open, close) - Math.random() * volatility).toFixed(5)
    );

    candles.push({ time: time as Time, open, high, low, close });
    time += 60;
  }
  return candles;
}

/**
 * CandlestickChart — Live OHLCV chart powered by lightweight-charts.
 *
 * Integrates with the Rust/Tauri WebSocket backend to receive real-time
 * tick data and render it as a GPU-accelerated candlestick series.
 */
export default function CandlestickChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ── Create chart instance ────────────────────────────────────
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0a0e1a" },
        textColor: "#546e8a",
        fontSize: 11,
        fontFamily: "'JetBrains Mono', monospace",
      },
      grid: {
        vertLines: { color: "#1e2d4f", style: 1 },
        horzLines: { color: "#1e2d4f", style: 1 },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "#00d4ff",
          width: 1,
          style: 2,
          labelBackgroundColor: "#141e35",
        },
        horzLine: {
          color: "#00d4ff",
          width: 1,
          style: 2,
          labelBackgroundColor: "#141e35",
        },
      },
      rightPriceScale: {
        borderColor: "#1e2d4f",
        textColor: "#546e8a",
      },
      timeScale: {
        borderColor: "#1e2d4f",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 5,
      },
      handleScroll: { vertTouchDrag: false },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });

    // ── Candlestick series ───────────────────────────────────────
    const candleSeries = chart.addCandlestickSeries({
      upColor:          "#00e676",
      downColor:        "#ff1744",
      borderUpColor:    "#00e676",
      borderDownColor:  "#ff1744",
      wickUpColor:      "#00e676",
      wickDownColor:    "#ff1744",
    });

    // ── Volume histogram overlay ─────────────────────────────────
    const volumeSeries = chart.addHistogramSeries({
      color:      "#00d4ff30",
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });
    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
    });

    // ── Load demo / historical candles ───────────────────────────
    const candles = generateDemoCandles(200);
    candleSeries.setData(candles);
    volumeSeries.setData(
      candles.map((c) => ({
        time: c.time,
        value: Math.random() * 5_000_000 + 500_000,
        color: c.close >= c.open ? "#00e67630" : "#ff174430",
      }))
    );

    chart.timeScale().fitContent();

    chartRef.current  = chart;
    seriesRef.current = candleSeries;

    // ── Resize observer ──────────────────────────────────────────
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      chart.applyOptions({ width, height });
    });
    resizeObserver.observe(containerRef.current);

    // ── TODO: Connect to Rust WebSocket via Tauri IPC ────────────
    // When the Tauri backend is running, replace demo data with:
    //
    //   import { listen } from "@tauri-apps/api/event";
    //   const unlisten = await listen<CandlestickData>("tick", (event) => {
    //     seriesRef.current?.update(event.payload);
    //   });
    //
    // The Rust `subscribe_ticks` command establishes the WS connection
    // and emits "tick" events directly into this component.

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded border border-[#1e2d4f]"
      style={{ minHeight: "200px" }}
    />
  );
}
