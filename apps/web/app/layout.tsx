import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Virtual Pet — E-commerce de mascotas",
  description: "Virtual Pet nunca defraudará a su mascota. Tienda online en Mar del Plata.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--background)] text-zinc-900">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="mt-auto border-t border-[var(--vp-border)] bg-white py-10">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-zinc-500">
            <p className="font-semibold text-[var(--vp-primary-dark)]">Virtual Pet</p>
            <p className="mt-1">© {new Date().getFullYear()} — Mar del Plata. Cuidamos a tu mascota.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
