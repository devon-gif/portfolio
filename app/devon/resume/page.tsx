import { redirect } from "next/navigation";

/** Keep existing shared resume URL working and point it to the PDF. */
export default function ResumeRedirect() {
  redirect("/devon/resume.pdf");
}
