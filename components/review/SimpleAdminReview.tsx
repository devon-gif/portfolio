"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Archive, Download, SendHorizonal, UploadCloud } from "lucide-react";

import { supabase } from "@/lib/supabase";
import {
  archiveItem,
  createDraftItem,
  downloadApprovedAsset,
  isReviewSupabaseConfigured,
  listOrganizations,
  listProperties,
  listReviewItems,
  resetLocalDemo,
  sendToReview,
  subscribeToChanges,
  uploadNewVersion,
  type OrganizationRecord,
  type PropertyRecord,
  type ReviewItemRecord,
  type ReviewStatus,
} from "@/lib/review";

import ChatPanel from "./ChatPanel";
import MediaDropzone from "./MediaDropzone";
import MediaPreview from "./MediaPreview";

import styles from "./SimpleReview.module.css";

const ADMIN_SESSION_KEY =
  "archer-review-devon-demo";

const VALENCIA_LOGO_SRC = "/review/valencia-hotel-collection-logo.jpeg";

type AdminFilter =
  | "All"
  | ReviewStatus;

type PropertyFilter = "All" | string;

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

export default function SimpleAdminReview() {
  const [items, setItems] =
    useState<ReviewItemRecord[]>([]);

  const [organizations, setOrganizations] =
    useState<OrganizationRecord[]>([]);

  const [selectedOrgId, setSelectedOrgId] =
    useState<string>("");

  const [properties, setProperties] =
    useState<PropertyRecord[]>([]);

  const [ready, setReady] =
    useState(false);

  const [signedIn, setSignedIn] =
    useState(false);

  const [filter, setFilter] =
    useState<AdminFilter>("All");

  const [propertyFilter, setPropertyFilter] =
    useState<PropertyFilter>("All");

  const [creating, setCreating] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [
    replacementFiles,
    setReplacementFiles,
  ] = useState<
    Record<string, File | null>
  >({});

  const [
    replacementNotes,
    setReplacementNotes,
  ] = useState<
    Record<string, string>
  >({});

  const [form, setForm] =
    useState({
      propertyId: "",
      title: "",
      dueDate: "",
      description: "",
    });

  // Disables a given item's "Download approved asset" button while a
  // download is in flight, and drives its "Preparing download…" copy.
  const [downloading, setDownloading] =
    useState<Record<string, boolean>>({});

  // A short-lived per-item status line ("Download started." / an inline
  // failure message) shown under the download button — never an alert(),
  // and never anything that navigates the page.
  const [downloadNotice, setDownloadNotice] =
    useState<Record<string, string>>({});

  const supabaseMode = isReviewSupabaseConfigured();

  async function handleDownload(item: ReviewItemRecord) {
    if (downloading[item.id]) {
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

  const loadItems = useCallback(() => {
    listReviewItems({ organizationId: selectedOrgId || undefined })
      .then(setItems)
      .catch((error) => console.error("Failed to load review items:", error));
  }, [selectedOrgId]);

  // Local demo session gate (Supabase mode uses real auth instead — see
  // app/review/admin/page.tsx, which wraps this component in an admin-only
  // guard once Supabase is configured. This fallback gate only matters when
  // Supabase isn't configured at all.)
  useEffect(() => {
    // Deferred via queueMicrotask (rather than setState directly in the
    // effect body) to avoid a cascading-render lint warning — see the
    // identical pattern used for GeorgeSlideshow.tsx earlier in this project.
    if (supabaseMode) {
      queueMicrotask(() => setSignedIn(true));
      return;
    }
    const local = window.localStorage.getItem(ADMIN_SESSION_KEY) === "true";
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
      items.filter((item) => {
        if (filter !== "All" && item.status !== filter) return false;
        if (propertyFilter !== "All" && item.property !== propertyFilter) return false;
        return true;
      }),
    [filter, propertyFilter, items],
  );

  const counts = {
    draft: items.filter((item) => item.status === "Draft").length,
    awaiting: items.filter((item) => item.status === "Awaiting review").length,
    changes: items.filter(
      (item) =>
        item.status === "Revision requested" ||
        item.status === "New direction requested",
    ).length,
    approved: items.filter((item) => item.status === "Approved").length,
  };

  async function createItem(
    event: FormEvent,
  ) {
    event.preventDefault();

    if (!selectedFile) {
      window.alert(
        "Please select or drop an image or video.",
      );
      return;
    }

    const property = properties.find((p) => p.id === form.propertyId);
    if (!property) {
      window.alert("Please select a property.");
      return;
    }

    try {
      setCreating(true);

      await createDraftItem({
        organizationId: selectedOrgId,
        propertyId: property.id,
        property: property.name,
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate,
        file: selectedFile,
      });

      loadItems();

      setForm({
        propertyId: "",
        title: "",
        dueDate: "",
        description: "",
      });

      setSelectedFile(null);
    } catch (error) {
      console.error(error);

      window.alert(
        "The file could not be stored. Very large raw files should stay in Google Drive; upload a compressed review MP4 or JPG here.",
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleSendToReview(
    item: ReviewItemRecord,
  ) {
    try {
      await sendToReview(item.id);
      loadItems();
    } catch (error) {
      console.error(error);
      window.alert("This item could not be sent for review.");
    }
  }

  async function submitNewVersion(
    item: ReviewItemRecord,
  ) {
    const file =
      replacementFiles[
        item.id
      ];

    if (!file) {
      window.alert(
        "Drop or choose the revised image or video first.",
      );
      return;
    }

    try {
      await uploadNewVersion(item.id, file, replacementNotes[item.id]?.trim() || "", {
        organizationId: item.organizationId,
        propertyId: item.propertyId,
        nextVersion: item.version + 1,
      });

      loadItems();

      setReplacementFiles((current) => ({ ...current, [item.id]: null }));
      setReplacementNotes((current) => ({ ...current, [item.id]: "" }));
    } catch (error) {
      console.error(error);
      window.alert("The revised file could not be saved.");
    }
  }

  async function handleArchive(
    item: ReviewItemRecord,
  ) {
    try {
      await archiveItem(item.id);
      loadItems();
    } catch (error) {
      console.error(error);
      window.alert("This item could not be archived.");
    }
  }

  if (!ready) {
    return null;
  }

  if (!signedIn) {
    return (
      <main className={styles.login}>
        <section
          className={
            styles.loginCard
          }
        >
          <div className={styles.loginLogo}>
            <img src={VALENCIA_LOGO_SRC} alt="Valencia Hotel Collection" />
          </div>

          <h1>Archer Admin</h1>

          <p>
            Upload motion assets,
            send them to Emma and
            manage requested changes.
          </p>

          <button
            className={`${styles.button} ${styles.buttonDark}`}
            onClick={() => {
              window.localStorage.setItem(
                ADMIN_SESSION_KEY,
                "true",
              );

              setSignedIn(true);
            }}
          >
            Continue as Devon
          </button>
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
              Archer Review Admin
            </h1>

            <span
              className={
                styles.brandSub
              }
            >
              Creative production
              workspace
            </span>
          </div>
        </div>

        <div
          className={
            styles.headerActions
          }
        >
          <a
            className={styles.link}
            href="/emma"
            target="_blank"
          >
            Open Emma’s view
          </a>

          <div
            className={styles.user
            }
          >
            <span
              className={
                styles.userName
              }
            >
              Devon Archer
            </span>

            <span
              className={
                styles.userRole
              }
            >
              Creative administrator
            </span>
          </div>

          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={async () => {
              if (supabaseMode) {
                await supabase.auth.signOut();
                window.location.reload();
                return;
              }
              window.localStorage.removeItem(
                ADMIN_SESSION_KEY,
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
              Creative production queue
            </h1>

            <p>
              Upload new motion assets,
              send them for approval and
              respond to Emma’s feedback.
            </p>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>
                {counts.draft}
              </strong>
              <span>Draft</span>
            </div>

            <div className={styles.stat}>
              <strong>
                {counts.awaiting}
              </strong>
              <span>Review</span>
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

        {organizations.length > 1 && (
          <div className={styles.field} style={{ maxWidth: 320, marginBottom: 18 }}>
            <label>Organization</label>
            <select
              className={styles.select}
              value={selectedOrgId}
              onChange={(event) => {
                setSelectedOrgId(event.target.value);
                setPropertyFilter("All");
                setForm((current) => ({ ...current, propertyId: "" }));
              }}
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <form
          className={styles.formCard}
          onSubmit={createItem}
        >
          <h2>
            Upload a creative asset
          </h2>

          <div
            className={
              styles.formGrid
            }
          >
            <div
              className={styles.field}
            >
              <label>Property</label>

              <select
                className={
                  styles.select
                }
                required
                value={form.propertyId}
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      propertyId:
                        event.target.value,
                    }),
                  )
                }
              >
                <option value="" disabled>
                  Select a property
                </option>

                {properties.map(
                  (property) => (
                    <option
                      key={property.id}
                      value={property.id}
                    >
                      {property.name}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div
              className={styles.field}
            >
              <label>Asset title</label>

              <input
                className={
                  styles.input
                }
                required
                value={form.title}
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      title:
                        event.target
                          .value,
                    }),
                  )
                }
                placeholder="Poolside summer motion"
              />
            </div>

            {!supabaseMode && (
              <div
                className={styles.field}
              >
                <label>
                  Feedback due date
                </label>

                <input
                  className={
                    styles.input
                  }
                  type="date"
                  value={form.dueDate}
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        dueDate:
                          event.target
                            .value,
                      }),
                    )
                  }
                />
              </div>
            )}

            <div
              className={styles.field}
            >
              <label>
                Production note
              </label>

              <input
                className={
                  styles.input
                }
                value={
                  form.description
                }
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      description:
                        event.target
                          .value,
                    }),
                  )
                }
                placeholder="Optional internal note"
              />
            </div>

            <div
              className={`${styles.field} ${styles.fieldFull}`}
            >
              <label>
                Image or motion file
              </label>

              <MediaDropzone
                file={selectedFile}
                onFileChange={
                  setSelectedFile
                }
              />
            </div>
          </div>

          <p className={styles.help}>
            Upload a compressed JPG, PNG,
            WebP, MP4 or WebM review file.
            Keep original high-resolution
            photography and raw footage in
            Google Drive.
          </p>

          <button
            className={`${styles.button} ${styles.buttonDark}`}
            type="submit"
            disabled={creating}
          >
            {creating
              ? "Saving file…"
              : "Create draft"}
          </button>
        </form>

        <div className={styles.tabs}>
          {[
            "All",
            "Draft",
            "Awaiting review",
            "Revision requested",
            "New direction requested",
            "Approved",
            "Archived",
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
                  option as AdminFilter,
                )
              }
            >
              {option}
            </button>
          ))}
        </div>

        {properties.length > 0 && (
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
          {visibleItems.map(
            (item) => (
              <article
                key={item.id}
                className={
                  styles.card
                }
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
                      Version{" "}
                      {item.version}
                      {" · "}
                      {item.assetName ||
                        item.kind}
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
                  className={
                    styles.adminCardBody
                  }
                >
                  <div>
                    <div
                      className={
                        styles.media
                      }
                    >
                      <MediaPreview
                        kind={
                          item.kind
                        }
                        assetSource={
                          item.assetSource
                        }
                        assetRef={
                          item.assetRef
                        }
                        title={
                          item.title
                        }
                      />
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
                        {[
                          ...item.history,
                        ]
                          .reverse()
                          .map(
                            (entry) => (
                              <div
                                key={
                                  entry.id
                                }
                                className={
                                  styles.historyEntry
                                }
                              >
                                <strong>
                                  {
                                    entry.by
                                  }
                                  :
                                </strong>{" "}
                                {
                                  entry.message
                                }
                                <br />
                                <small>
                                  {new Date(
                                    entry.createdAt,
                                  ).toLocaleString()}
                                </small>
                              </div>
                            ),
                          )}
                      </div>
                    </details>
                  </div>

                  <aside
                    className={
                      styles.adminControls
                    }
                  >
                    <div
                      className={
                        styles.feedbackPanel
                      }
                    >
                      <h3>
                        Emma’s feedback
                      </h3>

                      <p
                        className={
                          styles.feedbackText
                        }
                      >
                        {item.clientFeedback ||
                          "No client feedback yet."}
                      </p>
                    </div>

                    {item.status ===
                      "Draft" && (
                      <button
                        className={`${styles.button} ${styles.buttonPrimary}`}
                        onClick={() =>
                          handleSendToReview(
                            item,
                          )
                        }
                      >
                        <SendHorizonal size={15} strokeWidth={2.5} />
                        Send to Emma
                      </button>
                    )}

                    {(item.status ===
                      "Revision requested" ||
                      item.status ===
                        "New direction requested") && (
                      <>
                        <div
                          className={
                            styles.field
                          }
                        >
                          <label>
                            Revised file
                          </label>

                          <MediaDropzone
                            compact
                            file={
                              replacementFiles[
                                item.id
                              ] || null
                            }
                            onFileChange={(
                              file,
                            ) =>
                              setReplacementFiles(
                                (
                                  current,
                                ) => ({
                                  ...current,
                                  [item.id]:
                                    file,
                                }),
                              )
                            }
                          />
                        </div>

                        <div
                          className={
                            styles.field
                          }
                        >
                          <label>
                            Version note
                          </label>

                          <textarea
                            className={
                              styles.textarea
                            }
                            value={
                              replacementNotes[
                                item.id
                              ] || ""
                            }
                            onChange={(
                              event,
                            ) =>
                              setReplacementNotes(
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
                            placeholder="Describe what changed."
                          />
                        </div>

                        <button
                          className={`${styles.button} ${styles.buttonPrimary}`}
                          onClick={() =>
                            submitNewVersion(
                              item,
                            )
                          }
                        >
                          <UploadCloud size={15} strokeWidth={2.5} />
                          Submit new version
                        </button>
                      </>
                    )}

                    {item.status ===
                      "Approved" && (
                      <>
                        <button
                          className={`${styles.button} ${styles.buttonDownload}`}
                          disabled={downloading[item.id]}
                          onClick={() => handleDownload(item)}
                        >
                          <Download size={15} strokeWidth={2.5} />
                          {downloading[item.id] ? "Preparing download…" : "Download approved asset"}
                        </button>

                        {downloadNotice[item.id] && (
                          <p className={styles.help}>
                            {downloadNotice[item.id]}
                          </p>
                        )}

                        <button
                          className={`${styles.button} ${styles.buttonSecondary}`}
                          onClick={() =>
                            handleArchive(
                              item,
                            )
                          }
                        >
                          <Archive size={15} strokeWidth={2.5} />
                          Archive approved item
                        </button>
                      </>
                    )}
                  </aside>
                </div>
              </article>
            ),
          )}

          {visibleItems.length === 0 && (
            <div className={styles.empty}>
              No creative items match this view.
            </div>
          )}
        </div>

        {!supabaseMode && (
          <div
            style={{
              marginTop: 30,
              display: "flex",
              justifyContent:
                "flex-end",
            }}
          >
            <button
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={() => {
                if (
                  !window.confirm(
                    "Reset the local demo data?",
                  )
                ) {
                  return;
                }

                resetLocalDemo().then(loadItems);
              }}
            >
              Reset local demo
            </button>
          </div>
        )}
      </main>

      <ChatPanel currentUser="Devon" organizationId={selectedOrgId || undefined} />
    </div>
  );
}
