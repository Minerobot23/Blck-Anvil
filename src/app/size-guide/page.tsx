import type { Metadata } from "next";
import { PageHeader } from "@/components/Page";
import { SizeTable } from "@/components/SizeTable";

export const metadata: Metadata = { title: "Size Guide", description: "BLK ANVL size charts for men and women." };

export default function Page() {
  return (
    <div className="pb-28">
      <PageHeader title={["Size", "Guide"]} intro="Body measurements in inches and centimetres. Each product page also lists its specific fit." />
      <div className="gutter grid gap-16 lg:grid-cols-2">
        <section><h2 className="display mb-6 text-5xl">Men</h2><SizeTable gender="men" /></section>
        <section><h2 className="display mb-6 text-5xl">Women</h2><SizeTable gender="women" /></section>
      </div>
      <div className="gutter mt-16 grid gap-8 text-sm text-fog md:grid-cols-3">
        <p><span className="text-bone">Chest / bust.</span> Measure around the fullest part, keeping the tape level under your arms.</p>
        <p><span className="text-bone">Waist.</span> Measure around your natural waistline, the narrowest part of your torso.</p>
        <p><span className="text-bone">Hip.</span> Stand with feet together and measure around the fullest part of your hips.</p>
      </div>
      <p className="gutter mt-12 text-[11px] text-mute">Placeholder measurements — to be confirmed against final graded specifications before launch.</p>
    </div>
  );
}
