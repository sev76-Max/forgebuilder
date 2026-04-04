import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ForgeBuilder",
  description: "Générateur de sites web par IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`antialiased`}>
        {children}
      </body>
    </html>
  );
}