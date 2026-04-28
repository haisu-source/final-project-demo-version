"use client";

import { useState } from "react";
import { CloseIcon, DownloadIcon, QrIcon } from "./icons";

interface Props {
  articleId: string;
  articleTitle: string;
}

export default function QRCode({ articleId, articleTitle }: Props) {
  const [open, setOpen] = useState(false);
  const src = `/api/qrcode/${articleId}`;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-medium text-[var(--ink)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
      >
        <QrIcon size={16} />
        QR Code
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-full p-1 text-[var(--muted)] hover:bg-[var(--muted-bg)]"
              aria-label="Close"
            >
              <CloseIcon size={18} />
            </button>

            <h3 className="font-serif text-lg font-semibold text-[var(--ink)]">
              Scan to read
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">
              {articleTitle}
            </p>

            <div className="mt-4 grid place-items-center rounded-xl bg-[var(--muted-bg)] p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="QR code"
                width={320}
                height={320}
                className="h-72 w-72"
              />
            </div>

            <a
              href={src}
              download={`presshub-${articleId}.png`}
              className="mt-4 flex items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
            >
              <DownloadIcon size={16} />
              Download PNG
            </a>
          </div>
        </div>
      )}
    </>
  );
}
