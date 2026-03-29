import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <SignIn routing="hash" fallbackRedirectUrl="/dashboard" />
    </div>
  );
}
