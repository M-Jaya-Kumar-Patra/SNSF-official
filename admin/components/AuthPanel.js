"use client";

import Image from "next/image";

export default function AuthPanel({ title, subtitle, children, footer }) {
  return (
    <main className="auth-light flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f8fafc,#eef2ff_52%,#f8fafc)] px-4 py-10 text-slate-950">
      <section className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
        <div className="border-b border-slate-100 px-7 pb-5 pt-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 shadow-lg shadow-slate-900/20">
            <Image
              src="/images/logo.png"
              alt="SNSF Logo"
              width={52}
              height={52}
              className="rounded-full object-contain"
              priority
            />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
            SNSF Admin
          </p>
          <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
          {subtitle && <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>}
        </div>

        <div className="px-7 py-6">{children}</div>

        {footer && (
          <div className="border-t border-slate-100 bg-slate-50 px-7 py-4 text-center text-sm text-slate-600">
            {footer}
          </div>
        )}
      </section>
    </main>
  );
}
