"use client";

const DATABASE_NAME =
  "archer-review-local-media";

const DATABASE_VERSION = 1;
const STORE_NAME = "media";

export type StoredReviewMedia = {
  id: string;
  blob: Blob;
  name: string;
  type: string;
  size: number;
  createdAt: string;
};

function createMediaId() {
  return `media-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function openMediaDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      DATABASE_NAME,
      DATABASE_VERSION,
    );

    request.onerror = () => {
      reject(
        request.error ||
          new Error(
            "Unable to open local media storage.",
          ),
      );
    };

    request.onupgradeneeded = () => {
      const database = request.result;

      if (
        !database.objectStoreNames.contains(
          STORE_NAME,
        )
      ) {
        database.createObjectStore(
          STORE_NAME,
          {
            keyPath: "id",
          },
        );
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

export async function saveReviewMedia(
  file: File,
): Promise<string> {
  const database =
    await openMediaDatabase();

  const id = createMediaId();

  const record: StoredReviewMedia = {
    id,
    blob: file,
    name: file.name,
    type: file.type,
    size: file.size,
    createdAt: new Date().toISOString(),
  };

  await new Promise<void>(
    (resolve, reject) => {
      const transaction =
        database.transaction(
          STORE_NAME,
          "readwrite",
        );

      const store =
        transaction.objectStore(
          STORE_NAME,
        );

      store.put(record);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(
          transaction.error ||
            new Error(
              "Unable to save the uploaded file.",
            ),
        );
      };
    },
  );

  database.close();

  return id;
}

export async function getReviewMedia(
  id: string,
): Promise<StoredReviewMedia | null> {
  if (!id) {
    return null;
  }

  const database =
    await openMediaDatabase();

  const record =
    await new Promise<
      StoredReviewMedia | undefined
    >((resolve, reject) => {
      const transaction =
        database.transaction(
          STORE_NAME,
          "readonly",
        );

      const request =
        transaction
          .objectStore(STORE_NAME)
          .get(id);

      request.onsuccess = () => {
        resolve(
          request.result as
            | StoredReviewMedia
            | undefined,
        );
      };

      request.onerror = () => {
        reject(
          request.error ||
            new Error(
              "Unable to read the uploaded file.",
            ),
        );
      };
    });

  database.close();

  return record || null;
}

export async function deleteReviewMedia(
  id: string,
) {
  if (!id) {
    return;
  }

  const database =
    await openMediaDatabase();

  await new Promise<void>(
    (resolve, reject) => {
      const transaction =
        database.transaction(
          STORE_NAME,
          "readwrite",
        );

      transaction
        .objectStore(STORE_NAME)
        .delete(id);

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        reject(
          transaction.error ||
            new Error(
              "Unable to delete the uploaded file.",
            ),
        );
      };
    },
  );

  database.close();
}
