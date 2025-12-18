export default function Card({ title, subtitle, children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}
    >
      {(title || subtitle) && (
        <div className="px-6 pt-5 pb-3 border-b border-slate-100">
          {title && (
            <h3 className="text-base font-semibold text-slate-800">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="p-6">{children}</div>
    </div>
  );
}
