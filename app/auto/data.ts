export type DealerId = "orlando" | "new-york" | "los-angeles";

export type Dealer = {
  id: DealerId;
  name: string;
  shortName: string;
  city: string;
  state: string;
  vehicle: string;
  marque: string;
  campaign: string;
  headline: string;
  subhead: string;
  offer: string;
  legal: string;
  image: string;
  accent: string;
  audience: string[];
  tone: string[];
  dealerRules: string[];
  vehicleRules: string[];
  demographic: {
    population: string;
    income: string;
    language: string;
    commute: string;
    source: string;
    sourceLabel: string;
    facts: string[];
    recommendations: string[];
  };
};

export const dealers: Dealer[] = [
  {
    id: "orlando",
    name: "Orlando Motor Atelier",
    shortName: "Orlando",
    city: "Orlando",
    state: "FL",
    vehicle: "GLC",
    marque: "Mercedes-Benz",
    campaign: "GLC Spring Arrival",
    headline: "THE GLC",
    subhead: "Designed for every arrival.",
    offer: "From $699/mo",
    legal:
      "Concept offer for demonstration only. Terms, inventory and eligibility require dealer approval.",
    image: "/auto/orlando-glc.webp",
    accent: "#1368ff",
    audience: ["Luxury intenders", "In-market shoppers"],
    tone: ["Sophisticated", "Confident"],
    dealerRules: [
      "Lead with refinement and ownership experience.",
      "Never use urgency that feels distressed or discount-led.",
      "Use Orlando location context only when it supports the campaign.",
      "All price and term language requires a compliance review.",
    ],
    vehicleRules: [
      "Vehicle name must appear as Mercedes-Benz GLC on first reference.",
      "Preserve generous negative space around the vehicle.",
      "Do not alter body proportions, lighting signatures or trim details.",
      "Legal language remains locked across every generated size.",
    ],
    demographic: {
      population: "333,888",
      income: "$72,336",
      language: "40.8%",
      commute: "26.2 min",
      source:
        "https://www.census.gov/quickfacts/fact/table/orlandocityflorida/PST045225",
      sourceLabel: "U.S. Census Bureau QuickFacts — Orlando",
      facts: [
        "2025 population estimate: 333,888, up 8.4% from the 2020 estimate base.",
        "40.8% speak a language other than English at home.",
        "Median household income is $72,336 (2020–2024, 2024 dollars).",
      ],
      recommendations: [
        "Build English and Spanish-ready variants rather than translating after layout approval.",
        "Test an arrival-and-versatility message against a pure status message.",
        "Keep mobile placements prominent for a growing, digitally connected market.",
      ],
    },
  },
  {
    id: "new-york",
    name: "New York Auto House",
    shortName: "New York",
    city: "New York",
    state: "NY",
    vehicle: "iX",
    marque: "BMW",
    campaign: "iX Electric City",
    headline: "MOVE THE CITY",
    subhead: "Electric confidence, without compromise.",
    offer: "From $749/mo",
    legal:
      "Concept offer for demonstration only. Terms, inventory and eligibility require dealer approval.",
    image: "/auto/new-york-ix.webp",
    accent: "#5d78ff",
    audience: ["Urban innovators", "EV switchers"],
    tone: ["Progressive", "Precise"],
    dealerRules: [
      "Favor concise, metropolitan language.",
      "Show utility without making the work feel suburban.",
      "Avoid unsupported environmental or range claims.",
      "All incentives must name the qualifying audience and source.",
    ],
    vehicleRules: [
      "Use BMW iX on first reference; never shorten to iX in legal copy.",
      "Preserve the vehicle grille, lighting and wheel design.",
      "Use modern, architectural environments with controlled contrast.",
      "Do not use third-party charging claims without a verified source.",
    ],
    demographic: {
      population: "8,584,629",
      income: "$80,483",
      language: "47.7%",
      commute: "40.3 min",
      source:
        "https://www.census.gov/quickfacts/fact/table/newyorkcitynewyork/PST045225",
      sourceLabel: "U.S. Census Bureau QuickFacts — New York City",
      facts: [
        "2025 population estimate: 8,584,629.",
        "47.7% speak a language other than English at home.",
        "Mean commute time is 40.3 minutes (2020–2024).",
      ],
      recommendations: [
        "Prioritize concise transit, charging and daily-use messages over long feature lists.",
        "Create modular multilingual copy fields before adapting sizes.",
        "Use high-frequency mobile and display formats with distinct commute-context variants.",
      ],
    },
  },
  {
    id: "los-angeles",
    name: "Los Angeles Motor Gallery",
    shortName: "Los Angeles",
    city: "Los Angeles",
    state: "CA",
    vehicle: "RX",
    marque: "Lexus",
    campaign: "RX Golden Hour",
    headline: "OWN THE MOMENT",
    subhead: "Comfort, composed for the coast.",
    offer: "From $679/mo",
    legal:
      "Concept offer for demonstration only. Terms, inventory and eligibility require dealer approval.",
    image: "/auto/los-angeles-rx.webp",
    accent: "#ff8a35",
    audience: ["Design-led families", "Luxury switchers"],
    tone: ["Warm", "Elevated"],
    dealerRules: [
      "Use a calm, design-forward voice.",
      "Local references should feel specific, never tourist-oriented.",
      "Avoid exaggerated superlatives and unsupported lifestyle claims.",
      "Offer and legal blocks remain readable on every placement.",
    ],
    vehicleRules: [
      "Use Lexus RX on first reference.",
      "Protect spindle-grille and lighting details from text overlays.",
      "Favor natural light, craft and quiet confidence.",
      "Never distort vehicle scale to fill extreme aspect ratios.",
    ],
    demographic: {
      population: "3,869,089",
      income: "$81,939",
      language: "56.4%",
      commute: "30.7 min",
      source:
        "https://www.census.gov/quickfacts/fact/table/losangelescitycalifornia/PST045225",
      sourceLabel: "U.S. Census Bureau QuickFacts — Los Angeles",
      facts: [
        "2025 population estimate: 3,869,089.",
        "56.4% speak a language other than English at home.",
        "Median household income is $81,939 (2020–2024, 2024 dollars).",
      ],
      recommendations: [
        "Plan English and Spanish creative at concept stage, with matching legal-safe zones.",
        "Test design, comfort and everyday utility as separate message territories.",
        "Produce story, feed and display variants with a visual-first hierarchy.",
      ],
    },
  },
];

