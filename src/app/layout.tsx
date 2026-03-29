import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "WA Careers Platform — Workload Automation Jobs, Hyderabad",
  description:
    "Career acceleration platform for women entering Workload Automation consulting. Job scanner, AI mock interviews, learning tracks, and ATS resume builder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
