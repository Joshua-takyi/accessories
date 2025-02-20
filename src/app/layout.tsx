import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query";
import { Toaster } from "sonner";
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const Rauschen = localFont({
  src: "../fonts/Rauschen-BBook-Web.woff",
  variable: "--font-Rauschen-BBook-Web",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PhoneXcess | Premium Phone Accessories Online",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${Rauschen.variable}`}
    >
      <body className="antialiased">
        <Toaster
          position="top-right"
          toastOptions={{ duration: 2000 }}
          richColors={true}
        />
        <QueryProvider>
          {/* <Nav /> Uncomment when navigation is ready */}
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
