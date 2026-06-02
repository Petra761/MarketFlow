import { Link } from "react-router-dom";

interface AddProductCardProps {
  to: string;
}

export default function AddProductCard({ to }: AddProductCardProps) {
  return (
    <Link
      to={to}
      className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-[#30718d] transition hover:border-[#30718d] hover:bg-slate-100"
    >
      <span className="text-5xl font-light leading-none">+</span>
      <span className="mt-2 text-sm font-semibold">Agregar producto</span>
    </Link>
  );
}
