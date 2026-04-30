import { NextResponse } from "next/server";

const MAILCHIMP_SUBSCRIBE_URL =
  "https://primaryphotographic.us5.list-manage.com/subscribe?u=bc90f35d3342f62552898be17&id=2a99938976";

function extractField(
  html: string,
  fieldName: string,
): string | null {
  const escaped = fieldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `<input[^>]*type=["']hidden["'][^>]*name=["']${escaped}["'][^>]*value=["']([^"']*)["']`,
    "i",
  );
  const match = html.match(regex);
  return match?.[1] ?? null;
}

function stripHtml(raw: string): string {
  return raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body?.email?.trim() || "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, message: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const hostedHtml = await fetch(MAILCHIMP_SUBSCRIBE_URL, {
      cache: "no-store",
    }).then((res) => res.text());
    const action =
      hostedHtml.match(/<form[^>]*action=["']([^"']+)["']/i)?.[1] || "";
    if (!action) {
      return NextResponse.json(
        { ok: false, message: "Subscription failed. Please try again." },
        { status: 500 },
      );
    }

    const formBody = new URLSearchParams();
    for (const field of ["u", "id", "ht", "mc_signupsource"]) {
      const value = extractField(hostedHtml, field);
      if (value) formBody.set(field, value);
    }
    formBody.set("EMAIL", email);

    const responseHtml = await fetch(action, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: formBody.toString(),
      cache: "no-store",
    }).then((res) => res.text());

    const normalized = stripHtml(responseHtml).toLowerCase();
    if (
      normalized.includes("looks fake or invalid") ||
      normalized.includes("please enter a value") ||
      normalized.includes("too many subscribe attempts")
    ) {
      return NextResponse.json(
        { ok: false, message: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    if (normalized.includes("already subscribed")) {
      return NextResponse.json({
        ok: true,
        message: "ALREADY SUBSCRIBED",
      });
    }

    return NextResponse.json({
      ok: true,
      message: "THANK YOU",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Subscription failed. Please try again." },
      { status: 500 },
    );
  }
}

