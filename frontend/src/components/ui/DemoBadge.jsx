export default function DemoBadge({ label = 'Demo/MVP' }) {
  return (
    <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-700">
      {label}
    </span>
  );
}
