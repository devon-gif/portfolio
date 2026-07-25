"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Check, Compass, Download, PenLine } from "lucide-react";

import { supabase } from "@/lib/supabase";
import {
  clientDecide,
  downloadApprovedAsset,
  isReviewSupabaseConfigured,
  listOrganizations,
  listProperties,
  listReviewItems,
  subscribeToChanges,
  type OrganizationRecord,
  type PropertyRecord,
  type ReviewItemRecord,
  type ReviewStatus,
} from "@/lib/review";

import ChatPanel from "./ChatPanel";
import MediaPreview from "./MediaPreview";
import styles from "./SimpleReview.module.css";

const VALENCIA_LOGO_SRC = "/review/valencia-hotel-collection-logo.jpeg";

const CLIENT_SESSION_KEY =
  "archer-review-emma-demo";

type Filter =
  | "All"
  | "Awaiting review"
  | "Approved"
  | "Changes requested";

type PropertyFilter = "All" | string;

function readableDate(
  value: string,
) {
  if (!value) return "Not set";

  const date = new Date(
    `${value}T12:00:00`,
  );

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );
}

function statusClass(
  status: ReviewStatus,
) {
  if (status === "Approved") {
    return styles.statusApproved;
  }

  if (
    status ===
    "Revision requested"
  ) {
    return styles.statusRevision;
  }

  if (
    status ===
    "New direction requested"
  ) {
    return styles.statusDirection;
  }

  if (status === "Draft") {
    return styles.statusDraft;
  }

  return "";
}

/**
 * The client review queue. Rendered both by the deprecated /review route
 * (which now redirects to /emma — see app/review/page.tsx) and by /emma
 * itself (app/emma/page.tsx), which wraps it in a real magic-link auth
 * guard once Supabase is configured. When Supabase isn't configured, this
 * component falls back to its own "Continue as Emma" local demo gate so the
 * portal still renders during local development.
 */
