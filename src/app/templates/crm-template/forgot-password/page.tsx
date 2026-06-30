import { ProtaskAuthPage } from "../../_shared/protask-auth";

export default function CrmForgotPasswordPage() {
  return (
    <ProtaskAuthPage
      mode="forgot"
      basePath="/templates/crm-template"
      enterPath="/templates/crm-template/customers"
      previewImage="/images/protask/auth-login.jpg"
    />
  );
}
