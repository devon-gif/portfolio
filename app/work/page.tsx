import { redirect } from "next/navigation";

/** /work is an alias for the hospitality case studies page. */
export default function WorkPage() {
  redirect("/case-studies");
}
