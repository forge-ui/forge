import { ProtaskAuthPage } from "../../_shared/protask-auth";

export default function CrmResetPasswordPage() {
  return (
    <ProtaskAuthPage
      mode="reset"
      basePath="/templates/crm-template"
      enterPath="/templates/crm-template/customers"
      previewImage="/images/protask/auth-login.jpg"
    />
  );
}
