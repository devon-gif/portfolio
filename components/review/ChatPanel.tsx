"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  listMessages,
  sendMessage,
  subscribeToChanges,
  type ChatMessageRecord,
} from "@/lib/review";

import styles from "./SimpleReview.module.css";

type ChatUser = "Devon" | "Emma";

export default function ChatPanel({
  currentUser,
  organizationId,
}: {
  currentUser: ChatUser;
  organizationId?: string;
}) {
  const [open, setOpen] =
    useState(false);

  const [messages, setMessages] =
    useState<ChatMessageRecord[]>([]);

  const [message, setMessage] =
    useState("");

  const listRef =
    useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => {
    listMessages({ organizationId }).then(setMessages).catch(() => {
      /* keep showing whatever we already have rather than clearing it */
    });
  }, [organizationId]);

  useEffect(() => {
    refresh();
    return subscribeToChanges(organizationId, refresh);
  }, [refresh, organizationId]);

  useEffect(() => {
    if (!open) {
      return;
    }

    requestAnimationFrame(() => {
      if (listRef.current) {
        listRef.current.scrollTop =
          listRef.current.scrollHeight;
      }
    });
  }, [messages, open]);

  async function submitMessage(
    event: FormEvent,
  ) {
    event.preventDefault();

    const body = message.trim();

    if (!body) {
      return;
    }

    setMessage("");

    try {
      await sendMessage({
        organizationId,
        senderName: currentUser,
        body,
      });
      refresh();
    } catch (error) {
      console.error(error);
      window.alert(
        "This message could not be sent. Please try again.",
      );
      setMessage(body);
    }
  }

  return (
    <>
      <button
        className={
          styles.chatLauncher
        }
        type="button"
        onClick={() =>
          setOpen((current) =>
            !current,
          )
        }
      >
        <span
          className={
            styles.chatLauncherIcon
          }
        >
          ◌
        </span>

        <span>Messages</span>

        <span
          className={
            styles.chatMessageCount
          }
        >
          {messages.length}
        </span>
      </button>

      {open && (
        <aside
          className={styles.chatPanel}
        >
          <header
            className={
              styles.chatHeader
            }
          >
            <div>
              <strong>
                Devon + Emma
              </strong>

              <span>
                Creative collaboration
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                setOpen(false)
              }
              aria-label="Close messages"
            >
              ×
            </button>
          </header>

          <div
            ref={listRef}
            className={
              styles.chatMessages
            }
          >
            {messages.map(
              (entry) => {
                const mine =
                  entry.sender ===
                  currentUser;

                return (
                  <div
                    key={entry.id}
                    className={`${styles.chatMessageRow} ${
                      mine
                        ? styles.chatMessageRowMine
                        : ""
                    }`}
                  >
                    <div
                      className={`${styles.chatBubble} ${
                        mine
                          ? styles.chatBubbleMine
                          : ""
                      }`}
                    >
                      <strong>
                        {entry.sender}
                      </strong>

                      <p>
                        {entry.body}
                      </p>

                      <time>
                        {new Date(
                          entry.createdAt,
                        ).toLocaleString(
                          [],
                          {
                            month:
                              "short",
                            day: "numeric",
                            hour:
                              "numeric",
                            minute:
                              "2-digit",
                          },
                        )}
                      </time>
                    </div>
                  </div>
                );
              },
            )}
          </div>

          <form
            className={
              styles.chatComposer
            }
            onSubmit={submitMessage}
          >
            <textarea
              value={message}
              placeholder={`Message ${
                currentUser === "Devon"
                  ? "Emma"
                  : "Devon"
              }…`}
              onChange={(event) =>
                setMessage(
                  event.target.value,
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                    "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();

                  event.currentTarget
                    .form?.requestSubmit();
                }
              }}
            />

            <button type="submit">
              Send
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
