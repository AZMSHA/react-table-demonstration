import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  authors: [
    {
      name: "Hashir Adnan Hassan",
      url: "https://www.linkedin.com/in/hashir-adnan-hassan/",
    },
  ],
  title: "React Table",
  description:
    "This is a demonstration on how to use Next.js, React Table and MUI together to create a table with filter and sort options",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
