import type { Metadata } from "next";
import { PageHeader, DraftNotice, Prose } from "@/components/Page";

export const metadata: Metadata = { title: "Privacy Policy", robots: { index: false } };

export default function Page() {
  return (
    <div className="pb-28">
      <PageHeader title={["Privacy", "Policy"]} intro="Draft — last updated: not yet published." />
      <div className="gutter">
        <div className="max-w-2xl"><DraftNotice /></div>
        <Prose>
          <h2>Information we collect</h2>
          <p>When you place an order, create an account or sign up for emails we collect information such as your name, email address, shipping address and order history. Payment details are processed by our payment provider and are not stored by BLK ANVL.</p>
          <h2>How we use it</h2>
          <ul><li>To process and deliver orders</li><li>To provide customer support</li><li>To send marketing emails where you have opted in</li><li>To improve the website and prevent fraud</li></ul>
          <h2>Cookies</h2>
          <p>This preview stores your shopping bag in your browser&apos;s local storage. Analytics and marketing cookies, if used at launch, will be disclosed here with consent controls.</p>
          <h2>Your rights</h2>
          <p>Depending on where you live you may have rights to access, correct or delete your personal information. Contact details will be provided here at launch.</p>
        </Prose>
      </div>
    </div>
  );
}
