import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";

import "./globals.css";

export const metadata: Metadata = {
  title: "Hospital Health Assets",
  description: "Hospital asset dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={"antialiased"}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <NuqsAdapter>
              {children}
              <Toaster />
            </NuqsAdapter>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
