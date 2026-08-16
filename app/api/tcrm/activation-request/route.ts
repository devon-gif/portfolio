import { NextResponse } from "next/server";

import {
  ACTIVATION_TIERS,
  TCRM_CLIENT_PRICING,
  customPackTotal,
} from "@/app/tcrm/tcrm-pricing";

export const runtime = "nodejs";

type Payload = {
  plan?: string;
  staticCount?: number;
  motionCount?: number;

  website?: string;

  propertyName?: string;
  propertyWebsite?: string;
  propertyLocation?: string;

  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  tcrmContact?: string;

  priorities?: string[];

  firstPromotion?: string;
  targetAudience?: string;
  importantDates?: string;
  offerDetails?: string;

  brandAssetsUrl?: string;
  brandGuidelinesUrl?: string;
  photoLibraryUrl?: string;

  instagram?: string;
  facebook?: string;

  approverName?: string;
  approverEmail?: string;
  approvalNotes?: string;

  kickoffPreference?: string;
  availabilityNotes?: string;
  additionalNotes?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function value(
  input: unknown,
) {
  const result =
    String(input || "").trim();

  return result || "Not provided";
}

function money(amount: number) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    },
  ).format(amount);
}

function resolvePlan(
  slug: string,
  staticCount: number,
  motionCount: number,
) {
  if (slug === "custom") {
    const staticQty =
      Math.max(
        0,
        Math.floor(staticCount || 0),
      );

    const motionQty =
      Math.max(
        0,
        Math.floor(motionCount || 0),
      );

    const totalAssets =
      staticQty + motionQty;

    if (
      totalAssets < 1 ||
      totalAssets > 10
    ) {
      return null;
    }

    return {
      name:
        "Build Your Own Creative Pack",

      price: customPackTotal(
        staticQty,
        motionQty,
      ),

      cadence: "one time",

      motion: motionQty,
      static: staticQty,

      totalAssets,

      scope:
        `${motionQty} motion + ${staticQty} static`,
    };
  }

  const essential =
    ACTIVATION_TIERS.find(
      (tier) =>
        tier.key === "essential",
    );

  if (slug === "starter") {
    if (!essential) return null;

    return {
      name:
        "30-Day Creative Starter",

      price:
        TCRM_CLIENT_PRICING.starter,

      cadence: "one time",

      motion:
        essential.motionConcepts,

      static:
        essential.staticConcepts,

      totalAssets:
        essential.motionConcepts +
        essential.staticConcepts,

      scope:
        `${essential.motionConcepts} motion + ${essential.staticConcepts} static`,
    };
  }

  const key =
    slug === "full-campaign"
      ? "full"
      : slug === "growth"
        ? "growth"
        : slug === "essential"
          ? "essential"
          : null;

  if (!key) return null;

  const tier =
    ACTIVATION_TIERS.find(
      (item) =>
        item.key === key,
    );

  if (!tier) return null;

  return {
    name: tier.name,
    price: tier.retail,
    cadence: "month",

    motion: tier.motionConcepts,
    static: tier.staticConcepts,

    totalAssets:
      tier.motionConcepts +
      tier.staticConcepts,

    scope:
      `${tier.motionConcepts} motion + ${tier.staticConcepts} static`,
  };
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as Payload;

    // Honeypot
    if (body.website) {
      return NextResponse.json({
        ok: true,
      });
    }

    const propertyName =
      value(body.propertyName);

    const contactName =
      value(body.contactName);

    const contactEmail =
      value(body.contactEmail);

    const planSlug =
      String(
        body.plan || "",
      ).trim();

    if (
      propertyName ===
        "Not provided" ||
      contactName ===
        "Not provided" ||
      contactEmail ===
        "Not provided" ||
      !planSlug
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Please complete the required property and contact fields.",
        },
        { status: 400 },
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        contactEmail,
      )
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Please enter a valid work email address.",
        },
        { status: 400 },
      );
    }

    const plan =
      resolvePlan(
        planSlug,
        Number(
          body.staticCount || 0,
        ),
        Number(
          body.motionCount || 0,
        ),
      );

    if (!plan) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "The selected creative plan could not be verified.",
        },
        { status: 400 },
      );
    }

    const apiKey =
      process.env.RESEND_API_KEY;

    const from =
      process.env
        .TCRM_ACTIVATION_FROM_EMAIL ||
      process.env
        .RESEND_FROM_EMAIL ||
      process.env.FROM_EMAIL;

    const recipients =
      (
        process.env
          .TCRM_ACTIVATION_EMAILS ||
        ""
      )
        .split(",")
        .map((email) =>
          email.trim(),
        )
        .filter(Boolean);

    if (
      !apiKey ||
      !from ||
      recipients.length === 0
    ) {
      console.error(
        "TCRM onboarding email configuration incomplete.",
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Email delivery is not configured yet. Please contact your TCRM representative.",
        },
        { status: 500 },
      );
    }

    const priceLabel =
      plan.cadence === "month"
        ? `${money(plan.price)}/month`
        : `${money(plan.price)} one time`;

    const priorities =
      Array.isArray(
        body.priorities,
      ) &&
      body.priorities.length
        ? body.priorities.join(", ")
        : "Not provided";

    const subject =
      `NEW TCRM ONBOARDING — ${plan.name} — ${priceLabel} — ${propertyName}`;

    const rows = [
      ["Property", propertyName],
      [
        "Property Website",
        value(body.propertyWebsite),
      ],
      [
        "Location",
        value(body.propertyLocation),
      ],
      [
        "Property Contact",
        contactName,
      ],
      [
        "Contact Email",
        contactEmail,
      ],
      [
        "Contact Phone",
        value(body.contactPhone),
      ],
      [
        "TCRM Contact",
        value(body.tcrmContact),
      ],
    ];

    const renderRows =
      rows
        .map(
          ([label, content]) => `
          <tr>
            <td style="padding:9px 0;color:#6b756e;vertical-align:top;">
              ${escapeHtml(label)}
            </td>

            <td style="padding:9px 0;text-align:right;font-weight:600;color:#18372c;">
              ${escapeHtml(content)}
            </td>
          </tr>
        `,
        )
        .join("");

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:720px;margin:auto;color:#17362b;">
        <div style="padding:30px;background:#10251d;color:#fff;border-radius:18px 18px 0 0;">
          <div style="font-size:10px;letter-spacing:2px;color:#bed99e;margin-bottom:8px;">
            TCRM CREATIVE ACTIVATION
          </div>

          <h1 style="font-size:27px;margin:0;">
            New Creative Onboarding
          </h1>

          <p style="margin:10px 0 0;color:#cbd7cf;">
            ${escapeHtml(propertyName)}
          </p>
        </div>

        <div style="padding:30px;border:1px solid #e3ded3;border-top:0;border-radius:0 0 18px 18px;background:#faf8f3;">

          <div style="padding:20px;background:#e8f1e8;border-radius:14px;margin-bottom:26px;">
            <div style="font-size:10px;letter-spacing:1.4px;color:#687970;margin-bottom:6px;">
              SELECTED PLAN
            </div>

            <div style="font-size:20px;font-weight:700;color:#17372b;">
              ${escapeHtml(plan.name)}
            </div>

            <div style="margin-top:8px;color:#147562;font-weight:700;">
              ${escapeHtml(priceLabel)}
            </div>

            <div style="margin-top:5px;color:#526159;">
              ${plan.motion} motion ·
              ${plan.static} static ·
              ${plan.totalAssets} total creative assets
            </div>
          </div>

          <h2 style="font-size:17px;margin:0 0 10px;">
            Property & Contact
          </h2>

          <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:28px;">
            ${renderRows}
          </table>

          <h2 style="font-size:17px;margin:0 0 12px;">
            Creative Priorities
          </h2>

          <div style="padding:18px;background:#fff;border:1px solid #e5e0d6;border-radius:12px;line-height:1.6;font-size:13px;margin-bottom:26px;">
            <strong>Priority areas:</strong>
            ${escapeHtml(priorities)}
            <br><br>

            <strong>First promotion:</strong><br>
            ${escapeHtml(value(body.firstPromotion)).replaceAll("\n","<br>")}
            <br><br>

            <strong>Target audience:</strong><br>
            ${escapeHtml(value(body.targetAudience)).replaceAll("\n","<br>")}
            <br><br>

            <strong>Important dates:</strong>
            ${escapeHtml(value(body.importantDates))}
            <br>

            <strong>Offer details:</strong>
            ${escapeHtml(value(body.offerDetails))}
          </div>

          <h2 style="font-size:17px;margin:0 0 12px;">
            Brand Assets
          </h2>

          <div style="padding:18px;background:#fff;border:1px solid #e5e0d6;border-radius:12px;line-height:1.75;font-size:13px;margin-bottom:26px;">
            <strong>Main asset folder:</strong>
            ${escapeHtml(value(body.brandAssetsUrl))}
            <br>

            <strong>Brand guidelines:</strong>
            ${escapeHtml(value(body.brandGuidelinesUrl))}
            <br>

            <strong>Photo/video library:</strong>
            ${escapeHtml(value(body.photoLibraryUrl))}
            <br>

            <strong>Instagram:</strong>
            ${escapeHtml(value(body.instagram))}
            <br>

            <strong>Facebook:</strong>
            ${escapeHtml(value(body.facebook))}
          </div>

          <h2 style="font-size:17px;margin:0 0 12px;">
            Approval & Kickoff
          </h2>

          <div style="padding:18px;background:#fff;border:1px solid #e5e0d6;border-radius:12px;line-height:1.7;font-size:13px;">
            <strong>Approver:</strong>
            ${escapeHtml(value(body.approverName))}
            <br>

            <strong>Approver email:</strong>
            ${escapeHtml(value(body.approverEmail))}
            <br><br>

            <strong>Approval notes:</strong><br>
            ${escapeHtml(value(body.approvalNotes)).replaceAll("\n","<br>")}
            <br><br>

            <strong>Kickoff preference:</strong>
            ${escapeHtml(value(body.kickoffPreference))}
            <br>

            <strong>Availability:</strong>
            ${escapeHtml(value(body.availabilityNotes))}
            <br><br>

            <strong>Additional notes:</strong><br>
            ${escapeHtml(value(body.additionalNotes)).replaceAll("\n","<br>")}
          </div>

          <div style="margin-top:26px;padding:18px;background:#17372b;color:#fff;border-radius:12px;line-height:1.6;font-size:13px;">
            <strong>Next step:</strong>
            TCRM confirms payment and activation.
            Archer Design can then review assets,
            schedule a kickoff if requested,
            and begin production.
          </div>
        </div>
      </div>
    `;

    const text = `
