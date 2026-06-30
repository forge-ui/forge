import { ProtaskAuthPage } from "../_shared/protask-auth";

export default function CrmTemplatePage() {
  return (
    <ProtaskAuthPage
      mode="login"
      basePath="/templates/crm-template"
      enterPath="/templates/crm-template/customers"
      previewImage="/images/protask/auth-login.jpg"
    />
  );
}
