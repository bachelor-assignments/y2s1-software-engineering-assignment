import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./layout.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DAM System",
  description: "Digital Asset Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="dam-header">
          {/* Logo on the left */}
          <a href="/" className="logo-link">
            <h1>DAM</h1>
          </a>

          {/* search bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search assets..."
              className="search-input"
              id="global-search"
            />
          </div>

          <div className="header-spacer"></div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
