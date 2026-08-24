import type { ReviewItem } from "@/lib/portal/types";
import { statusLabel, statusTone } from "@/lib/portal/types";
import { ReviewDecision } from "./ReviewDecision";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function MediaStage({ item }: { item: ReviewItem }) {
  const current = item.versions[0];

  // In demo mode, and whenever a signed URL could not be minted, show a labelled
  // placeholder rather than a broken <img>. Signed URLs are short-lived by
  // design (10 minutes) and the bucket is private, so an expired link is a
  // normal condition, not an error state worth alarming the client about.
  if (!current?.url) {
    return (
      <div className="ap-item-media ap-item-media--empty">
        <span className="ap-item-media-empty">
          {item.mediaType === "video" ? "Video" : "Image"}
          <br />
          {current?.originalFilename ?? "preview unavailable"}
        </span>
      </div>
    );
  }

  return (
    <div className="ap-item-media">
      {item.mediaType === "video" ? (
        <video src={current.url} controls preload="metadata" playsInline />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- signed, short-lived Supabase Storage URL; not optimizable by next/image
        <img src={current.url} alt={item.title} />
      )}
    </div>
  );
}

/**
 * One piece of creative, with its decision controls and history.
 *
 * `readOnly` is set for the owner's demo preview: the decision buttons render
 * so the layout can be judged, but they are disabled, because there is no real
 * review_item behind them to decide on.
 */
export function ReviewItemCard({ item, readOnly }: { item: ReviewItem; readOnly: boolean }) {
  const decidable = item.status === "ready_for_review";
  const latestClientNote = [...item.actions]
    .reverse()
    .find((a) => a.byRole === "client" && a.message);

  return (
    <article className="ap-item">
      <div className="ap-item-body">
        <div className="ap-item-head">
          <div>
            <h3 className="ap-item-title">{item.title}</h3>
            <p className="ap-item-meta">
              {item.propertyName ? `${item.propertyName} · ` : ""}Version {item.currentVersion} · Updated{" "}
              {formatDate(item.updatedAt)}
            </p>
          </div>
          <span className={`ap-pill ap-pill--${statusTone(item.status)}`}>{statusLabel(item.status)}</span>
        </div>

        {item.description && <p className="ap-muted">{item.description}</p>}

        {item.status === "draft" && (
          <p className="ap-muted" style={{ fontStyle: "italic" }}>
            Archer is working on this. It will appear for your review when it&apos;s ready.
          </p>
        )}

        {!decidable && latestClientNote && item.status !== "draft" && (
          <div style={{ borderLeft: "2px solid var(--ap-gold-line)", paddingLeft: 14 }}>
            <span className="ap-label">Your last note</span>
            <p style={{ margin: "6px 0 0", fontSize: 13.5 }}>{latestClientNote.message}</p>
          </div>
        )}

        {decidable && <ReviewDecision itemId={item.id} readOnly={readOnly} />}

        {item.actions.length > 0 && (
          <details style={{ marginTop: 4 }}>
            <summary style={{ cursor: "pointer", fontSize: 12.5, color: "var(--ap-charcoal-soft)" }}>
              Activity ({item.actions.length})
            </summary>
            <ul className="ap-history" style={{ marginTop: 14 }}>
              {item.actions.map((a) => (
                <li key={a.id}>
                  <div>
                    <strong style={{ fontWeight: 600 }}>{a.byName}</strong>{" "}
                    {a.action.replace(/_/g, " ")}
                    {a.message ? `: ${a.message}` : "."}
                    <time dateTime={a.createdAt}>{formatDate(a.createdAt)}</time>
                  </div>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      <MediaStage item={item} />
    </article>
  );
}
