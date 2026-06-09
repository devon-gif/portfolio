import type { Contact, OutreachQueueItem } from "./types";
import { scoreContact } from "./scoring";

function daysBetween(a: string, b: string): number {
  return Math.abs(
    (new Date(a).getTime() - new Date(b).getTime()) / (1000 * 60 * 60 * 24)
  );
}

function generateEmailDraft(contact: Contact): string {
  const name = contact.first_name;
  const company = contact.company_name;

  if (contact.contact_type === "buyer") {
    return `Hi ${name},\n\nI came across ${company} and was impressed by what you're building. I work with hotel owners and operators to drive revenue growth and commercial performance — and I'd love to explore whether there's a fit.\n\nWould you be open to a quick 20-minute call this week?\n\nBest,\n[Your Name]`;
  }

  if (contact.contact_type === "partner") {
    return `Hi ${name},\n\nI've been following ${company} and think there's a real opportunity to collaborate. We partner with hospitality groups to deliver commercial and revenue strategy solutions — and I'd love to explore synergies.\n\nOpen to a brief call?\n\nBest,\n[Your Name]`;
  }

  return `Hi ${name},\n\nI hope this finds you well. I wanted to reach out regarding ${company} and explore how we might be able to work together.\n\nWould you have 15 minutes for a call this week?\n\nBest,\n[Your Name]`;
}

function generateLinkedInDraft(contact: Contact): string {
  const name = contact.first_name;

  if (contact.contact_type === "buyer") {
    return `Hi ${name}, I work with hotel owners and management companies on commercial growth — noticed your work at ${contact.company_name} and thought there might be a great fit. Would love to connect!`;
  }

  if (contact.contact_type === "partner") {
    return `Hi ${name}, love what ${contact.company_name} is doing. I focus on hospitality commercial strategy and see a real opportunity to collaborate. Let's connect!`;
  }

  return `Hi ${name}, I'd love to connect and explore potential synergies between our work in hospitality.`;
}

export function generateQueue(
  contacts: Contact[],
  existingQueue: OutreachQueueItem[],
  limit = 40
): OutreachQueueItem[] {
  const today = new Date().toISOString();

  const recentlyContactedIds = new Set<string>();

  for (const item of existingQueue) {
    recentlyContactedIds.add(item.contact_id);
  }

  for (const contact of contacts) {
    if (
      contact.last_contacted_at &&
      daysBetween(contact.last_contacted_at, today) <= 14
    ) {
      recentlyContactedIds.add(contact.id);
    }
  }

  const eligible = contacts.filter(
    (c) => !c.suppressed && !c.opted_out && !recentlyContactedIds.has(c.id)
  );

  const scored = eligible.map((c) => ({ contact: c, score: scoreContact(c) }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const aDate = a.contact.last_contacted_at
      ? new Date(a.contact.last_contacted_at).getTime()
      : 0;
    const bDate = b.contact.last_contacted_at
      ? new Date(b.contact.last_contacted_at).getTime()
      : 0;
    return aDate - bDate;
  });

  const selected = scored.slice(0, limit);

  return selected.map(({ contact, score }) => ({
    id: `queue-${contact.id}-${Date.now()}-${Math.random()}`,
    contact_id: contact.id,
    contact,
    date: today,
    status: "draft" as const,
    email_draft: contact.email ? generateEmailDraft(contact) : null,
    linkedin_draft: contact.linkedin_url ? generateLinkedInDraft(contact) : null,
    score,
    sent_at: null,
    created_at: today,
    updated_at: today,
  }));
}
