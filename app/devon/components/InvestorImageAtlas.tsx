export type InvestorAtlasTile =
  | "system"
  | "building"
  | "dashboard"
  | "deck"
  | "diligence"
  | "research"
  | "financial";

const imagePaths: Record<InvestorAtlasTile, string> = {
  system: "/devon/investor/investor-system-composition.png",
  building: "/devon/investor/investor-building.png",
  dashboard: "/devon/investor/investor-dashboard.png",
  deck: "/devon/investor/investor-pitch-deck.png",
  diligence: "/devon/investor/investor-proof-register.png",
  research: "/devon/investor/investor-research-report.png",
  financial: "/devon/investor/investor-financial-spread.png",
};

const positions: Record<InvestorAtlasTile, string> = {
  system: "center",
  building: "center",
  dashboard: "center",
  deck: "center",
  diligence: "center top",
  research: "center",
  financial: "center",
};

const labels: Record<InvestorAtlasTile, string> = {
  system: "Investor system presentation with dashboard, deck, website, and supporting materials",
  building: "Luxury hospitality development architectural visualization",
  dashboard: "Investor dashboard and data room interface presentation",
  deck: "Luxury hospitality investor pitch deck presentation",
  diligence: "Investor diligence and proof register presentation",
  research: "Hospitality development market research report presentation",
  financial: "Financial and investment analysis presentation",
};

export function InvestorImageAtlas({
  tile,
  className = "",
}: {
  tile: InvestorAtlasTile;
  className?: string;
}) {
  return (
    <div
      className={`rz-generated-investor-image ${className}`}
      role="img"
      aria-label={labels[tile]}
      style={{
        backgroundImage: `url("${imagePaths[tile]}")`,
        backgroundSize: "cover",
        backgroundPosition: positions[tile],
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
