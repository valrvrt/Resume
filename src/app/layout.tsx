import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import LangSync from "@/components/LangSync";

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
    url: "https://valrvrt.github.io/Resume",
  },
  twitter: {
    card: "summary",
    title: "Valentin Revert | Nuclear Engineer",
    description:
      "Nuclear engineer specializing in neutronics and thermohydraulic modeling for next-generation reactors.",
  },
  alternates: {
    canonical: "https://valrvrt.github.io/Resume",
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
        {/* Skip to content link for accessibility */}
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-olive-leaf focus:text-cornsilk focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-copperwood"
        >
          Skip to main content
        </a>
        <LanguageProvider>
          {/* Keeps <html lang> in sync with the selected language client-side */}
          <LangSync />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
