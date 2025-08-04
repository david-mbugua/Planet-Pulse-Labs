import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "PLANET PULSE AI",
  description: "Climate-Smart Agriculture & Environment Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} bg-gray-50 font-roboto antialiased transition-colors duration-300`}
      >
        {children}
      </body>
    </html>
  );
}
