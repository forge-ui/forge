import { ProtaskAuthPage } from "../../_shared/protask-auth";

export default function MicellaneousForgotPasswordPage() {
  return (
    <ProtaskAuthPage
      mode="forgot"
      basePath="/templates/micellaneous-template"
      enterPath="/templates/micellaneous-template/calendar"
      previewImage="/images/protask/auth-login.jpg"
    />
  );
}
