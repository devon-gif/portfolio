import { INVESTOR_ATLAS_DATA_URI } from "../investor-atlas/data";

export type InvestorAtlasTile =
  | "system"
  | "building"
  | "dashboard"
  | "deck"
  | "diligence"
  | "research"
  | "financial";

const positions: Record<InvestorAtlasTile, string> = {
  system: "0% 0%",
  building: "100% 0%",
  dashboard: "0% 33.333%",
  deck: "100% 33.333%",
  diligence: "0% 66.667%",
  research: "100% 66.667%",
  financial: "0% 100%",
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
        backgroundImage: `url("${INVESTOR_ATLAS_DATA_URI}")`,
        backgroundSize: "200% 400%",
        backgroundPosition: positions[tile],
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
