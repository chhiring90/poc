import type { Metadata } from "next";
import {
  Inter,
  Inter_Tight,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layouts/home/header";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteSettings, isIndexingAllowed } from "@/lib/seo/get-site-settings";
import { getSiteUrl } from "@/lib/seo/site-url";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const indexable = isIndexingAllowed(settings);
  const homeTitle = settings.defaultTitle ?? settings.siteName;

  return {
    metadataBase: new URL(getSiteUrl()),
    applicationName: settings.siteName,
    title: { default: homeTitle, template: `%s | ${settings.siteName}` },
    description: settings.defaultDescription ?? undefined,
    openGraph: {
      type: "website",
      siteName: settings.siteName,
      locale: settings.locale,
    },
    twitter: {
      card: "summary_large_image",
      ...(settings.twitterHandle
        ? { site: settings.twitterHandle, creator: settings.twitterHandle }
        : {}),
    },
    robots: indexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: false },
    verification: {
      google: settings.verification.google ?? undefined,
      ...(settings.verification.bing
        ? { other: { "msvalidate.01": settings.verification.bing } }
        : {}),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        spaceGrotesk.variable,
        interTight.variable,
        inter.variable,
        jetBrainsMono.variable,
      )}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
