// The single owner allowed to access the private CRM.
export const OWNER_EMAIL = "devonavich0@gmail.com";

export function isOwnerEmail(email: string | null | undefined): boolean {
  return (email ?? "").trim().toLowerCase() === OWNER_EMAIL;
}
