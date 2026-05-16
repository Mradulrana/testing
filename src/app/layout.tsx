import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFAB from "@/components/ui/WhatsAppFAB";
import Chatbot from "@/components/ui/Chatbot";
import { PropertyProvider } from "@/context/PropertyContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ZameenMarket",
  description: "Find your perfect home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PropertyProvider>
            <Navbar />
            <main style={{ minHeight: "calc(100vh - 60px)" }}>
              {children}
            </main>
            <Footer />
            <WhatsAppFAB />
            <Chatbot />
          </PropertyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
