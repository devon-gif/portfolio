import Link from "next/link";
import type { PortalData, ReviewItem } from "@/lib/portal/types";
import { statusLabel, statusTone } from "@/lib/portal/types";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Thumb({ item }: { item: ReviewItem }) {
  const v = item.versions[0];
  return (
    <div className="ap-qthumb">
      <span className="ap-qthumb-type">{item.mediaType === "video" ? "Motion" : "Still"}</span>
      {v?.url ? (
        item.mediaType === "video" ? (
          /* #t=0.5 asks the browser to seek half a second in, so the tile shows
             a real frame instead of an empty black box. Without it, a video
             with no poster renders blank until played. */
          <video src={`${v.url}#t=0.5`} muted playsInline preload="metadata" />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element -- signed/short-lived or demo path */
          <img src={v.url} alt="" />
        )
      ) : null}
    </div>
  );
}

export function QueueCard({ item, hrefBase }: { item: ReviewItem; hrefBase: string }) {
  return (
    <Link href={`${hrefBase}/${item.id}`} className="ap-qcard">
      <Thumb item={item} />
      <div className="ap-qbody">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
          <h3 className="ap-qtitle">{item.title}</h3>
          <span className={`ap-pill ap-pill--${statusTone(item.status)}`}>{statusLabel(item.status)}</span>
        </div>
        <p className="ap-qmeta">
          {item.propertyName} · V{item.currentVersion}
          {item.dueDate ? ` · Due ${fmtDate(item.dueDate)}` : ""}
        </p>
      </div>
    </Link>
  );
}

/**
 * The Creative Review queue.
 *
 * Sections are ordered so the first thing a client sees answers "what does
 * Devon need from me?" — everything else is reference.
 */
export function ReviewQueue({ data, hrefBase }: { data: PortalData; hrefBase: string }) {
  const visible = data.items.filter((i) => i.status !== "archived");

  const groups = [
    { key: "needs", label: "Needs your review", items: visible.filter((i) => i.status === "ready_for_review") },
    {
      key: "progress",
      label: "Changes in progress",
      items: visible.filter(
        (i) => i.status === "changes_requested" || i.status === "new_direction_requested" || i.status === "draft"
      ),
    },
    { key: "approved", label: "Approved", items: visible.filter((i) => i.status === "approved") },
    { key: "archived", label: "Archived", items: data.items.filter((i) => i.status === "archived") },
  ].filter((g) => g.items.length > 0);

  if (visible.length === 0) {
    return (
      <div className="ap-card">
        <div className="ap-empty">
          <strong>Nothing to review yet</strong>
          When Archer sends work over, it will appear here for your approval.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
      {groups.map((g) => (
        <section key={g.key}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
            <h2 className="ap-h2">{g.label}</h2>
            <span className="ap-muted">{g.items.length}</span>
          </div>
          <div className="ap-queue">
            {g.items.map((item) => (
              <QueueCard key={item.id} item={item} hrefBase={hrefBase} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
