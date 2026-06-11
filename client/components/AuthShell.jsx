"use client";

import Image from "next/image";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 md:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden bg-slate-950 p-8 text-white md:flex md:flex-col md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="S N Steel Fabrication logo"
                width={58}
                height={58}
                className="rounded-full object-contain"
                priority
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
                  SNSF
                </p>
                <p className="text-lg font-bold">S N Steel Fabrication</p>
              </div>
            </div>

            <div className="mt-16">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
                Client account
              </p>
              <h1 className="max-w-sm text-4xl font-bold leading-tight">
                Manage your saved products and enquiries with ease.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
                Sign in to save favourites, track enquiries, manage addresses, and keep your profile updated.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            {["Wishlist", "Enquiries", "Profile"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="font-semibold">{item}</p>
                <p className="mt-1 text-slate-400">Ready</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-7 text-center md:hidden">
              <Image
                src="/images/logo.png"
                alt="S N Steel Fabrication logo"
                width={64}
                height={64}
                className="mx-auto rounded-full object-contain"
                priority
              />
            </div>

            <div className="mb-7">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
                S N Steel Fabrication
              </p>
              <h2 className="text-3xl font-bold text-slate-950">{title}</h2>
              {subtitle && <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>}
            </div>

            {children}

            {footer && (
              <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-center text-sm text-slate-600">
                {footer}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
