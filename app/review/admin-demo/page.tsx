import { redirect } from "next/navigation";

export default function ValenciaAdminDemoPage() {
  redirect("/review/admin?demo=1");
}
