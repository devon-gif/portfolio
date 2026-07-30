"use client";

import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Database,
  Eye,
  EyeOff,
  FileText,
  FolderKanban,
  GripVertical,
  ImageIcon,
  Layers3,
  Library,
  Maximize2,
  MoreVertical,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
  Type,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { buildStages, dealers, outputFormats, type Dealer } from "./data";
import styles from "./auto.module.css";

type TabId = "studio" | "library" | "campaigns" | "demographics" | "guide";
type LayerId = "background" | "vehicle" | "headline" | "offer" | "legal";
type UploadMap = Partial<Record<"background" | "vehicle", string>>;

const tabs: Array<{
  id: TabId;
  label: string;
  icon: typeof Layers3;
}> = [
  { id: "studio", label: "Studio", icon: Layers3 },
  { id: "library", label: "Brand Library", icon: Library },
  { id: "campaigns", label: "Campaigns", icon: FolderKanban },
  { id: "demographics", label: "Demographics", icon: BarChart3 },
  { id: "guide", label: "Build Guide", icon: BookOpen },
];

const layerConfig: Array<{
  id: LayerId;
  label: string;
  type: string;
  icon: typeof ImageIcon;
  replaceable?: boolean;
  locked?: boolean;
}> = [
  {
    id: "background",
    label: "Background",
    type: "Image layer",
    icon: ImageIcon,
    replaceable: true,
  },
  {
    id: "vehicle",
    label: "Vehicle",
    type: "Product layer",
    icon: Store,
    replaceable: true,
  },
  { id: "headline", label: "Headline", type: "Text layer", icon: Type },
  { id: "offer", label: "Offer", type: "Structured field", icon: Tag },
  {
    id: "legal",
    label: "Legal",
    type: "Locked field",
    icon: FileText,
    locked: true,
  },
];

