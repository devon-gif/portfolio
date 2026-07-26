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
  defaultWorkspaceScope,
  downloadApprovedAsset,
  isReviewSupabaseConfigured,
  listOrganizations,
  listProperties,
  listReviewItems,
  resetLocalDemo,
  resolveScopeOrganization,
  sendToReview,
  subscribeToScope,
  uploadNewVersion,
  type OrganizationRecord,
  type PropertyRecord,
  type ReviewItemRecord,
  type ReviewStatus,
} from "@/lib/review";

import ChatPanel from "./ChatPanel";
import MediaDropzone from "./MediaDropzone";
import MediaPreview from "./MediaPreview";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { useWorkspaceScope } from "./useWorkspaceScope";

import styles from "./SimpleReview.module.css";

const ADMIN_SESSION_KEY =
  "archer-review-devon-demo";

const WORKSPACE_STORAGE_KEY = "archer-review-admin-workspace";

const VALENCIA_LOGO_SRC = "/review/valencia-hotel-collection-logo.jpeg";

// Per-organization branding for the admin header. Keyed by slug so the same
// entry covers the real Valencia organization and the local demo stand-in.
// An organization with no entry here — and the cross-client All Workspaces
// view, which belongs to no single client — falls back to the Archer Design
// monogram rather than flying another client's logo.
const ORGANIZATION_LOGOS: Record<string, { src: string; alt: string }> = {
  "valencia-hotel-group": { src: VALENCIA_LOGO_SRC, alt: "Valencia Hotel Collection" },
  "local-demo": { src: VALENCIA_LOGO_SRC, alt: "Valencia Hotel Collection" },
};

type AdminFilter =
  | "All"
  | ReviewStatus;