export const outputFormats = [
  { id: "meta", label: "Meta", size: "1:1", count: 3, ratio: "1 / 1" },
  { id: "story", label: "Story", size: "9:16", count: 3, ratio: "9 / 16" },
  { id: "display", label: "Display", size: "300×250", count: 3, ratio: "6 / 5" },
  { id: "leaderboard", label: "Leaderboard", size: "728×90", count: 3, ratio: "8.09 / 1" },
] as const;

export const buildStages = [
  {
    id: "problem",
    number: "01",
    title: "Define the production bottleneck",
    status: "Complete",
    summary:
      "Dealer ads repeat the same manual work: rebuilding approved creative across many placements while protecting brand and legal rules.",
    evidence: [
      "Two modes defined: rebuild an approved ad or create from a controlled campaign brief.",
      "Human approval remains the final publishing gate.",
      "Success metric: fewer repetitive production hours without lowering creative quality.",
    ],
  },
  {
    id: "system",
    number: "02",
    title: "Map the controlled workflow",
    status: "Complete",
    summary:
      "The product separates source assets, verified context, generation decisions, compliance checks and final exports.",
    evidence: [
      "Inputs remain editable and traceable.",
      "Rules are layered by auto group, dealership, manufacturer, vehicle and campaign.",
      "Every output carries the same campaign and legal identifiers.",
    ],
  },
  {
    id: "data",
    number: "03",
    title: "Design the data model",
    status: "Prototype",
    summary:
      "The demo uses typed local data. Production moves the same entities into Supabase with versioning and role-based access.",
    evidence: [
      "Dealerships → brand packs → vehicles → campaigns → assets → output jobs.",
      "Source documents retain verification dates and owners.",
      "Generated variants point back to their source campaign and layer versions.",
    ],
  },
  {
    id: "context",
    number: "04",
    title: "Build the context hierarchy",
    status: "Complete",
    summary:
      "The system composes only the context needed for the current dealer, vehicle, market and placement.",
    evidence: [
      "Dealer voice can narrow—but never override—manufacturer or legal restrictions.",
      "Changing dealership updates the campaign, image, audience and guardrails together.",
      "Verified facts are visibly separated from creative recommendations.",
    ],
  },
  {
    id: "creative",
    number: "05",
    title: "Create the studio interface",
    status: "Working",
    summary:
      "The Precision Studio prototype makes layers, rules, audience context and output sizes visible in one workspace.",
    evidence: [
      "Users can switch dealership workspaces.",
      "Text and compliance layers can be toggled before generation.",
      "Output formats can be selected individually.",
    ],
  },
  {
    id: "adaptation",
    number: "06",
    title: "Adapt creative by placement",
    status: "Working",
    summary:
      "The demo generates responsive placement previews from one approved creative direction and preserves locked legal content.",
    evidence: [
      "Square, story, display and leaderboard families are represented.",
      "The preview responds to the active placement.",
      "Production would add a rendering service and downloadable files.",
    ],
  },
  {
    id: "quality",
    number: "07",
    title: "Add validation and human QA",
    status: "Designed",
    summary:
      "A production job cannot become publishable until brand, legal, safe-zone and human-review checks pass.",
    evidence: [
      "Rule conflicts should block output rather than silently improvise.",
      "Legal text is treated as locked structured data.",
      "A visual-diff and readability check belongs before final approval.",
    ],
  },
  {
    id: "sources",
    number: "08",
    title: "Ground market recommendations",
    status: "Working",
    summary:
      "Market cards cite U.S. Census Bureau QuickFacts and label the system's recommendations as inferences.",
    evidence: [
      "Source links stay beside the claims they support.",
      "Dates and geography remain visible.",
      "Demographic data informs testing ideas; it does not stereotype individuals.",
    ],
  },
  {
    id: "deployment",
    number: "09",
    title: "Verify and deploy",
    status: "In progress",
    summary:
      "The route is tested independently before it is added to the live Archer site.",
    evidence: [
      "TypeScript and production build are required gates.",
      "Desktop and mobile interactions are verified.",
      "The live demo is intentionally isolated from private dealership data.",
    ],
  },
];
