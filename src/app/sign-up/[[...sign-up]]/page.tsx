import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <SignUp routing="path" path="/sign-up" fallbackRedirectUrl="/onboarding" />
    </div>
  );
}
