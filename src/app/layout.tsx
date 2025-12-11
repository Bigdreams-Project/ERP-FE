import { CenterProvider } from "@/context/CenterContext";
import { ProviderProvider } from "@/context/ProviderContext";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

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
      <body className="antialiased">
        <ThemeProvider>
          <UserProvider>
            <CenterProvider>
              <ProviderProvider>
                <ReactQueryProvider>{children}</ReactQueryProvider>
                <ToastContainer />
              </ProviderProvider>
            </CenterProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