export default function SimpleClientReview() {
  const [items, setItems] =
    useState<ReviewItemRecord[]>([]);

  const [organizations, setOrganizations] =
    useState<OrganizationRecord[]>([]);

  const [selectedOrgId, setSelectedOrgId] =
    useState("");

  const [properties, setProperties] =
    useState<PropertyRecord[]>([]);

  const [ready, setReady] =
    useState(false);

  const [signedIn, setSignedIn] =
    useState(false);

  const [filter, setFilter] =
    useState<Filter>("All");

  const [propertyFilter, setPropertyFilter] =
    useState<PropertyFilter>("All");

  const [feedback, setFeedback] =
    useState<Record<string, string>>(
      {},
    );

  const [errors, setErrors] =
    useState<Record<string, string>>(
      {},
    );

  // Disables the Approve / Request revision / New direction buttons for a
  // given item while its decision is being saved, so a slow save (or a
  // double click) can't submit the same decision twice.
  const [processing, setProcessing] =
    useState<Record<string, boolean>>(
      {},
    );

  // Disables the manual "Download approved asset" button for a given item
  // while a download is in flight, and drives its "Preparing download…" copy.
  const [downloading, setDownloading] =
    useState<Record<string, boolean>>(
      {},
    );

  // A short-lived, per-item status line shown under the decision panel —
  // "Approved and ready to share.", the download-failed fallback notice, or
  // "Download started." Cleared automatically the next time that item's
  // state actually changes.
  const [downloadNotice, setDownloadNotice] =
    useState<Record<string, string>>(
      {},
    );

  const supabaseMode = isReviewSupabaseConfigured();

  const loadItems = useCallback(() => {
    listReviewItems({ organizationId: selectedOrgId || undefined, forClient: true })
      .then(setItems)
      .catch((error) => console.error("Failed to load review items:", error));
  }, [selectedOrgId]);

  useEffect(() => {
    // Deferred via queueMicrotask (rather than setState directly in the
    // effect body) to avoid a cascading-render lint warning.
    if (supabaseMode) {
      queueMicrotask(() => setSignedIn(true));
      return;
    }
    const local =
      window.localStorage.getItem(CLIENT_SESSION_KEY) === "true";
    queueMicrotask(() => setSignedIn(local));
  }, [supabaseMode]);

  useEffect(() => {
    let active = true;
    listOrganizations()
      .then((orgs) => {
        if (!active) return;
        setOrganizations(orgs);
        setSelectedOrgId((current) => current || orgs[0]?.id || "");
        setReady(true);
      })
      .catch((error) => {
        console.error("Failed to load organizations:", error);
        setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedOrgId) return;
    let active = true;
    listProperties(selectedOrgId).then((props) => {
      if (active) setProperties(props);
    });
    return () => {
      active = false;
    };
  }, [selectedOrgId]);

  useEffect(() => {
    if (!selectedOrgId) return;
    loadItems();
    return subscribeToChanges(selectedOrgId, loadItems);
  }, [selectedOrgId, loadItems]);

  const visibleItems = useMemo(
    () =>
      items.filter(
        (item) => {
          if (
            item.status ===
              "Draft" ||
            item.status ===
              "Archived"
          ) {
            return false;
          }

          if (propertyFilter !== "All" && item.property !== propertyFilter) {
            return false;
          }

          if (filter === "All") {
            return true;
          }

          if (
            filter ===
            "Changes requested"
          ) {
            return (
              item.status ===
                "Revision requested" ||
              item.status ===
                "New direction requested"
            );
          }

          return (
            item.status === filter
          );
        },
      ),
    [filter, propertyFilter, items],
  );

  const counts = {
    awaiting: items.filter(
      (item) =>
        item.status ===
        "Awaiting review",
    ).length,

    approved: items.filter(
      (item) =>
        item.status === "Approved",
    ).length,

    changes: items.filter(
      (item) =>
        item.status ===
          "Revision requested" ||
        item.status ===
          "New direction requested",
    ).length,
  };

  async function submitDecision(
    item: ReviewItemRecord,
    status:
      | "Approved"
      | "Revision requested"
      | "New direction requested",
  ) {
    if (processing[item.id]) {
      // Already saving this item's decision — ignore the extra click rather
      // than submitting the same decision twice.
      return;
    }

    const note =
      feedback[item.id]?.trim() ||
      "";

    if (
      status !== "Approved" &&
      !note
    ) {
      setErrors((current) => ({
        ...current,
        [item.id]:
          "Please include feedback before requesting a change.",
      }));

      return;
    }

    setProcessing((current) => ({ ...current, [item.id]: true }));

    // Step 1: save the decision first, and confirm it actually succeeded
    // before touching anything else. If this throws, the item is left
    // exactly as it was — no download is attempted, and nothing about the
    // (unsaved) approval is shown as successful.
    try {
      await clientDecide(item.id, status, note);
    } catch (error) {
      console.error(error);
      setErrors((current) => ({
        ...current,
        [item.id]:
          error instanceof Error ? error.message : "This decision could not be saved.",
      }));
      setProcessing((current) => ({ ...current, [item.id]: false }));
      return;
    }

    // Step 2: the save succeeded. Refresh the list so the card visually
    // flips to Approved, clear the feedback form, and — only for a direct
    // Approve click, never on refresh or a background re-render — attempt
    // the automatic download. A failed download never undoes the approval
    // that's already been saved.
    loadItems();

    setFeedback((current) => ({ ...current, [item.id]: "" }));
    setErrors((current) => ({ ...current, [item.id]: "" }));

    if (status === "Approved") {
      setDownloadNotice((current) => ({ ...current, [item.id]: "Approved and ready to share." }));

      try {
        await downloadApprovedAsset(item);
      } catch (downloadError) {
        console.error("Automatic download failed:", downloadError);
        setDownloadNotice((current) => ({
          ...current,
          [item.id]:
            "Your approval was saved, but the automatic download could not start. Use the download button below.",
        }));
      }
    }

    setProcessing((current) => ({ ...current, [item.id]: false }));
  }

  async function handleManualDownload(item: ReviewItemRecord) {
    if (downloading[item.id]) {
      // A download for this item is already in flight — ignore the repeat
      // click rather than firing a second overlapping download.
      return;
    }

    setDownloading((current) => ({ ...current, [item.id]: true }));
    setDownloadNotice((current) => ({ ...current, [item.id]: "Preparing download…" }));

    try {
      await downloadApprovedAsset(item);
      setDownloadNotice((current) => ({ ...current, [item.id]: "Download started." }));
    } catch (error) {
      console.error(error);
      setDownloadNotice((current) => ({
        ...current,
        [item.id]: "This file could not be downloaded. Please try again.",
      }));
    } finally {
      setDownloading((current) => ({ ...current, [item.id]: false }));
    }
  }

  if (!ready) {
    return null;
  }

  if (!signedIn) {
    return (
      <main
        className={styles.login}
      >
        <section
          className={
            styles.loginCard
          }
        >
          <div className={styles.loginLogo}>
            <img src={VALENCIA_LOGO_SRC} alt="Valencia Hotel Collection" />
          </div>

          <h1>Archer Review</h1>

          <p>
            Private creative review
            workspace for Valencia Hotel
            Collection.
          </p>

          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={() => {
              window.localStorage.setItem(
                CLIENT_SESSION_KEY,
                "true",
              );

              setSignedIn(true);
            }}
          >
            Continue as Emma
          </button>

          <p className={styles.help}>
            Local demonstration access.
            Production authentication can
            be added after launch.
          </p>
        </section>
      </main>
    );
  }

  return (
    <div className={styles.shell}>
      <header
        className={styles.header}
      >
        <div
          className={styles.brand}
        >
          <div className={styles.brandMark}>
            <img className={styles.brandLogo} src={VALENCIA_LOGO_SRC} alt="Valencia Hotel Collection" />
          </div>

          <div className={styles.brandText}>
            <h1
              className={
                styles.brandTitle
              }
            >
              Archer Review
            </h1>

            <span
              className={
                styles.brandSub
              }
            >
              {organizations.find((o) => o.id === selectedOrgId)?.name ||
                "Valencia Hotel Collection"}
            </span>
          </div>
        </div>

        <div
          className={
            styles.headerActions
          }
        >
          <div
            className={styles.user}
          >
            <span
              className={
                styles.userName
              }
            >
              Emma Stinson
            </span>

            <span
              className={
                styles.userRole
              }
            >
              Client approver
            </span>
          </div>

          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={async () => {
              if (supabaseMode) {
                await supabase.auth.signOut();
                window.location.href = "/emma";
                return;
              }
              window.localStorage.removeItem(
                CLIENT_SESSION_KEY,
              );

              setSignedIn(false);
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <section
          className={styles.hero}
        >
          <div>
            <h1>
              Creative review queue
            </h1>

            <p>
              Review each motion asset,
              approve it, request a specific
              revision, or request a completely
              new direction.
            </p>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>
                {counts.awaiting}
              </strong>
              <span>Awaiting</span>
            </div>

            <div className={styles.stat}>
              <strong>
                {counts.changes}
              </strong>
              <span>Changes</span>
            </div>

            <div className={styles.stat}>
              <strong>
                {counts.approved}
              </strong>
              <span>Approved</span>
            </div>
          </div>
        </section>

        <div className={styles.tabs}>
          {[
            "All",
            "Awaiting review",
            "Changes requested",
            "Approved",
          ].map((option) => (
            <button
              key={option}
              className={`${styles.tab} ${
                filter === option
                  ? styles.tabActive
                  : ""
              }`}
              onClick={() =>
                setFilter(
                  option as Filter,
                )
              }
            >
              {option}
            </button>
          ))}
        </div>

        {properties.length > 1 && (
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${
                propertyFilter === "All" ? styles.tabActive : ""
              }`}
              onClick={() => setPropertyFilter("All")}
            >
              All properties
            </button>
            {properties.map((property) => (
              <button
                key={property.id}
                className={`${styles.tab} ${
                  propertyFilter === property.name ? styles.tabActive : ""
                }`}
                onClick={() => setPropertyFilter(property.name)}
              >
                {property.name}
              </button>
            ))}
          </div>
        )}

        <div className={styles.grid}>
          {visibleItems.map((item) => (
            <article
              key={item.id}
              className={styles.card}
            >
              <div
                className={
                  styles.cardTop
                }
              >
                <div>
                  <h2
                    className={
                      styles.cardTitle
                    }
                  >
                    {item.title}
                  </h2>

                  <div
                    className={
                      styles.cardMeta
                    }
                  >
                    {item.property}
                    {" · "}
                    Version {item.version}
                    {item.dueDate && (
                      <>
                        {" · "}
                        Due{" "}
                        {readableDate(
                          item.dueDate,
                        )}
                      </>
                    )}
                  </div>
                </div>

                <span
                  className={`${styles.status} ${statusClass(
                    item.status,
                  )}`}
                >
                  {item.status}
                </span>
              </div>

              <div
                className={styles.media}
              >
                <MediaPreview
                  kind={item.kind}
                  assetSource={item.assetSource}
                  assetRef={item.assetRef}
                  title={item.title}
                />
              </div>

              <div
                className={
                  styles.cardBody
                }
              >
                <div
                  className={
                    styles.reviewLayout
                  }
                >
                  <div
                    className={
                      styles.details
                    }
                  >
                    <div
                      className={
                        styles.detailRow
                      }
                    >
                      <span
                        className={
                          styles.detailLabel
                        }
                      >
                        Property
                      </span>

                      <span>
                        {item.property}
                      </span>
                    </div>

                    <div
                      className={
                        styles.detailRow
                      }
                    >
                      <span
                        className={
                          styles.detailLabel
                        }
                      >
                        Asset
                      </span>

                      <span>
                        {item.kind ===
                        "video"
                          ? "Motion video"
                          : "Image"}
                      </span>
                    </div>

                    <div
                      className={
                        styles.detailRow
                      }
                    >
                      <span
                        className={
                          styles.detailLabel
                        }
                      >
                        Version
                      </span>

                      <span>
                        V{item.version}
                      </span>
                    </div>
                  </div>

                  <aside
                    className={
                      styles.feedbackPanel
                    }
                  >
                    {item.status ===
                    "Awaiting review" ? (
                      <>
                        <h3>
                          Feedback for Devon
                        </h3>

                        <textarea
                          className={
                            styles.textarea
                          }
                          value={
                            feedback[
                              item.id
                            ] || ""
                          }
                          placeholder="Only required when requesting a revision or a new direction."
                          onChange={(
                            event,
                          ) =>
                            setFeedback(
                              (
                                current,
                              ) => ({
                                ...current,
                                [item.id]:
                                  event
                                    .target
                                    .value,
                              }),
                            )
                          }
                        />

                        <div
                          className={
                            styles.actions
                          }
                        >
                          <button
                            className={`${styles.button} ${styles.buttonApprove}`}
                            disabled={processing[item.id]}
                            onClick={() =>
                              submitDecision(
                                item,
                                "Approved",
                              )
                            }
                          >
                            <Check size={15} strokeWidth={2.5} />
                            {processing[item.id] ? "Saving…" : "Approve"}
                          </button>

                          <button
                            className={`${styles.button} ${styles.buttonRevision}`}
                            disabled={processing[item.id]}
                            onClick={() =>
                              submitDecision(
                                item,
                                "Revision requested",
                              )
                            }
                          >
                            <PenLine size={15} strokeWidth={2.5} />
                            Request revision
                          </button>

                          <button
                            className={`${styles.button} ${styles.buttonDirection}`}
                            disabled={processing[item.id]}
                            onClick={() =>
                              submitDecision(
                                item,
                                "New direction requested",
                              )
                            }
                          >
                            <Compass size={15} strokeWidth={2.5} />
                            New direction
                          </button>
                        </div>

                        {errors[item.id] && (
                          <p
                            className={
                              styles.notice
                            }
                          >
                            {
                              errors[
                                item.id
                              ]
                            }
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <h3>
                          Latest decision
                        </h3>

                        <p
                          className={
                            styles.feedbackText
                          }
                        >
                          {item.clientFeedback ||
                            (item.status ===
                            "Approved"
                              ? "Approved as submitted."
                              : "Waiting for Devon to submit another version.")}
                        </p>

                        {item.decisionAt && (
                          <p
                            className={
                              styles.help
                            }
                          >
                            By{" "}
                            {item.decisionBy ||
                              "Emma"}
                            {" · "}
                            {new Date(
                              item.decisionAt,
                            ).toLocaleString()}
                          </p>
                        )}

                        {item.status === "Approved" && (
                          <>
                            <button
                              className={`${styles.button} ${styles.buttonDownload}`}
                              style={{ marginTop: 14, width: "100%" }}
                              disabled={downloading[item.id]}
                              onClick={() => handleManualDownload(item)}
                            >
                              <Download size={15} strokeWidth={2.5} />
                              {downloading[item.id] ? "Preparing download…" : "Download approved asset"}
                            </button>

                            {downloadNotice[item.id] && (
                              <p className={styles.help} style={{ marginTop: 8 }}>
                                {downloadNotice[item.id]}
                              </p>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </aside>
                </div>

                <details
                  className={
                    styles.history
                  }
                >
                  <summary>
                    Version history
                  </summary>

                  <div
                    className={
                      styles.historyList
                    }
                  >
                    {[...item.history]
                      .reverse()
                      .map((entry) => (
                        <div
                          key={entry.id}
                          className={
                            styles.historyEntry
                          }
                        >
                          <strong>
                            {entry.by}:
                          </strong>{" "}
                          {entry.message}
                          <br />
                          <small>
                            {new Date(
                              entry.createdAt,
                            ).toLocaleString()}
                          </small>
                        </div>
                      ))}
                  </div>
                </details>
              </div>
            </article>
          ))}

          {visibleItems.length === 0 && (
            <div
              className={styles.empty}
            >
              No creative items match this
              view.
            </div>
          )}
        </div>
      </main>

      <ChatPanel currentUser="Emma" organizationId={selectedOrgId || undefined} />
    </div>
  );
}
