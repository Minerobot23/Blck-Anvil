import { SIZE_GUIDE } from "@/data/sizeGuide";

export function SizeTable({ gender }: { gender: "men" | "women" }) {
  const g = SIZE_GUIDE[gender];
  return (
    <div className="no-scrollbar overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <caption className="sr-only">{gender === "men" ? "Men's" : "Women's"} body measurements</caption>
        <thead>
          <tr className="border-b border-white/15">
            {g.columns.map((c) => (
              <th key={c} scope="col" className="py-3 pr-4 text-[11px] font-normal tracking-[0.14em] text-mute uppercase">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {g.rows.map((r) => (
            <tr key={r[0]} className="border-b border-white/[0.07]">
              {r.map((cell, i) => (i === 0 ? <th key={i} scope="row" className="py-3 pr-4 font-medium">{cell}</th> : <td key={i} className="py-3 pr-4 text-fog tabular-nums">{cell}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
