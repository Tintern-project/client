import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tintern | Change How You Think About Applications",
  description:
    "Spend less time searching for jobs with Tintern. Our easy swiping mechanism saves you 30 hours a week.",
  keywords: "job search, application, career, employment, tintern",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className="pt-27 pb-24">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
