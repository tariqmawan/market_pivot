import React from "react";
import bondsYieldsData from "../../data/bonds_yields.json";

type BondsYieldsItem = {
  id: string;
  country: string;
  instrument: string;
  curvePoint: string;
  currency: string;
  tenor: string;
  yieldPercent: number;
  changePercentDay: number;
  ytdPercent: number;
};

const bondsYields = (bondsYieldsData as any).bondsYields as BondsYieldsItem[];

const BondsYieldsPage: React.FC = () => {
  return (
    <div className="page intelligence-page">
      <div className="section-heading">
        <p className="eyebrow">Bonds & Yields</p>
        <h1>Yield Curve Snapshots</h1>
        <p>Static yield references (placeholder for live rates) with country/instrument context.</p>
      </div>

      <div className="asset-grid compact">
        {bondsYields.map((b) => (
          <div key={b.id} className="asset-card">
            <span className="eyebrow">{b.curvePoint}</span>
            <h3>{b.instrument}</h3>
            <p>
              {b.country} / {b.currency} • Tenor {b.tenor}
            </p>
            <strong>
              {b.yieldPercent.toFixed(2)}% ({b.changePercentDay >= 0 ? "+" : ""}
              {b.changePercentDay.toFixed(2)}% day, {b.ytdPercent >= 0 ? "+" : ""}
              {b.ytdPercent.toFixed(1)}% YTD)
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BondsYieldsPage;
