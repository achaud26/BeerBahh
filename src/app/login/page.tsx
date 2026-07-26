import { googleConfigured } from "@/lib/auth-flags";
import { LoginGate } from "@/components/LoginGate";

export default function LoginPage() {
  return <LoginGate googleEnabled={googleConfigured} callbackUrl="/radar" />;
}