function DealerSwitcher({
  dealer,
  onChange,
}: {
  dealer: Dealer;
  onChange: (dealer: Dealer) => void;
}) {
  return (
    <div className={styles.dealerSwitcher} aria-label="Dealership workspaces">
      {dealers.map((item) => (
        <button
          type="button"
          key={item.id}
          className={`${styles.dealerButton} ${
            item.id === dealer.id ? styles.dealerButtonActive : ""
          }`}
          onClick={() => onChange(item)}
          aria-pressed={item.id === dealer.id}
        >
          <span className={styles.dealerIcon}>
            <Store size={20} />
          </span>
          <span>
            <strong>{item.name}</strong>
            <small>
              {item.city}, {item.state}
            </small>
          </span>
          <span
            className={`${styles.radio} ${
              item.id === dealer.id ? styles.radioActive : ""
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function LayerStack({
  visible,
  uploads,
  onToggle,
  onUpload,
}: {
  visible: Record<LayerId, boolean>;
  uploads: UploadMap;
  onToggle: (id: LayerId) => void;
  onUpload: (id: "background" | "vehicle", file?: File) => void;
}) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeading}>
        <div>
          <span className={styles.eyebrow}>Source assembly</span>
          <h2>Layered asset stack</h2>
        </div>
        <span className={styles.infoDot}>i</span>
      </div>

      <div className={styles.layers}>
        {layerConfig.map((layer) => {
          const Icon = layer.icon;
          const hasUpload =
            (layer.id === "background" || layer.id === "vehicle") &&
            Boolean(uploads[layer.id]);

          return (
            <div className={styles.layerRow} key={layer.id}>
              <GripVertical size={16} className={styles.grip} />
              <span className={styles.layerIcon}>
                <Icon size={19} />
              </span>
              <span className={styles.layerText}>
                <strong>{layer.label}</strong>
                <small>{hasUpload ? "Uploaded asset" : layer.type}</small>
              </span>
              {layer.replaceable ? (
                <label className={styles.uploadAction}>
                  <Upload size={15} />
                  <span className={styles.srOnly}>
                    Upload {layer.label.toLowerCase()}
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) =>
                      onUpload(
                        layer.id as "background" | "vehicle",
                        event.currentTarget.files?.[0],
                      )
                    }
                  />
                </label>
              ) : null}
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => onToggle(layer.id)}
                aria-label={`${visible[layer.id] ? "Hide" : "Show"} ${layer.label}`}
                disabled={layer.locked}
                title={layer.locked ? "Locked by compliance" : undefined}
              >
                {visible[layer.id] ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <MoreVertical size={16} className={styles.more} />
            </div>
          );
        })}
      </div>
      <p className={styles.microcopy}>
        Uploads remain in this browser session and never touch a live dealership
        record.
      </p>
    </section>
  );
}

function Guardrails({ dealer }: { dealer: Dealer }) {
  const rules = [
    "Dealer voice",
    `${dealer.marque} rules`,
    "Legal locked",
  ];

  return (
    <section className={`${styles.panel} ${styles.guardrailPanel}`}>
      <div className={styles.panelHeading}>
        <div className={styles.headingWithIcon}>
          <ShieldCheck size={20} />
          <h2>Brand guardrails</h2>
        </div>
        <span className={styles.statusPill}>3 verified</span>
      </div>
      <div className={styles.ruleList}>
        {rules.map((rule) => (
          <div key={rule}>
            <CheckCircle2 size={18} />
            <span>{rule}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CreativePreview({
  dealer,
  visible,
  uploads,
  ratio,
}: {
  dealer: Dealer;
  visible: Record<LayerId, boolean>;
  uploads: UploadMap;
  ratio: string;
}) {
  const backgroundSrc = uploads.background || dealer.image;
  const vehicleSrc = uploads.vehicle;

  return (
    <section className={`${styles.panel} ${styles.previewPanel}`}>
      <div className={styles.panelHeading}>
        <div className={styles.liveTitle}>
          <span className={styles.liveDot} />
          <div>
            <span className={styles.eyebrow}>Responsive composition</span>
            <h2>Live creative preview</h2>
          </div>
        </div>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Expand preview"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      <div
        className={styles.creativeStage}
        style={{ "--preview-ratio": ratio } as React.CSSProperties}
      >
        {visible.background ? (
          <Image
            src={backgroundSrc}
            alt={`${dealer.marque} ${dealer.vehicle} campaign concept`}
            fill
            priority
            sizes="(max-width: 900px) 90vw, 42vw"
            className={styles.stageImage}
            unoptimized={backgroundSrc.startsWith("data:")}
          />
        ) : (
          <div className={styles.emptyBackground} />
        )}

        {vehicleSrc && visible.vehicle ? (
          <Image
            src={vehicleSrc}
            alt="Uploaded vehicle layer"
            fill
            sizes="(max-width: 900px) 90vw, 42vw"
            className={styles.vehicleOverlay}
            unoptimized
          />
        ) : null}

        <div className={styles.stageShade} />
        <div className={styles.safeZone} aria-hidden="true" />

        <div className={styles.creativeCopy}>
          <p className={styles.brandLine}>
            {dealer.name} · {dealer.marque}
          </p>
          {visible.headline ? (
            <>
              <h3>{dealer.headline}</h3>
              <p className={styles.subhead}>{dealer.subhead}</p>
              <span
                className={styles.accentRule}
                style={{ background: dealer.accent }}
              />
            </>
          ) : null}
        </div>

        {visible.offer ? (
          <div className={styles.offer}>
            <span>Concept offer</span>
            <strong>{dealer.offer}</strong>
          </div>
        ) : null}

        {visible.legal ? (
          <p className={styles.legal}>{dealer.legal}</p>
        ) : null}
      </div>

      <div className={styles.previewFooter}>
        <span>
          <CheckCircle2 size={15} /> Safe zones visible
        </span>
        <span>Active concept · {dealer.campaign}</span>
      </div>
    </section>
  );
}

function DirectionPanel({ dealer }: { dealer: Dealer }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeading}>
        <div className={styles.headingWithIcon}>
          <Sparkles size={21} />
          <h2>Creative direction</h2>
        </div>
      </div>

      <div className={styles.fieldStack}>
        <label>
          <span>Campaign</span>
          <button type="button" className={styles.selectControl}>
            {dealer.campaign}
            <ChevronDown size={16} />
          </button>
        </label>
        <label>
          <span>Audience</span>
          <button type="button" className={styles.selectControl}>
            <span className={styles.chipRow}>
              {dealer.audience.map((item) => (
                <span className={styles.chip} key={item}>
                  {item}
                </span>
              ))}
            </span>
            <ChevronDown size={16} />
          </button>
        </label>
        <label>
          <span>Tone</span>
          <button type="button" className={styles.selectControl}>
            <span className={styles.chipRow}>
              {dealer.tone.map((item) => (
                <span className={styles.chip} key={item}>
                  {item}
                </span>
              ))}
            </span>
            <ChevronDown size={16} />
          </button>
        </label>
      </div>

      <div className={styles.safeButtons}>
        <span>Safe zones</span>
        <button type="button" className={styles.safeActive}>
          Auto (all)
        </button>
        <button type="button">Mobile</button>
        <button type="button">Desktop</button>
      </div>

      <div className={styles.verifiedContext}>
        <CheckCircle2 size={22} />
        <div>
          <strong>Verified context</strong>
          <span>Dealer, vehicle and legal rules are attached.</span>
        </div>
        <ChevronRight size={18} />
      </div>
    </section>
  );
}

function OutputPanel({
  selected,
  active,
  status,
  onToggle,
  onGenerate,
}: {
  selected: string[];
  active: string;
  status: "idle" | "generating" | "ready";
  onToggle: (id: string) => void;
  onGenerate: () => void;
}) {
  const count = outputFormats
    .filter((format) => selected.includes(format.id))
    .reduce((total, format) => total + format.count, 0);

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeading}>
        <div>
          <span className={styles.eyebrow}>Placement plan</span>
          <h2>Output size selection</h2>
        </div>
        <span className={styles.infoDot}>i</span>
      </div>
      <div className={styles.formatGrid}>
        {outputFormats.map((format) => {
          const isSelected = selected.includes(format.id);
          return (
            <button
              type="button"
              key={format.id}
              className={`${styles.formatCard} ${
                isSelected ? styles.formatCardSelected : ""
              } ${format.id === active ? styles.formatCardActive : ""}`}
              onClick={() => onToggle(format.id)}
              aria-pressed={isSelected}
            >
              <span
                className={styles.formatShape}
                style={{ aspectRatio: format.ratio }}
              />
              <strong>{format.label}</strong>
              <small>{format.size}</small>
              <span
                className={`${styles.formatCheck} ${
                  isSelected ? styles.formatCheckActive : ""
                }`}
              >
                {isSelected ? <Check size={12} /> : null}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.generateButton}
        onClick={onGenerate}
        disabled={status === "generating" || count === 0}
      >
        <Sparkles size={21} />
        {status === "generating"
          ? "Building placements…"
          : status === "ready"
            ? `${count} previews ready`
            : `Generate ${count} sizes`}
      </button>
      {status === "ready" ? (
        <div className={styles.generationResult}>
          <CheckCircle2 size={17} />
          <span>
            Responsive previews created. Production export service is documented
            in the Build Guide.
          </span>
        </div>
      ) : null}
    </section>
  );
}

function Studio({
  dealer,
  visible,
  uploads,
  selectedFormats,
  activeFormat,
  generationStatus,
  onToggleLayer,
  onUpload,
  onToggleFormat,
  onGenerate,
}: {
  dealer: Dealer;
  visible: Record<LayerId, boolean>;
  uploads: UploadMap;
  selectedFormats: string[];
  activeFormat: string;
  generationStatus: "idle" | "generating" | "ready";
  onToggleLayer: (id: LayerId) => void;
  onUpload: (id: "background" | "vehicle", file?: File) => void;
  onToggleFormat: (id: string) => void;
  onGenerate: () => void;
}) {
  const ratio =
    outputFormats.find((format) => format.id === activeFormat)?.ratio || "1 / 1";

  return (
    <>
      <div className={styles.workspaceIntro}>
        <div>
          <span className={styles.kicker}>Controlled automotive production</span>
          <h1>Build once. Deploy everywhere.</h1>
          <p>
            AI-assisted resizing under verified dealer, vehicle and legal
            guardrails.
          </p>
        </div>
        <div className={styles.demoBadge}>
          <span />
          Interactive presentation prototype
        </div>
      </div>

      <div className={styles.studioGrid}>
        <div className={styles.leftColumn}>
          <LayerStack
            visible={visible}
            uploads={uploads}
            onToggle={onToggleLayer}
            onUpload={onUpload}
          />
          <Guardrails dealer={dealer} />
        </div>
        <CreativePreview
          dealer={dealer}
          visible={visible}
          uploads={uploads}
          ratio={ratio}
        />
        <div className={styles.rightColumn}>
          <DirectionPanel dealer={dealer} />
          <OutputPanel
            selected={selectedFormats}
            active={activeFormat}
            status={generationStatus}
            onToggle={onToggleFormat}
            onGenerate={onGenerate}
          />
        </div>
      </div>
    </>
  );
}

function BrandLibrary({ dealer }: { dealer: Dealer }) {
  const packs = [
    {
      label: "Auto group",
      title: "Atelier Group master rules",
      icon: Database,
      status: "Inherited",
      rules: [
        "Human approval before release",
        "No fabricated incentives",
        "Source and version every rule pack",
      ],
    },
    {
      label: "Dealership",
      title: `${dealer.name} voice pack`,
      icon: Store,
      status: "Active",
      rules: dealer.dealerRules,
    },
    {
      label: "Manufacturer + model",
      title: `${dealer.marque} ${dealer.vehicle} rule pack`,
      icon: ShieldCheck,
      status: "Verified",
      rules: dealer.vehicleRules,
    },
  ];

  return (
    <div className={styles.sectionPage}>
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.kicker}>Context library</span>
          <h1>Every campaign inherits the right rules.</h1>
          <p>
            Guardrails become composable, versioned context—not a PDF someone
            has to remember to open.
          </p>
        </div>
        <button type="button" className={styles.secondaryButton}>
          <Upload size={17} /> Add source document
        </button>
      </div>
      <div className={styles.libraryFlow}>
        {packs.map((pack, index) => {
          const Icon = pack.icon;
          return (
            <div className={styles.libraryStep} key={pack.title}>
              <article className={styles.libraryCard}>
                <div className={styles.libraryCardTop}>
                  <span className={styles.libraryIcon}>
                    <Icon size={22} />
                  </span>
                  <span className={styles.statusPill}>{pack.status}</span>
                </div>
                <span className={styles.eyebrow}>{pack.label}</span>
                <h2>{pack.title}</h2>
                <ul>
                  {pack.rules.map((rule) => (
                    <li key={rule}>
                      <CheckCircle2 size={15} />
                      {rule}
                    </li>
                  ))}
                </ul>
              </article>
              {index < packs.length - 1 ? (
                <ArrowRight className={styles.flowArrow} size={22} />
              ) : null}
            </div>
          );
        })}
      </div>
      <div className={styles.contextTrace}>
        <div>
          <span className={styles.eyebrow}>Compiled campaign context</span>
          <h2>{dealer.campaign}</h2>
        </div>
        <div className={styles.contextTags}>
          <span>Group policy</span>
          <ChevronRight size={14} />
          <span>{dealer.shortName} voice</span>
          <ChevronRight size={14} />
          <span>{dealer.marque} rules</span>
          <ChevronRight size={14} />
          <span>{dealer.vehicle}</span>
          <ChevronRight size={14} />
          <strong>Ready for generation</strong>
        </div>
      </div>
    </div>
  );
}

function Campaigns({ dealer }: { dealer: Dealer }) {
  const rows = [
    {
      name: dealer.campaign,
      formats: "12 placements",
      status: "In review",
      owner: "Devon",
      updated: "Today",
    },
    {
      name: `${dealer.vehicle} Retargeting`,
      formats: "8 placements",
      status: "Approved",
      owner: "Maya",
      updated: "Yesterday",
    },
    {
      name: "Weekend Test Drive",
      formats: "6 placements",
      status: "Draft",
      owner: "Jordan",
      updated: "Jul 27",
    },
  ];

  return (
    <div className={styles.sectionPage}>
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.kicker}>Campaign operations</span>
          <h1>One source creative. Every approved placement.</h1>
          <p>
            Track source assets, context versions, reviews and output jobs
            without losing the campaign lineage.
          </p>
        </div>
        <button type="button" className={styles.primaryButton}>
          <Sparkles size={17} /> New campaign
        </button>
      </div>

      <div className={styles.pipeline}>
        {["Brief", "Context", "Generate", "QA", "Approved", "Export"].map(
          (step, index) => (
            <div className={styles.pipelineStep} key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
              {index < 5 ? <div /> : null}
            </div>
          ),
        )}
      </div>

      <section className={`${styles.panel} ${styles.tablePanel}`}>
        <div className={styles.panelHeading}>
          <div>
            <span className={styles.eyebrow}>{dealer.name}</span>
            <h2>Campaign queue</h2>
          </div>
          <span className={styles.statusPill}>3 active</span>
        </div>
        <div className={styles.campaignTable}>
          <div className={styles.tableHead}>
            <span>Campaign</span>
            <span>Output</span>
            <span>Status</span>
            <span>Owner</span>
            <span>Updated</span>
          </div>
          {rows.map((row) => (
            <button type="button" className={styles.tableRow} key={row.name}>
              <span>
                <strong>{row.name}</strong>
                <small>
                  {dealer.marque} {dealer.vehicle}
                </small>
              </span>
              <span>{row.formats}</span>
              <span>
                <i
                  className={`${styles.statusDot} ${
                    row.status === "Approved"
                      ? styles.approved
                      : row.status === "Draft"
                        ? styles.draft
                        : ""
                  }`}
                />
                {row.status}
              </span>
              <span>{row.owner}</span>
              <span>
                {row.updated}
                <ChevronRight size={16} />
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function Demographics({ dealer }: { dealer: Dealer }) {
  const metrics = [
    { label: "2025 population", value: dealer.demographic.population },
    { label: "Median household income", value: dealer.demographic.income },
    { label: "Non-English at home", value: dealer.demographic.language },
    { label: "Mean commute", value: dealer.demographic.commute },
  ];

  return (
    <div className={styles.sectionPage}>
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.kicker}>Verified market context</span>
          <h1>
            Use local facts to form hypotheses—not to stereotype customers.
          </h1>
          <p>
            Every recommendation is labeled as an inference and stays attached
            to its supporting public source.
          </p>
        </div>
        <a
          className={styles.secondaryButton}
          href={dealer.demographic.source}
          target="_blank"
          rel="noreferrer"
        >
          Open primary source <ArrowRight size={17} />
        </a>
      </div>

      <div className={styles.metricGrid}>
        {metrics.map((metric) => (
          <article className={styles.metricCard} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>U.S. Census Bureau</small>
          </article>
        ))}
      </div>

      <div className={styles.insightGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <span className={styles.eyebrow}>Verified facts</span>
              <h2>
                {dealer.city}, {dealer.state}
              </h2>
            </div>
            <CheckCircle2 size={21} className={styles.verifiedIcon} />
          </div>
          <ul className={styles.insightList}>
            {dealer.demographic.facts.map((fact) => (
              <li key={fact}>
                <Check size={16} />
                {fact}
              </li>
            ))}
          </ul>
          <a
            className={styles.sourceLink}
            href={dealer.demographic.source}
            target="_blank"
            rel="noreferrer"
          >
            {dealer.demographic.sourceLabel}
            <ArrowRight size={14} />
          </a>
        </section>

        <section className={`${styles.panel} ${styles.recommendationPanel}`}>
          <div className={styles.panelHeading}>
            <div>
              <span className={styles.eyebrow}>System inference</span>
              <h2>Creative testing recommendations</h2>
            </div>
            <Sparkles size={21} />
          </div>
          <ul className={styles.recommendations}>
            {dealer.demographic.recommendations.map((recommendation, index) => (
              <li key={recommendation}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{recommendation}</p>
              </li>
            ))}
          </ul>
          <p className={styles.inferenceNote}>
            These are planning hypotheses. A real campaign would validate them
            through client context, platform data and controlled creative tests.
          </p>
        </section>
      </div>
    </div>
  );
}

function BuildGuide() {
  const [activeStageId, setActiveStageId] = useState(buildStages[0].id);
  const stage =
    buildStages.find((item) => item.id === activeStageId) || buildStages[0];

  return (
    <div className={styles.guidePage}>
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.kicker}>How this system was built</span>
          <h1>From repeated design task to controlled creative system.</h1>
          <p>
            This guide documents the decisions, architecture, working prototype
            and production path behind Dealer Creative OS.
          </p>
        </div>
        <div className={styles.guideLegend}>
          <span>
            <i className={styles.legendWorking} /> Working now
          </span>
          <span>
            <i className={styles.legendPlanned} /> Production path
          </span>
        </div>
      </div>

      <div className={styles.architecture}>
        {["Assets", "Context", "Guardrails", "Adaptation", "QA", "Exports"].map(
          (item, index) => (
            <div className={styles.architectureNode} key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
              {index < 5 ? <ArrowRight size={18} /> : null}
            </div>
          ),
        )}
      </div>

      <div className={styles.guideLayout}>
        <nav className={styles.guideNav} aria-label="Build stages">
          {buildStages.map((item) => (
            <button
              type="button"
              key={item.id}
              className={
                item.id === activeStageId ? styles.guideNavActive : ""
              }
              onClick={() => setActiveStageId(item.id)}
            >
              <span>{item.number}</span>
              <div>
                <strong>{item.title}</strong>
                <small>{item.status}</small>
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </nav>

        <article className={styles.guideDetail}>
          <div className={styles.guideDetailTop}>
            <span className={styles.guideNumber}>{stage.number}</span>
            <span className={styles.statusPill}>{stage.status}</span>
          </div>
          <h2>{stage.title}</h2>
          <p className={styles.guideSummary}>{stage.summary}</p>
          <div className={styles.guideEvidence}>
            <span className={styles.eyebrow}>Decision evidence</span>
            {stage.evidence.map((item) => (
              <div key={item}>
                <CheckCircle2 size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className={styles.truthPanel}>
            <ShieldCheck size={22} />
            <div>
              <strong>Prototype boundary</strong>
              <p>
                The interface, dealer switching, layer controls, placement
                selection and generated previews work now. Supabase rule
                storage, model calls, automated compliance checks and final
                downloadable rendering are the documented production layer—not
                simulated claims.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export function AutoCreativeOS() {
  const [activeTab, setActiveTab] = useState<TabId>("studio");
  const [dealerId, setDealerId] = useState(dealers[0].id);
  const [visibleLayers, setVisibleLayers] = useState<Record<LayerId, boolean>>({
    background: true,
    vehicle: true,
    headline: true,
    offer: true,
    legal: true,
  });
  const [uploads, setUploads] = useState<UploadMap>({});
  const [selectedFormats, setSelectedFormats] = useState<string[]>([
    "meta",
    "story",
    "display",
  ]);
  const [activeFormat, setActiveFormat] = useState("meta");
  const [generationStatus, setGenerationStatus] = useState<
    "idle" | "generating" | "ready"
  >("idle");

  const dealer = dealers.find((item) => item.id === dealerId) || dealers[0];

  function handleDealerChange(nextDealer: Dealer) {
    setDealerId(nextDealer.id);
    setUploads({});
    setGenerationStatus("idle");
  }

  function handleLayerUpload(
    id: "background" | "vehicle",
    file?: File,
  ) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setUploads((current) => ({ ...current, [id]: reader.result as string }));
      setVisibleLayers((current) => ({ ...current, [id]: true }));
      setGenerationStatus("idle");
    };
    reader.readAsDataURL(file);
  }

  function toggleFormat(id: string) {
    setActiveFormat(id);
    setSelectedFormats((current) =>
      current.includes(id)
        ? current.length > 1
          ? current.filter((item) => item !== id)
          : current
        : [...current, id],
    );
    setGenerationStatus("idle");
  }

  function generatePlacements() {
    setGenerationStatus("generating");
    window.setTimeout(() => setGenerationStatus("ready"), 900);
  }

  return (
    <main className={styles.shell}>
      <header className={styles.topbar}>
        <button
          type="button"
          className={styles.brand}
          onClick={() => setActiveTab("studio")}
        >
          <span className={styles.brandMark}>
            <Layers3 size={18} />
          </span>
          <span>
            <strong>Dealer Creative OS</strong>
            <small>by Archer Design</small>
          </span>
        </button>

        <nav className={styles.tabs} aria-label="Product sections">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                type="button"
                key={tab.id}
                className={activeTab === tab.id ? styles.tabActive : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className={styles.headerMeta}>
          <span className={styles.systemStatus}>
            <i /> Prototype orchestration ready
          </span>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Notifications"
          >
            <Bell size={19} />
          </button>
          <button type="button" className={styles.userMenu}>
            <CircleUserRound size={31} />
            <span>DA</span>
            <ChevronDown size={15} />
          </button>
        </div>
      </header>

      <div className={styles.content}>
        {activeTab !== "guide" ? (
          <DealerSwitcher dealer={dealer} onChange={handleDealerChange} />
        ) : null}

        {activeTab === "studio" ? (
          <Studio
            dealer={dealer}
            visible={visibleLayers}
            uploads={uploads}
            selectedFormats={selectedFormats}
            activeFormat={activeFormat}
            generationStatus={generationStatus}
            onToggleLayer={(id) =>
              setVisibleLayers((current) => ({
                ...current,
                [id]: !current[id],
              }))
            }
            onUpload={handleLayerUpload}
            onToggleFormat={toggleFormat}
            onGenerate={generatePlacements}
          />
        ) : null}
        {activeTab === "library" ? <BrandLibrary dealer={dealer} /> : null}
        {activeTab === "campaigns" ? <Campaigns dealer={dealer} /> : null}
        {activeTab === "demographics" ? (
          <Demographics dealer={dealer} />
        ) : null}
        {activeTab === "guide" ? <BuildGuide /> : null}
      </div>
    </main>
  );
}
