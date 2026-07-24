"use client";

export type ReviewStatus =
  | "Draft"
  | "Awaiting review"
  | "Revision requested"
  | "New direction requested"
  | "Approved"
  | "Archived";

export type MediaKind =
  | "image"
  | "video";

export type HistoryEntry = {
  id: string;
  by: string;
  message: string;
  createdAt: string;
};

export type ReviewItem = {
  id: string;
  property: string;
  title: string;
  kind: MediaKind;
  assetUrl: string;
  assetBlobId?: string;
  assetName?: string;
  assetSize?: number;
  version: number;
  status: ReviewStatus;
  dueDate: string;
  clientFeedback: string;
  internalNote: string;
  decisionBy: string;
  decisionAt: string;
  createdAt: string;
  updatedAt: string;
  history: HistoryEntry[];
};

export type ReviewState = {
  items: ReviewItem[];
};

export const REVIEW_STORE_KEY =
  "archer-review-simple-v1";

function id() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

export function createId() {
  return id();
}

export function getSeedReviewState(): ReviewState {
  const createdAt =
    "2026-07-16T18:00:00.000Z";

  return {
    items: [
      {
        id: "demo-lone-star",
        property: "Lone Star Court",
        title: "Property arrival motion",
        kind: "video",
        assetUrl:
          "/archer-preview/motion/pendry-hotel-entrance-night.mp4",
        version: 1,
        status: "Awaiting review",
        dueDate: "2026-07-25",
        clientFeedback: "",
        internalNote:
          "Initial motion concept for client review.",
        decisionBy: "",
        decisionAt: "",
        createdAt,
        updatedAt: createdAt,
        history: [
          {
            id: "history-1",
            by: "Devon",
            message:
              "Version 1 submitted for review.",
            createdAt,
          },
        ],
      },
      {
        id: "demo-george",
        property: "The George",
        title: "Exterior architectural motion",
        kind: "video",
        assetUrl:
          "/valencia/media/george-exterior.mp4",
        version: 1,
        status: "Awaiting review",
        dueDate: "2026-07-27",
        clientFeedback: "",
        internalNote:
          "Exterior movement and lighting treatment.",
        decisionBy: "",
        decisionAt: "",
        createdAt,
        updatedAt: createdAt,
        history: [
          {
            id: "history-2",
            by: "Devon",
            message:
              "Version 1 submitted for review.",
            createdAt,
          },
        ],
      },
      {
        id: "demo-property",
        property: "Portfolio",
        title: "Property showcase motion",
        kind: "video",
        assetUrl:
          "/lark/media/03-property/property.mp4",
        version: 1,
        status: "Draft",
        dueDate: "2026-07-30",
        clientFeedback: "",
        internalNote:
          "Draft asset not yet sent to Emma.",
        decisionBy: "",
        decisionAt: "",
        createdAt,
        updatedAt: createdAt,
        history: [
          {
            id: "history-3",
            by: "Devon",
            message:
              "Draft created.",
            createdAt,
          },
        ],
      },
    ],
  };
}

function cloneState(
  state: ReviewState,
): ReviewState {
  return JSON.parse(
    JSON.stringify(state),
  ) as ReviewState;
}

export function loadReviewState(): ReviewState {
  if (typeof window === "undefined") {
    return getSeedReviewState();
  }

  try {
    const stored =
      window.localStorage.getItem(
        REVIEW_STORE_KEY,
      );

    if (!stored) {
      const seed =
        getSeedReviewState();

      window.localStorage.setItem(
        REVIEW_STORE_KEY,
        JSON.stringify(seed),
      );

      return seed;
    }

    const parsed =
      JSON.parse(stored) as ReviewState;

    if (!Array.isArray(parsed.items)) {
      throw new Error(
        "Invalid review store",
      );
    }

    return parsed;
  } catch {
    return getSeedReviewState();
  }
}

export function saveReviewState(
  state: ReviewState,
) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    REVIEW_STORE_KEY,
    JSON.stringify(state),
  );

  window.dispatchEvent(
    new CustomEvent(
      "archer-review-updated",
    ),
  );
}

export function mutateReviewState(
  mutator: (
    draft: ReviewState,
  ) => void,
) {
  const draft = cloneState(
    loadReviewState(),
  );

  mutator(draft);
  saveReviewState(draft);

  return draft;
}

export function resetReviewState() {
  const seed =
    getSeedReviewState();

  saveReviewState(seed);

  return seed;
}

export function subscribeReviewState(
  listener: (
    state: ReviewState,
  ) => void,
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const update = () => {
    listener(loadReviewState());
  };

  const storage = (
    event: StorageEvent,
  ) => {
    if (
      event.key ===
      REVIEW_STORE_KEY
    ) {
      update();
    }
  };

  window.addEventListener(
    "archer-review-updated",
    update,
  );

  window.addEventListener(
    "storage",
    storage,
  );

  return () => {
    window.removeEventListener(
      "archer-review-updated",
      update,
    );

    window.removeEventListener(
      "storage",
      storage,
    );
  };
}
