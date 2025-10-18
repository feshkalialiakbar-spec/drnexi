'use client'
import React, { useEffect, useRef, useState } from "react";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Optional heading shown at top of modal */
  title?: string;
  /** The main message. If you want custom JSX, use children instead. */
  message?: string;
  /** Optional custom content overrides `message` when provided */
  children?: React.ReactNode;
  /** document direction; defaults to "rtl" */
  dir?: "rtl" | "ltr";
};

const Modal: React.FC<ModalProps> = ({ open, onClose, title = "" , message, children, dir = "rtl" }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      dir={dir}
      aria-hidden={!open}
      aria-modal
      role="dialog"
      className="fixed inset-0 z-[100] flex items-center justify-center"
    >
      {/* Backdrop */}
      <button
        aria-label="بستن"
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black/60",
          // subtle global shadow with low opacity
          "shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]",
          // fade in
          "opacity-0 animate-[fadeIn_200ms_ease-out_forwards]",
        ].join(" ")}
      />

      {/* Modal panel */}
      <div
        ref={dialogRef}
        className={[
          "relative w-[calc(100%-2rem)] max-w-xl",
          "rounded-2xl bg-white p-5 sm:p-6",
          "shadow-2xl ring-1 ring-black/5",
          // transform/opacity animation: pop & slide up
          "opacity-0 translate-y-4 scale-95",
          "animate-[popIn_220ms_cubic-bezier(0.2,0.8,0.2,1)_forwards]",
        ].join(" ")}
      >
        {/* Close (X) button */}
        <button
          onClick={onClose}
          className="absolute top-3 ltr:right-3 rtl:left-3 inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-black/5 active:scale-95 transition"
          aria-label="بستن"
        >
          {/* Inline SVG X icon (no packages) */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* Title */}
        {title ? (
          <h2 className="mb-3 text-xl font-bold tracking-tight text-gray-900 text-center">
            {title}
          </h2>
        ) : null}

        {/* Content */}
        <div className="prose max-w-none prose-p:leading-8 prose-p:my-2 text-gray-700 text-base">
          {children ? (
            children
          ) : message ? (
            <p>{message}</p>
          ) : null}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-[#ff6a6a] to-[#ff8a3d] text-white font-semibold shadow-lg shadow-orange-200/40 hover:opacity-90 active:scale-95 transition"
          >
            متوجه شدم
          </button>
        </div>
      </div>

      {/* Keyframes (scoped via arbitrary selector) */}
      <style jsx>{`
        @keyframes popIn {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// export default Modal;


// import React, { useState } from "react";
// import Modal from "@/components/Modal";

export default function DemoPage() {
  const [open, setOpen] = useState(true);

  const text = `📢 اطلاعیه مهم\n\nبه اطلاع کاربران گرامی می‌رسانیم، با توجه به مشکلات ناشی از قطعی برق در دیتاسنترها و مراکز داده کشور و افزایش ریسک سرورهای داخلی، ناچار به جابجایی زیرساخت‌ها و ارتقای سیستم شده‌ایم.\n\nبه همین دلیل، سامانه در ساعات آینده موقتاً غیرفعال خواهد بود.\n\nاز شکیبایی و همراهی ارزشمند شما سپاسگزاریم. 🙏`;

  return (
    <main className="min-h-screen flex items-center justify-center p-6" dir="rtl">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-xl bg-sky-600 text-white shadow hover:opacity-90"
      >
        نمایش مودال
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="اطلاعیه"
        message={text}
        dir="rtl"
      />
    </main>
  );
}
