import Header from "./Header";
import Sidebar from "./Sidebar";
import CandlestickChart from "./CandlestickChart";

/**
 * Dashboard — Bloomberg-style dark-mode trading terminal layout.
 *
 * Layout grid:
 *   ┌─────────────────────────────────────────────────┐
 *   │                   Header (top bar)              │
 *   ├──────────┬──────────────────────────────────────┤
 *   │          │       Main Chart Area                │
 *   │ Sidebar  ├──────────────────────────────────────┤
 *   │          │     Order Book / Analytics Row       │
 *   └──────────┴──────────────────────────────────────┘
 */
export default function Dashboard() {
  return (
    <div className="flex flex-col w-full h-full bg-[#0a0e1a] text-[#e8eaf6] overflow-hidden">
      {/* ── Top Header Bar ── */}
      <Header />

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Sidebar: Watchlist ── */}
        <Sidebar />

        {/* ── Central Workspace ── */}
        <main className="flex flex-col flex-1 overflow-hidden gap-px bg-[#1e2d4f]">
          {/* Primary Chart */}
          <section className="flex-1 bg-[#0a0e1a] p-3 min-h-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold text-[#00d4ff]">
                  EUR/USD
                </span>
                <span className="font-mono text-xs text-[#00e676]">
                  1.08420 ▲ +0.0032 (+0.30%)
                </span>
              </div>
              <div className="flex gap-2 text-xs text-[#546e8a]">
                {["1m", "5m", "15m", "1H", "4H", "1D"].map((tf) => (
                  <button
                    key={tf}
                    className="px-2 py-0.5 rounded hover:bg-[#141e35] hover:text-[#e8eaf6] transition-colors"
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <CandlestickChart />
          </section>

          {/* Bottom Analytics Row */}
          <section className="h-40 bg-[#0a0e1a] p-3 flex gap-px">
            {/* Order Book */}
            <div className="flex-1 bg-[#0f1629] rounded border border-[#1e2d4f] p-2">
              <p className="text-[10px] font-mono text-[#546e8a] uppercase mb-2">
                Order Book
              </p>
              <div className="space-y-0.5 text-xs font-mono">
                {[
                  { price: "1.08450", size: "2,500,000", side: "ask" },
                  { price: "1.08440", size: "1,800,000", side: "ask" },
                  { price: "1.08430", size: "3,200,000", side: "ask" },
                  { price: "1.08420", size: "4,100,000", side: "bid" },
                  { price: "1.08410", size: "2,900,000", side: "bid" },
                  { price: "1.08400", size: "1,600,000", side: "bid" },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between">
                    <span
                      className={
                        row.side === "ask"
                          ? "text-[#ff1744]"
                          : "text-[#00e676]"
                      }
                    >
                      {row.price}
                    </span>
                    <span className="text-[#546e8a]">{row.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Positions */}
            <div className="flex-1 bg-[#0f1629] rounded border border-[#1e2d4f] p-2">
              <p className="text-[10px] font-mono text-[#546e8a] uppercase mb-2">
                Open Positions
              </p>
              <p className="text-xs text-[#546e8a] font-mono">
                No open positions
              </p>
            </div>

            {/* AI Signals */}
            <div className="flex-1 bg-[#0f1629] rounded border border-[#1e2d4f] p-2">
              <p className="text-[10px] font-mono text-[#546e8a] uppercase mb-2">
                AI Signal Engine
              </p>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#546e8a]">Model</span>
                  <span className="text-[#ffab00]">LSTM v0.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#546e8a]">Signal</span>
                  <span className="text-[#00e676]">LONG ▲</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#546e8a]">Confidence</span>
                  <span className="text-[#00d4ff]">72.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#546e8a]">Status</span>
                  <span className="text-[#00e676] animate-pulse">● LIVE</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
