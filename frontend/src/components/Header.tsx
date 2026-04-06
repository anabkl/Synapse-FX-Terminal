/**
 * Header — Top application bar.
 * Displays the brand, live market status, account info, and connection indicator.
 */
export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-[#0f1629] border-b border-[#1e2d4f] shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[#00d4ff] font-mono font-bold text-sm tracking-widest">
            ⚡ NEXUSQUANT
          </span>
          <span className="text-[#546e8a] font-mono text-xs">AI</span>
        </div>
        <span className="w-px h-4 bg-[#1e2d4f]" />
        <span className="text-[#546e8a] font-mono text-xs">
          Institutional Trading Terminal v0.1.0
        </span>
      </div>

      {/* Ticker Tape */}
      <div className="flex-1 mx-4 overflow-hidden">
        <div className="flex gap-6 ticker-tape whitespace-nowrap text-xs font-mono">
          {[
            { sym: "EUR/USD", price: "1.08420", chg: "+0.30%", up: true },
            { sym: "GBP/USD", price: "1.26850", chg: "-0.12%", up: false },
            { sym: "USD/JPY", price: "149.320", chg: "+0.08%", up: true },
            { sym: "BTC/USD", price: "67,240", chg: "+1.45%", up: true },
            { sym: "ETH/USD", price: "3,512",  chg: "+2.18%", up: true },
            { sym: "SPX500",  price: "5,264",  chg: "+0.32%", up: true },
            { sym: "NQ100",   price: "18,450", chg: "-0.05%", up: false },
            { sym: "XAU/USD", price: "2,340",  chg: "+0.61%", up: true },
            /* Duplicate for seamless loop */
            { sym: "EUR/USD", price: "1.08420", chg: "+0.30%", up: true },
            { sym: "GBP/USD", price: "1.26850", chg: "-0.12%", up: false },
            { sym: "USD/JPY", price: "149.320", chg: "+0.08%", up: true },
            { sym: "BTC/USD", price: "67,240",  chg: "+1.45%", up: true },
          ].map((t, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="text-[#546e8a]">{t.sym}</span>
              <span className="text-[#e8eaf6]">{t.price}</span>
              <span className={t.up ? "text-[#00e676]" : "text-[#ff1744]"}>
                {t.chg}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
          <span className="text-[#546e8a]">WS LIVE</span>
        </div>

        {/* Latency */}
        <div className="text-xs font-mono text-[#546e8a]">
          <span className="text-[#00d4ff]">0.8</span>ms
        </div>

        {/* Account */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-[#546e8a]">P&L</span>
          <span className="text-[#00e676]">+$1,240.50</span>
        </div>

        {/* Settings placeholder */}
        <button
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#141e35] text-[#546e8a] hover:text-[#e8eaf6] transition-colors"
          title="Settings"
        >
          ⚙
        </button>
      </div>
    </header>
  );
}
