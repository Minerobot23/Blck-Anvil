import type { Metadata } from "next";
import { PageHeader } from "@/components/Page";
import { AccountForm } from "@/components/AccountForm";

export const metadata: Metadata = { title: "Account", robots: { index: false } };

export default function Page() {
  return (
    <>
      <PageHeader title={["Account"]} intro="Sign in to track orders and manage returns." />
      <div className="gutter pb-28"><AccountForm /></div>
    </>
  );
}
