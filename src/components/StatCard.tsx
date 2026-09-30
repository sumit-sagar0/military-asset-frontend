
interface StatCardProps {
  label: string;
  value: number | string;
  color?: string;
  subtitle?: string;
}

export default function StatCard({ label, value, color = 'text-slate-800', subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}
