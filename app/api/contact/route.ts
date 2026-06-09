import { z } from "zod";
import { sendEmail } from "@/lib/sending";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  company: z.string().trim().min(1, "Company is required."),
  email: z.string().trim().email("Enter a valid email address."),
  message: z.string().trim().min(10, "Please add a short message."),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: parsed.error.issues[0]?.message || "Please complete the form." },
      { status: 400 }
    );
  }

  const { firstName, lastName, company, email, message } = parsed.data;
  const subject = `Archer Design contact form: 7-Day Trial request from ${company}`;
  const text = [
    `New contact form submission from the Archer Design website.`,
    "",
    `Name: ${firstName} ${lastName}`,
    `Company: ${company}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    await sendEmail({
      to: "heydevon@gmail.com",
      subject,
      text,
      replyTo: email,
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to send email." },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
