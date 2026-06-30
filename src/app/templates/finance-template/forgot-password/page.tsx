import { ProtaskAuthPage } from "../../_shared/protask-auth";

export default function FinanceForgotPasswordPage() {
  return (
    <ProtaskAuthPage
      mode="forgot"
      basePath="/templates/finance-template"
      enterPath="/templates/finance-template/overview"
      previewImage="/images/protask/auth-login.jpg"
    />
  );
}
