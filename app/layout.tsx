import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tintern - Find Your Perfect Internship",
  description: "Connecting students with meaningful internship opportunities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
