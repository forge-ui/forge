import { ProtaskAuthPage } from "../../_shared/protask-auth";

export default function FinanceResetPasswordPage() {
  return (
    <ProtaskAuthPage
      mode="reset"
      basePath="/templates/finance-template"
      enterPath="/templates/finance-template/overview"
      previewImage="/images/protask/auth-login.jpg"
    />
  );
}
