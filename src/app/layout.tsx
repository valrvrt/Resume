import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Valentin Revert | Nuclear Engineer",
  description:
    "Nuclear engineer with experience in R&D for next-generation nuclear reactors, specializing in neutronics and thermohydraulic modeling. Based in Paris, France.",
  keywords: [
    "nuclear engineer",
    "thermohydraulic modeling",
    "neutronics",
    "OpenMC",
    "Modelica",
    "Dymola",
    "reactor physics",
    "NAAREA",
    "IMT Atlantique",
  ],
  authors: [{ name: "Valentin Revert" }],
  openGraph: {
    title: "Valentin Revert | Nuclear Engineer",
    description:
      "Nuclear engineer specializing in neutronics and thermohydraulic modeling for next-generation reactors.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-cornsilk text-black-forest font-sans">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
