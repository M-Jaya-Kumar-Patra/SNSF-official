"use client";

import React from "react";

export default function ProductSpecs({
  specs,
  title = "Product Specifications",
}) {
  const entries = Object.entries(specs || {}).filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );

  if (!entries.length) return null;

  const formatKey = (key) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

  return (
    <section className="mt-6 w-full overflow-hidden border border-slate-200 bg-white shadow-sm">
      <h3 className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-[17px] font-semibold text-slate-800 sm:px-6 sm:text-[18px]">
        {title}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[300px] border-collapse text-left text-[14px] sm:text-[15px]">
          <tbody>
            {entries.map(([key, value], index) => (
              <tr
                key={key}
                className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                <th
                  scope="row"
                  className="w-[42%] border-b border-slate-100 px-4 py-3 font-semibold capitalize text-slate-700 sm:px-6"
                >
                  {formatKey(key)}
                </th>
                <td className="border-b border-slate-100 px-4 py-3 font-medium text-slate-800 sm:px-6">
                  {String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
