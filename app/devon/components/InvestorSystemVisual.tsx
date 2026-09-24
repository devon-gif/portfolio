export function InvestorSystemVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`rz-investor-visual${compact ? " is-compact" : ""}`} aria-label="Investor room, pitch deck, and diligence system preview">
      <div className="rz-investor-screen">
        <div className="rz-investor-sidebar">
          <strong>CR 91</strong>
          <span className="active">Overview</span>
          <span>Documents</span>
          <span>Diligence</span>
          <span>Financials</span>
          <span>Investors</span>
          <span>Market research</span>
          <span>Updates</span>
          <small>DEVON ARCHER<br />PRODUCT / DESIGN</small>
        </div>
        <div className="rz-investor-dashboard">
          <div className="rz-investor-dashboard-head">
            <div>
              <small>CR 91 PARK PLAZA</small>
              <h3>Investor Room</h3>
            </div>
            <span>ADMIN · LIVE</span>
          </div>
          <div className="rz-investor-property">
            <div className="rz-investor-property-glow" />
            <div>
              <small>HOSPITALITY DEVELOPMENT</small>
              <strong>One controlled place for proof, documents and investor access.</strong>
            </div>
          </div>
          <div className="rz-investor-stats">
            <div><strong>57</strong><span>Documents</span></div>
            <div><strong>22</strong><span>Evidence items</span></div>
            <div><strong>18</strong><span>Priority proofs</span></div>
            <div><strong>4</strong><span>Investor groups</span></div>
          </div>
        </div>
      </div>

      <div className="rz-investor-deck">
        <small>INVESTOR DECK</small>
        <h4>Park Plaza</h4>
        <p>Investment opportunity<br />Boutique hospitality</p>
        <div className="rz-investor-deck-art">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="rz-investor-proof-card">
        <small>DILIGENCE &amp; PROOF</small>
        <h4>Readiness register</h4>
        {[
          ["Due diligence checklist", "12 / 24"],
          ["Financial models", "8 / 8"],
          ["Market research", "5 / 5"],
          ["Permits & approvals", "4 / 6"],
          ["Plans & exhibits", "12 / 12"],
        ].map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
