/**
 * Sidebar — Watchlist panel.
 * Displays a monitored instrument list with live bid/ask spreads.
 */

const WATCHLIST = [
  { symbol: "EUR/USD", bid: "1.08418", ask: "1.08422", chg: "+0.30%", up: true },
  { symbol: "GBP/USD", bid: "1.26847", ask: "1.26853", chg: "-0.12%", up: false },
  { symbol: "USD/JPY", bid: "149.317", ask: "149.323", chg: "+0.08%", up: true },
  { symbol: "USD/CHF", bid: "0.89640", ask: "0.89648", chg: "+0.05%", up: true },
  { symbol: "AUD/USD", bid: "0.65122", ask: "0.65130", chg: "-0.22%", up: false },
  { symbol: "USD/CAD", bid: "1.36450", ask: "1.36458", chg: "+0.11%", up: true },
  { symbol: "NZD/USD", bid: "0.59870", ask: "0.59880", chg: "-0.09%", up: false },
  { symbol: "EUR/GBP", bid: "0.85530", ask: "0.85538", chg: "+0.04%", up: true },
  { symbol: "BTC/USD", bid: "67,235", ask: "67,245",  chg: "+1.45%", up: true },
  { symbol: "ETH/USD", bid: "3,509",  ask: "3,515",   chg: "+2.18%", up: true },
  { symbol: "XAU/USD", bid: "2,338",  ask: "2,342",   chg: "+0.61%", up: true },
  { symbol: "SPX500",  bid: "5,262",  ask: "5,266",   chg: "+0.32%", up: true },
];

export default function Sidebar() {
  return (
    <aside className="w-48 flex flex-col shrink-0 bg-[#0f1629] border-r border-[#1e2d4f] overflow-hidden">
      {/* Watchlist Header */}
      <div className="px-3 py-2 border-b border-[#1e2d4f] flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#546e8a] uppercase tracking-wider">
          Watchlist
        </span>
        <button className="text-[#546e8a] hover:text-[#00d4ff] text-xs transition-colors">
          +
        </button>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-2 px-3 py-1 text-[9px] font-mono text-[#546e8a] uppercase border-b border-[#1e2d4f]">
        <span>Symbol</span>
        <span className="text-right">Chg%</span>
      </div>

      {/* Instrument List */}
      <div className="flex-1 overflow-y-auto">
        {WATCHLIST.map((item) => (
          <button
            key={item.symbol}
            className="w-full grid grid-cols-2 px-3 py-1.5 hover:bg-[#141e35] transition-colors text-left border-b border-[#1e2d4f]/30"
          >
            <div>
              <p className="font-mono text-xs text-[#e8eaf6] leading-tight">
                {item.symbol}
              </p>
              <p className="font-mono text-[9px] text-[#546e8a] leading-tight">
                {item.bid}
              </p>
            </div>
            <div className="text-right self-center">
              <span
                className={`font-mono text-[10px] ${
                  item.up ? "text-[#00e676]" : "text-[#ff1744]"
                }`}
              >
                {item.chg}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Footer: Account Summary */}
      <div className="px-3 py-2 border-t border-[#1e2d4f] text-[9px] font-mono space-y-1">
        <div className="flex justify-between text-[#546e8a]">
          <span>Balance</span>
          <span className="text-[#e8eaf6]">$50,000</span>
        </div>
        <div className="flex justify-between text-[#546e8a]">
          <span>Equity</span>
          <span className="text-[#00e676]">$51,240</span>
        </div>
        <div className="flex justify-between text-[#546e8a]">
          <span>Margin</span>
          <span className="text-[#ffab00]">$2,400</span>
        </div>
      </div>
    </aside>
  );
}