// "All", or a property id. Previously this held a property NAME, which was
// safe only while every property belonged to one client — across
// organizations two properties can share a name and a name-keyed filter would
// silently show both.
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

  const { scope: storedScope, selectScope } =
    useWorkspaceScope(WORKSPACE_STORAGE_KEY);

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

  // The workspace actually in view. `storedScope` is null until the URL /
  // localStorage read completes and whenever no preference has ever been
  // expressed, in which case defaultWorkspaceScope() drops a single-client
  // admin straight into their one organization — exactly where this screen
  // landed before there was more than one client to choose from.
  const scope = useMemo(
    () => storedScope ?? defaultWorkspaceScope(organizations),
    [storedScope, organizations],
  );

  // null for All Workspaces, and also for a scope whose organization no
  // longer resolves (stale bookmark, revoked access). Both mean "don't
  // constrain the query" — RLS, not this component, decides what comes back.
  const scopeOrganization = useMemo(
    () => resolveScopeOrganization(scope, organizations),
    [scope, organizations],
  );

  const activeOrgId = scopeOrganization?.id ?? "";

  const loadItems = useCallback(() => {
    listReviewItems({ organizationId: activeOrgId || undefined })
      .then(setItems)
      .catch((error) => console.error("Failed to load review items:", error));
  }, [activeOrgId]);

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

  // Guarded on `ready` rather than on a selected organization, because an
  // empty activeOrgId is now a legitimate state — All Workspaces — and not
  // just "nothing chosen yet". Passing undefined asks for every property /
  // item the signed-in user can reach.
  useEffect(() => {
    if (!ready) return;
    let active = true;
    listProperties(activeOrgId || undefined)
      .then((props) => {
        if (active) setProperties(props);
      })
      .catch((error) => console.error("Failed to load properties:", error));
    return () => {
      active = false;
    };
  }, [ready, activeOrgId]);

  useEffect(() => {
    if (!ready) return;
    loadItems();
    // Subscribe to the one organization in view, or to all of them when the
    // queue spans every workspace.
    return subscribeToScope(
      activeOrgId ? [activeOrgId] : organizations.map((organization) => organization.id),
      loadItems,
    );
  }, [ready, activeOrgId, organizations, loadItems]);

  // A property filter set in one workspace is meaningless in another. Derived
  // rather than reset in an effect: the switcher already clears the filter on
  // every workspace change, so this only has to cover the window where the
  // property list has reloaded and no longer contains the filtered id.
  const activePropertyFilter: PropertyFilter =
    propertyFilter === "All" || properties.some((property) => property.id === propertyFilter)
      ? propertyFilter
      : "All";

  const organizationNames = useMemo(
    () => new Map(organizations.map((organization) => [organization.id, organization.name] as const)),
    [organizations],
  );

  // Only worth labelling which client an item belongs to when the queue can
  // actually contain more than one.
  const showOrganizationLabels = scope.kind === "all" && organizations.length > 1;

  const propertiesByOrganization = useMemo(() => {
    const grouped = new Map<string, PropertyRecord[]>();
    for (const property of properties) {
      const group = grouped.get(property.organizationId);
      if (group) group.push(property);
      else grouped.set(property.organizationId, [property]);
    }
    return Array.from(grouped.entries());
  }, [properties]);

  const workspaceLabel = scopeOrganization?.name ?? "All workspaces";

  const scopeLogo = scopeOrganization
    ? ORGANIZATION_LOGOS[(scopeOrganization.slug ?? "").toLowerCase()] ?? null
    : null;

  // Chat is a per-organization thread, so it only has a well-defined subject
  // inside a single workspace. In All Workspaces there is no one client to be
  // talking to, and passing no organization would quietly fall through to the
  // local demo thread (see listMessages in lib/review/index.ts), so the panel
  // is left out entirely rather than shown against the wrong conversation.
  const chatOrganizationId = activeOrgId || "";

  const visibleItems = useMemo(
    () =>
      items.filter((item) => {
        if (filter !== "All" && item.status !== filter) return false;
        if (activePropertyFilter !== "All" && item.propertyId !== activePropertyFilter) return false;
        return true;
      }),
    [filter, activePropertyFilter, items],
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
        // Taken from the property rather than from the workspace scope: in
        // All Workspaces there is no single organization in view, and even
        // within one workspace the property is the authoritative owner.
        organizationId: property.organizationId,
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
            {scopeLogo ? (
              <img className={styles.brandLogo} src={scopeLogo.src} alt={scopeLogo.alt} />
            ) : (
              <span className={styles.brandMonogram} aria-hidden="true">
                AD
              </span>
            )}
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
              {workspaceLabel}
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

        <WorkspaceSwitcher
          organizations={organizations}
          scope={scope}
          onSelect={(next) => {
            selectScope(next);
            setPropertyFilter("All");
            setForm((current) => ({ ...current, propertyId: "" }));
          }}
        />

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

                {showOrganizationLabels
                  ? // Across workspaces, group by client so two similarly
                    // named properties are never ambiguous. The chosen
                    // property is what decides the new item's organization.
                    propertiesByOrganization.map(
                      ([organizationId, group]) => (
                        <optgroup
                          key={organizationId}
                          label={
                            organizationNames.get(organizationId) ??
                            "Other"
                          }
                        >
                          {group.map((property) => (
                            <option
                              key={property.id}
                              value={property.id}
                            >
                              {property.name}
                            </option>
                          ))}
                        </optgroup>
                      ),
                    )
                  : properties.map(
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
          <div className={styles.tabs} role="group" aria-label="Property">
            <button
              className={`${styles.tab} ${
                activePropertyFilter === "All" ? styles.tabActive : ""
              }`}
              aria-pressed={activePropertyFilter === "All"}
              onClick={() => setPropertyFilter("All")}
            >
              All properties
            </button>
            {properties.map((property) => (
              <button
                key={property.id}
                className={`${styles.tab} ${
                  activePropertyFilter === property.id ? styles.tabActive : ""
                }`}
                aria-pressed={activePropertyFilter === property.id}
                onClick={() => setPropertyFilter(property.id)}
              >
                {showOrganizationLabels && (
                  <span className={styles.tabQualifier}>
                    {organizationNames.get(property.organizationId) ?? "Other"}
                    {" · "}
                  </span>
                )}
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
                      {showOrganizationLabels && (
                        <>
                          <span className={styles.orgBadge}>
                            {item.organizationName ||
                              organizationNames.get(item.organizationId) ||
                              "Unknown client"}
                          </span>
                          {" · "}
                        </>
                      )}
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

      {chatOrganizationId && (
        <ChatPanel currentUser="Devon" organizationId={chatOrganizationId} />
      )}
    </div>
  );
}
