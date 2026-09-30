"use client";

/**
 * The one question Restart has to ask.
 *
 * WHY THIS EXISTS, AND WHY IT IS NARROW
 *
 * Restart clears the conversation: the scenes opened AND the note the person
 * typed for their brief (`conversationAfterRestart` returns `note: ""`). The
 * scenes are recoverable — walk them again. The words are not.
 *
 * So this asks only when there is something unrecoverable to lose. A
 * confirmation that fires every time is clicked through within a day and
 * protects nothing afterwards; the caller checks the note first and restarts
 * silently when it is empty, which is the common case.
 *
 * It is deliberately not a generic <Confirm>: one question, one wording, one
 * pair of buttons, so the wording stays answerable rather than becoming
 * "Are you sure?".
 */

import { useEffect, useRef } from "react";
import { getMessages } from "../../i18n/messages";
import type { Locale } from "../../i18n/locales";

export function RestartConfirm({
  locale,
  onConfirm,
  onCancel,
}: {
  locale: Locale;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const t = getMessages(locale).ui;
  const panel = useRef<HTMLDivElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);

  /* Keeping is the safe answer, so keeping is the one already under the
     reader's hands. Escape and the backdrop mean the same thing. */
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    cancel.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCancel();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>("button");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      previous?.focus();
    };
  }, [onCancel]);

  return (
    <div className="rd-demo__confirm" onClick={onCancel}>
      <div
        className="rd-demo__confirm-panel"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rd-confirm-title"
        aria-describedby="rd-confirm-body"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="rd-demo__confirm-title" id="rd-confirm-title">
          {t.restartConfirmTitle}
        </h2>
        <p className="rd-demo__confirm-body" id="rd-confirm-body">
          {t.restartConfirmBody}
        </p>
        <div className="rd-demo__confirm-actions">
          <button type="button" className="rd-demo__confirm-keep" ref={cancel} onClick={onCancel}>
            {t.restartConfirmKeep}
          </button>
          <button type="button" className="rd-demo__confirm-discard" onClick={onConfirm}>
            {t.restartConfirmDiscard}
          </button>
        </div>
      </div>
    </div>
  );
}
