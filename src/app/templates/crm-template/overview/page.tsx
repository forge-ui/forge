import { redirect } from "next/navigation";

export default function CrmOverviewRedirectPage() {
  redirect("/templates/crm-template/customers");
}
