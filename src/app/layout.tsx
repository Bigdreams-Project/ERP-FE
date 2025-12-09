import { CenterProvider } from "@/context/CenterContext";
import { ProviderProvider } from "@/context/ProviderContext";
import { UserProvider } from "@/context/UserContext";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-inter",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TecTerminal ERP",
  description: "Learn. Connect. Succeed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${archivo.variable} antialiased`}>
        <UserProvider>
          <CenterProvider>
            <ProviderProvider>
              <ReactQueryProvider>{children}</ReactQueryProvider>
              <ToastContainer />
            </ProviderProvider>
          </CenterProvider>
        </UserProvider>
      </body>
    </html>
  );
}
