import { ProtaskAuthPage } from "../../_shared/protask-auth";

export default function FinanceRegisterPage() {
  return (
    <ProtaskAuthPage
      mode="register"
      basePath="/templates/finance-template"
      enterPath="/templates/finance-template/overview"
      previewImage="/images/protask/auth-login.jpg"
    />
  );
}