NEW TCRM CREATIVE ONBOARDING

SELECTED PLAN
${plan.name}
${priceLabel}
Motion: ${plan.motion}
Static: ${plan.static}
Total Assets: ${plan.totalAssets}

PROPERTY
Property: ${propertyName}
Website: ${value(body.propertyWebsite)}
Location: ${value(body.propertyLocation)}

CONTACT
Name: ${contactName}
Email: ${contactEmail}
Phone: ${value(body.contactPhone)}
TCRM Contact: ${value(body.tcrmContact)}

CREATIVE PRIORITIES
Priority Areas: ${priorities}
First Promotion: ${value(body.firstPromotion)}
Target Audience: ${value(body.targetAudience)}
Important Dates: ${value(body.importantDates)}
Offer Details: ${value(body.offerDetails)}

BRAND ASSETS
Main Asset Folder: ${value(body.brandAssetsUrl)}
Brand Guidelines: ${value(body.brandGuidelinesUrl)}
Photo / Video Library: ${value(body.photoLibraryUrl)}
Instagram: ${value(body.instagram)}
Facebook: ${value(body.facebook)}

APPROVAL
Approver: ${value(body.approverName)}
Approver Email: ${value(body.approverEmail)}
Approval Notes: ${value(body.approvalNotes)}

KICKOFF
Preference: ${value(body.kickoffPreference)}
Availability: ${value(body.availabilityNotes)}

ADDITIONAL NOTES
${value(body.additionalNotes)}

NEXT STEP
TCRM confirms payment and activation.
Archer Design then reviews assets,
coordinates kickoff if requested,
and begins production.
    `.trim();

    const response =
      await fetch(
        "https://api.resend.com/emails",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${apiKey}`,

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            from,
            to: recipients,

            reply_to:
              contactEmail,

            subject,
            html,
            text,
          }),
        },
      );

    const result =
      await response.json();

    if (!response.ok) {
      console.error(
        "Resend onboarding error:",
        result,
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Your onboarding could not be emailed. Please try again.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      emailId:
        result.id || null,
    });
  } catch (error) {
    console.error(
      "TCRM onboarding error:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Something went wrong while submitting your onboarding.",
      },
      { status: 500 },
    );
  }
}
