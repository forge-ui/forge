import { ProtaskAuthPage } from "../../_shared/protask-auth";

export default function MicellaneousResetPasswordPage() {
  return (
    <ProtaskAuthPage
      mode="reset"
      basePath="/templates/micellaneous-template"
      enterPath="/templates/micellaneous-template/calendar"
      previewImage="/images/protask/auth-login.jpg"
    />
  );
}
