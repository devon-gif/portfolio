"use client";

import {
  DragEvent,
  KeyboardEvent,
  useRef,
  useState,
} from "react";

import styles from "./SimpleReview.module.css";

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  }

  const kilobytes = bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  const megabytes =
    kilobytes / 1024;

  if (megabytes < 1024) {
    return `${megabytes.toFixed(1)} MB`;
  }

  return `${(
    megabytes / 1024
  ).toFixed(2)} GB`;
}

export default function MediaDropzone({
  file,
  onFileChange,
  compact = false,
}: {
  file: File | null;
  onFileChange: (
    file: File | null,
  ) => void;
  compact?: boolean;
}) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [dragging, setDragging] =
    useState(false);

  function selectFile(
    selected: File | undefined,
  ) {
    if (!selected) {
      return;
    }

    if (
      !selected.type.startsWith(
        "image/",
      ) &&
      !selected.type.startsWith(
        "video/",
      )
    ) {
      window.alert(
        "Please choose an image or video file.",
      );

      return;
    }

    onFileChange(selected);
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    setDragging(false);

    selectFile(
      event.dataTransfer.files[0],
    );
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
  ) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      inputRef.current?.click();
    }
  }

  return (
    <div>
      <div
        className={`${styles.dropzone} ${
          dragging
            ? styles.dropzoneActive
            : ""
        } ${
          compact
            ? styles.dropzoneCompact
            : ""
        }`}
        role="button"
        tabIndex={0}
        onClick={() =>
          inputRef.current?.click()
        }
        onKeyDown={handleKeyDown}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() =>
          setDragging(false)
        }
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          className={
            styles.hiddenFileInput
          }
          type="file"
          accept="image/*,video/*"
          onChange={(event) => {
            selectFile(
              event.target.files?.[0],
            );

            event.target.value = "";
          }}
        />

        {file ? (
          <div
            className={
              styles.selectedFile
            }
          >
            <div
              className={
                styles.fileIcon
              }
            >
              {file.type.startsWith(
                "video/",
              )
                ? "▶"
                : "▧"}
            </div>

            <div>
              <strong>
                {file.name}
              </strong>

              <span>
                {formatBytes(file.size)}
              </span>
            </div>
          </div>
        ) : (
          <>
            <strong>
              Drop an image or video here
            </strong>

            <span>
              Or click to choose a file
            </span>
          </>
        )}
      </div>

      {file && (
        <button
          className={
            styles.removeFileButton
          }
          type="button"
          onClick={() =>
            onFileChange(null)
          }
        >
          Remove selected file
        </button>
      )}
    </div>
  );
}
