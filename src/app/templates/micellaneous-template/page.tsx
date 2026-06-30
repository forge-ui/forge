import { ProtaskAuthPage } from "../_shared/protask-auth";

export default function MicellaneousTemplatePage() {
  return (
    <ProtaskAuthPage
      mode="login"
      basePath="/templates/micellaneous-template"
      enterPath="/templates/micellaneous-template/calendar"
      previewImage="/images/protask/auth-login.jpg"
    />
  );
}
