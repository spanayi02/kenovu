import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/app-state/AppStateProvider";
import { AppChrome } from "@/components/shared/AppChrome";
import { ServiceWorkerRegister } from "@/components/shared/ServiceWorkerRegister";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kenovu | Last-minute appointments near you",
  description:
    "Discover local hair, nail, beauty and massage appointments available today at last-minute prices in Nicosia.",
  applicationName: "Kenovu",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kenovu",
  },
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/apple-touch-icon.png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#1F4D3E",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <ServiceWorkerRegister />
        <AppStateProvider>
          <AppChrome>{children}</AppChrome>
        </AppStateProvider>
      </body>
    </html>
  );
}
