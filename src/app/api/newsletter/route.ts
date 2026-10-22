import { NextResponse } from "next/server";

/** Email capture is not connected to a provider yet (e.g. Klaviyo, Shopify Email). */
export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  return NextResponse.json({ ok: false, demo: true, message: "Email signup is not connected yet. Nothing was stored." });
}
