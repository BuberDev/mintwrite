import ForgotPasswordPage from "@/components/auth/ForgotPasswordPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <ForgotPasswordPage />
    </Suspense>
  );
}
