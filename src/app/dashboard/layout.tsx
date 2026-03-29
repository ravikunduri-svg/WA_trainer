import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Auto-create user record if webhook hasn't fired yet
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
    const name = [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || email;
    user = await prisma.user.create({
      data: { clerkId: userId, name, email },
    });
  }

  if (!user.onboardingDone) redirect("/onboarding");

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar user={{ name: user.name, email: user.email, primaryTool: user.primaryTool ?? "AUTOSYS" }} />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
