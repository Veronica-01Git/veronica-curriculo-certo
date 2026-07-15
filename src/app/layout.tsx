import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "@/components/SessionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "VERONICA - Currículo Certo | Currículo aprovado por ATS",
  description:
    "Transforme seu currículo em um PDF otimizado para passar por qualquer sistema de rastreamento de candidatos (ATS). Envie, otimize e baixe em minutos.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
