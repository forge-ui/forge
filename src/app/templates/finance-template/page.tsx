import { ProtaskAuthPage } from "../_shared/protask-auth";

export default function FinanceTemplateRootPage() {
  return (
    <ProtaskAuthPage
      mode="login"
      basePath="/templates/finance-template"
      enterPath="/templates/finance-template/wealth"
      previewImage="/images/protask/auth-login.jpg"
    />
  );
}
