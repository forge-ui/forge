import { ProtaskAuthPage } from "../../_shared/protask-auth";

export default function MicellaneousRegisterPage() {
  return (
    <ProtaskAuthPage
      mode="register"
      basePath="/templates/micellaneous-template"
      enterPath="/templates/micellaneous-template/calendar"
      previewImage="/images/protask/auth-login.jpg"
    />
  );
}
