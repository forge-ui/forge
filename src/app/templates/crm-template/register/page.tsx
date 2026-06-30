import { ProtaskAuthPage } from "../../_shared/protask-auth";

export default function CrmRegisterPage() {
  return (
    <ProtaskAuthPage
      mode="register"
      basePath="/templates/crm-template"
      enterPath="/templates/crm-template/customers"
      previewImage="/images/protask/auth-login.jpg"
    />
  );
}
