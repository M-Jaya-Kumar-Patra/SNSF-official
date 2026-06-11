"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AccountPageShell from "@/components/AccountPageShell";
import { useAuth } from "@/app/context/AuthContext";
import { useNotice } from "@/app/context/NotificationContext";
import { trackVisitor } from "@/lib/tracking";

const getStatusIcon = (message = "") => {
  if (message.includes("confirmed")) return "OK";
  if (message.includes("processing")) return "...";
  if (message.includes("delivered")) return "Done";
  if (message.includes("canceled")) return "X";
  if (message.includes("returned")) return "Back";
  if (message.includes("refunded")) return "Rs";
  return "New";
};

const Account = () => {
  const router = useRouter();
  const { isLogin, isCheckingToken, setIsCheckingToken } = useAuth();
  const { notices, getNotifications, markAllUnreadAsRead } = useNotice();

  useEffect(() => {
    if (!isLogin) {
      setIsCheckingToken(false);
      router.push("/login");
      return;
    }

    getNotifications();
  }, [getNotifications, isLogin, router, setIsCheckingToken]);

  useEffect(() => {
    trackVisitor("notifications");
  }, []);

  useEffect(() => {
    const handleReadOnLoad = async () => {
      await getNotifications();
      const hasUnread = Array.isArray(notices) && notices.some((n) => !n.read);
      if (hasUnread) await markAllUnreadAsRead();
    };

    handleReadOnLoad();
  }, []);

  if (isCheckingToken) {
    return <div className="mt-10 text-center">Checking session...</div>;
  }

  return (
    <AccountPageShell
      activePath="/notifications"
      title="Notifications"
      description="See account updates, enquiry alerts, and SNSF messages in one place."
    >
      <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {notices?.length > 0 ? (
          <div className="space-y-3">
            {notices.map((notice, index) => (
              <button
                type="button"
                key={notice?._id || index}
                className="flex w-full items-start gap-3 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg sm:p-5"
                onClick={() => {
                  if (notice?.link) router.push(notice.link);
                }}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-xs font-bold text-white">
                  {getStatusIcon(notice.message)}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className="block text-sm font-semibold leading-6 text-slate-800"
                    dangerouslySetInnerHTML={{ __html: notice.message }}
                  />
                  <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {new Date(notice.createdAt).toLocaleString()}
                  </span>
                </span>
                {!notice.read && (
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
            <h2 className="text-lg font-bold text-slate-950 sm:text-2xl">
              No Notifications Yet
            </h2>
            <p className="mt-2 max-w-sm text-sm text-slate-500 sm:text-base">
              You currently do not have any notifications. We will keep you posted.
            </p>
            <Link
              href="/"
              className="mt-6 rounded-xl bg-slate-950 px-5 py-2 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 sm:px-6 sm:text-base"
            >
              Back to Home
            </Link>
          </div>
        )}
      </section>
    </AccountPageShell>
  );
};

export default Account;
