"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Download, MessageSquarePlus, X } from "lucide-react";
import type {
  Annotation, Caption, GeneralNote, PortalData, ReviewItem, ReviewVersion,
} from "@/lib/portal/types";
import {
  captionStatusLabel, captionStatusTone, handoffState, partyLabel, statusLabel, statusTone,
} from "@/lib/portal/types";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

type DraftPin = { x: number; y: number; timestampSeconds: number | null };

/**
 * The large creative review workspace.
 *
 * Stage on the left (or top on narrow screens), review information on the
 * right. The stage dominates: the artwork is what the client came to judge.
 *
 * ANNOTATIONS
 * Clicking the artwork places a pin. Coordinates are captured as a FRACTION of
 * the rendered media box (0–1) via getBoundingClientRect, never raw page
 * pixels, so a marker stays on the same part of the image at any viewport
 * width, and survives the image being resized between sessions. Video pins also
 * capture the current playhead position, so the same data model covers motion
 * without a schema change later.
 *
 * All writes here are local state in this phase — there is no annotations table
 * yet (see supabase/migrations/20260825a_*.sql, written and NOT applied).
 */
export function ReviewWorkspace({
  item,
  data,
  backHref,
}: {
  item: ReviewItem;
  data: PortalData;
  backHref: string;
}) {
  const [versionId, setVersionId] = useState(item.versions[0]?.id ?? "");
  const [annotations, setAnnotations] = useState<Annotation[]>(item.annotations);
  const [notes, setNotes] = useState<GeneralNote[]>(item.notes);
  const [captions, setCaptions] = useState<Caption[]>(item.captions);

  const [draftPin, setDraftPin] = useState<DraftPin | null>(null);
  const [draftBody, setDraftBody] = useState("");
  const [activeAnnotation, setActiveAnnotation] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [activeCaption, setActiveCaption] = useState(0);
  const [decisionNote, setDecisionNote] = useState("");
  const [banner, setBanner] = useState<string | null>(null);

  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const version: ReviewVersion | undefined =
    item.versions.find((v) => v.id === versionId) ?? item.versions[0];
  const isLatest = version?.id === item.versions[0]?.id;

  const visibleAnnotations = useMemo(
    () => annotations.filter((a) => a.versionId === version?.id),
    [annotations, version?.id]
  );

  const handoff = handoffState({ ...item, captions }, data.responsibility);

  function placePin(e: React.MouseEvent<HTMLDivElement>) {
    if (!mediaRef.current || item.mediaType !== "image") return;
    const box = mediaRef.current.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width;
    const y = (e.clientY - box.top) / box.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    setDraftPin({ x, y, timestampSeconds: null });
    setDraftBody("");
    setActiveAnnotation(null);
  }

  function pinAtPlayhead() {
    const t = videoRef.current?.currentTime ?? 0;
    // Centre-frame pin: for video the timestamp is what matters, not the point.
    setDraftPin({ x: 0.5, y: 0.5, timestampSeconds: Math.round(t * 10) / 10 });
    setDraftBody("");
  }

  function savePin() {
    if (!draftPin || !draftBody.trim() || !version) return;
    const created: Annotation = {
      id: `local-${Date.now()}`,
      versionId: version.id,
      x: draftPin.x,
      y: draftPin.y,
      timestampSeconds: draftPin.timestampSeconds,
      body: draftBody.trim(),
      authorName: data.viewerFirstName,
      authorRole: "client",
      createdAt: new Date().toISOString(),
      resolved: false,
    };
    setAnnotations((prev) => [...prev, created]);
    setDraftPin(null);
    setDraftBody("");
    setActiveAnnotation(created.id);
    setBanner("Comment added. It will be saved once annotations are connected to the database.");
  }

  function addNote() {
    if (!noteDraft.trim()) return;
    setNotes((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        body: noteDraft.trim(),
        authorName: data.viewerFirstName,
        authorRole: "client",
        createdAt: new Date().toISOString(),
      },
    ]);
    setNoteDraft("");
  }

  function decideCaption(id: string, status: Caption["status"]) {
    setCaptions((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    setBanner(
      status === "approved" ? "Copy approved." : "Copy sent back to Archer with your notes."
    );
  }

  const caption = captions[activeCaption];

  return (
    <div className="ap-work">
      {/* ── Stage ───────────────────────────────────────────────────────── */}
      <section className="ap-work-stage">
        <header className="ap-work-bar">
          <Link href={backHref} className="ap-btn ap-btn--quiet ap-btn--sm">
            <ArrowLeft size={14} aria-hidden="true" /> All creative
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            {item.mediaType === "video" && (
              <button type="button" className="ap-btn ap-btn--quiet ap-btn--sm" onClick={pinAtPlayhead}>
                <MessageSquarePlus size={14} aria-hidden="true" /> Comment at current time
              </button>
            )}
            <span className={`ap-pill ap-pill--${statusTone(item.status)}`}>{statusLabel(item.status)}</span>
          </div>
        </header>

        <div className="ap-stage-area">
          {version?.url ? (
            <div
              ref={mediaRef}
              className={`ap-frame${item.mediaType === "image" ? " ap-frame--annotatable" : ""}`}
              onClick={item.mediaType === "image" ? placePin : undefined}
            >
              {item.mediaType === "video" ? (
                <video ref={videoRef} src={version.url} controls preload="metadata" playsInline />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element -- signed/short-lived or demo path; not next/image optimizable */
                <img src={version.url} alt={item.title} />
              )}

              {visibleAnnotations.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  className={`ap-marker${activeAnnotation === a.id ? " is-active" : ""}`}
                  style={{ left: `${a.x * 100}%`, top: `${a.y * 100}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveAnnotation(a.id === activeAnnotation ? null : a.id);
                  }}
                  aria-label={`Comment ${i + 1}: ${a.body}`}
                >
                  {i + 1}
                </button>
              ))}

              {draftPin && (
                <span
                  className="ap-marker ap-marker--draft"
                  style={{ left: `${draftPin.x * 100}%`, top: `${draftPin.y * 100}%` }}
                  aria-hidden="true"
                >
                  +
                </span>
              )}
            </div>
          ) : (
            <div className="ap-empty">
              <strong>Preview unavailable</strong>
              This version&apos;s file could not be loaded.
            </div>
          )}
        </div>
      </section>

      {/* ── Side panel ──────────────────────────────────────────────────── */}
      <aside className="ap-work-side">
        <div>
          <span className="ap-eyebrow">{item.campaign ?? "Creative"}</span>
          <h1 className="ap-h2" style={{ marginTop: 8 }}>{item.title}</h1>
          {item.description && <p className="ap-muted" style={{ marginTop: 8 }}>{item.description}</p>}

          <div className="ap-meta-grid" style={{ marginTop: 18 }}>
            <div>
              <span className="ap-label">Type</span>
              <span style={{ fontSize: 13.5 }}>{item.mediaType === "video" ? "Motion" : "Still graphic"}</span>
            </div>
            <div>
              <span className="ap-label">Property</span>
              <span style={{ fontSize: 13.5 }}>{item.propertyName}</span>
            </div>
            <div>
              <span className="ap-label">Channels</span>
              <span style={{ fontSize: 13.5 }}>{item.channels.length ? item.channels.join(", ") : "—"}</span>
            </div>
            <div>
              <span className="ap-label">Due</span>
              <span style={{ fontSize: 13.5 }}>{item.dueDate ? fmtDate(item.dueDate) : "—"}</span>
            </div>
            {item.dimensions && (
              <div>
                <span className="ap-label">Dimensions</span>
                <span style={{ fontSize: 13.5 }}>{item.dimensions}</span>
              </div>
            )}
            {item.durationSeconds != null && (
              <div>
                <span className="ap-label">Duration</span>
                <span style={{ fontSize: 13.5 }}>{item.durationSeconds}s</span>
              </div>
            )}
          </div>
        </div>

        {/* Versions */}
        <div>
          <span className="ap-label">Versions</span>
          <div className="ap-versions" style={{ marginTop: 10 }}>
            {item.versions.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`ap-vbtn${v.id === item.versions[0]?.id ? " ap-vbtn--latest" : ""}`}
                aria-pressed={v.id === version?.id}
                onClick={() => { setVersionId(v.id); setActiveAnnotation(null); setDraftPin(null); }}
              >
                V{v.versionNumber}
              </button>
            ))}
          </div>
          {version?.note && <p className="ap-muted" style={{ marginTop: 10, fontSize: 12.5 }}>{version.note}</p>}
          {!isLatest && (
            <p className="ap-muted" style={{ marginTop: 8, fontSize: 12, fontStyle: "italic" }}>
              You&apos;re viewing an earlier version. Decisions apply to the latest.
            </p>
          )}
        </div>

        {banner && (
          <div>
            <div className="ap-notice">
              <span>{banner}</span>
              <button type="button" className="ap-btn ap-btn--quiet ap-btn--sm" onClick={() => setBanner(null)}>
                <X size={12} aria-hidden="true" /> Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Pin composer */}
        {draftPin && (
          <div>
            <span className="ap-eyebrow">
              {draftPin.timestampSeconds != null ? `Comment at ${draftPin.timestampSeconds}s` : "Comment on this point"}
            </span>
            <textarea
              className="ap-textarea"
              style={{ marginTop: 10 }}
              autoFocus
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              placeholder="e.g. Can this logo move slightly higher?"
            />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button type="button" className="ap-btn ap-btn--primary ap-btn--sm" onClick={savePin} disabled={!draftBody.trim()}>
                Add comment
              </button>
              <button type="button" className="ap-btn ap-btn--quiet ap-btn--sm" onClick={() => setDraftPin(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Point comments */}
        <div>
          <span className="ap-label">
            Point comments {visibleAnnotations.length > 0 && `(${visibleAnnotations.length})`}
          </span>
          {visibleAnnotations.length === 0 ? (
            <p className="ap-muted" style={{ marginTop: 10, fontSize: 12.5 }}>
              {item.mediaType === "image"
                ? "Click anywhere on the artwork to leave a comment pinned to that spot."
                : "Use “Comment at current time” to pin a note to a moment in the video."}
            </p>
          ) : (
            <div className="ap-thread" style={{ marginTop: 12 }}>
              {visibleAnnotations.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  className={`ap-comment ap-comment--clickable${activeAnnotation === a.id ? " is-active" : ""}`}
                  onClick={() => setActiveAnnotation(a.id === activeAnnotation ? null : a.id)}
                >
                  <span className="ap-comment-num">{i + 1}</span>
                  <span className="ap-comment-body">
                    <span className="ap-comment-who">
                      {a.authorName}
                      <span className={`ap-role${a.authorRole === "admin" ? " ap-role--archer" : ""}`}>
                        {a.authorRole === "admin" ? "Archer" : "You"}
                      </span>
                    </span>
                    <span className="ap-comment-text" style={{ display: "block" }}>{a.body}</span>
                    <span className="ap-comment-time">
                      {a.timestampSeconds != null ? `At ${a.timestampSeconds}s · ` : ""}
                      {fmtDateTime(a.createdAt)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Decisions */}
        {item.status === "ready_for_review" && (
          <div>
            <span className="ap-eyebrow">Your decision</span>
            <textarea
              className="ap-textarea"
              style={{ marginTop: 10 }}
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder="Optional when approving. Required for changes or a new direction."
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              <ReviewDecisionButtons itemId={item.id} note={decisionNote} demo={data.source === "demo"} />
            </div>
            {data.source === "demo" && (
              <p className="ap-muted" style={{ fontSize: 12, marginTop: 10 }}>
                Decisions are disabled in preview — there is no real review item behind this demo card.
              </p>
            )}
          </div>
        )}

        {/* Captions */}
        {captions.length > 0 && (
          <div>
            <span className="ap-eyebrow">Caption &amp; copy</span>
            <div className="ap-tabs" role="tablist" aria-label="Caption platform" style={{ marginTop: 10 }}>
              {captions.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  className="ap-tab"
                  aria-selected={i === activeCaption}
                  onClick={() => setActiveCaption(i)}
                >
                  {c.platform}
                </button>
              ))}
            </div>

            {caption && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "12px 0" }}>
                  <span className={`ap-pill ap-pill--${captionStatusTone(caption.status)}`}>
                    {captionStatusLabel(caption.status)}
                  </span>
                </div>
                <div className="ap-caption">
                  {caption.headline && <strong style={{ display: "block", marginBottom: 8 }}>{caption.headline}</strong>}
                  {caption.body}
                  {caption.hashtags.length > 0 && (
                    <div className="ap-hashtags" style={{ marginTop: 10 }}>{caption.hashtags.join(" ")}</div>
                  )}
                  {caption.callToAction && (
                    <div style={{ marginTop: 10 }}>
                      <span className="ap-label">Call to action</span> {caption.callToAction}
                    </div>
                  )}
                </div>

                {caption.status !== "approved" && caption.status !== "draft" && (
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <button type="button" className="ap-btn ap-btn--approve ap-btn--sm" onClick={() => decideCaption(caption.id, "approved")}>
                      <Check size={13} aria-hidden="true" /> Approve copy
                    </button>
                    <button type="button" className="ap-btn ap-btn--changes ap-btn--sm" onClick={() => decideCaption(caption.id, "changes_requested")}>
                      Request copy changes
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* General notes */}
        <div>
          <span className="ap-eyebrow">Notes &amp; feedback</span>
          <p className="ap-muted" style={{ fontSize: 12.5, marginTop: 6 }}>
            For anything not tied to a specific point on the artwork.
          </p>

          {notes.length > 0 && (
            <div className="ap-thread" style={{ marginTop: 14 }}>
              {notes.map((n) => (
                <div key={n.id} className="ap-comment">
                  <div className="ap-comment-body">
                    <span className="ap-comment-who">
                      {n.authorName}
                      <span className={`ap-role${n.authorRole === "admin" ? " ap-role--archer" : ""}`}>
                        {n.authorRole === "admin" ? "Archer" : "You"}
                      </span>
                    </span>
                    <p className="ap-comment-text">{n.body}</p>
                    <span className="ap-comment-time">{fmtDateTime(n.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <textarea
            className="ap-textarea"
            style={{ marginTop: 14 }}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Add a note for Archer…"
          />
          <button type="button" className="ap-btn ap-btn--quiet ap-btn--sm" style={{ marginTop: 10 }} onClick={addNote} disabled={!noteDraft.trim()}>
            Add note
          </button>
        </div>

        {/* Handoff */}
        <div>
          <span className="ap-eyebrow">After approval</span>
          {handoff === "not_ready" ? (
            <p className="ap-muted" style={{ marginTop: 8 }}>
              {item.status === "approved"
                ? "Creative is approved. Waiting on copy approval before this is finished."
                : "This becomes available once the creative is approved."}
            </p>
          ) : handoff === "ready_to_publish" ? (
            <>
              <span className="ap-pill ap-pill--approved" style={{ marginTop: 8 }}>Ready to publish</span>
              <p className="ap-muted" style={{ marginTop: 10 }}>
                {partyLabel(data.responsibility.publishing, data.organizationName)} will publish this to{" "}
                {item.channels.join(" and ") || "the agreed channels"}.
              </p>
            </>
          ) : (
            <>
              <span className="ap-pill ap-pill--approved" style={{ marginTop: 8 }}>Approved &amp; ready</span>
              <p className="ap-muted" style={{ marginTop: 10, marginBottom: 12 }}>
                Your team handles publishing for this property — download the final asset below.
              </p>
              {version?.url && (
                <a className="ap-btn ap-btn--primary ap-btn--sm" href={version.url} download={version.originalFilename ?? undefined}>
                  <Download size={13} aria-hidden="true" /> Download final asset
                </a>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

/**
 * Decision buttons. Extracted so the RPC call stays in one place and the
 * workspace above stays about layout.
 */
function ReviewDecisionButtons({ itemId, note, demo }: { itemId: string; note: string; demo: boolean }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: "approved" | "changes_requested" | "new_direction_requested", needsNote: boolean) {
    setError(null);
    if (needsNote && !note.trim()) {
      setError(
        decision === "new_direction_requested"
          ? "A new direction means the concept needs rethinking — please say briefly what isn't working."
          : "Please add a short note so Archer knows what to change."
      );
      return;
    }
    if (demo) return;

    const { getSupabaseClient } = await import("@/lib/supabase");
    const client = getSupabaseClient();
    if (!client) {
      setError("This workspace isn't connected right now.");
      return;
    }
    setBusy(decision);
    const { error: rpcError } = await client.rpc("review_client_decide", {
      p_review_item_id: itemId,
      p_decision: decision,
      p_message: note.trim() || null,
    });
    setBusy(null);
    if (rpcError) setError(rpcError.message);
    else window.location.reload();
  }

  return (
    <>
      <button type="button" className="ap-btn ap-btn--approve" disabled={demo || busy !== null} onClick={() => decide("approved", false)}>
        <Check size={14} aria-hidden="true" /> {busy === "approved" ? "Saving…" : "Approve"}
      </button>
      <button type="button" className="ap-btn ap-btn--changes" disabled={demo || busy !== null} onClick={() => decide("changes_requested", true)}>
        Request changes
      </button>
      <button type="button" className="ap-btn ap-btn--direction" disabled={demo || busy !== null} onClick={() => decide("new_direction_requested", true)}>
        New direction
      </button>
      {error && (
        <p style={{ color: "var(--ap-changes)", fontSize: 12.5, width: "100%", margin: "4px 0 0" }} role="alert">
          {error}
        </p>
      )}
    </>
  );
}
