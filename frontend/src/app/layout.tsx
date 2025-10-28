import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './layout.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'DAM System',
    description: 'Digital Asset Management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <header className="dam-header">
                    {/* Logo on the left */}
                    <Link href="/" className="logo-link">
                        <h1>DAM</h1>
                    </Link>

                    <div className="header-spacer"></div>
                </header>
                <main>{children}</main>
            </body>
        </html>
    );
}

/** ys code:

import "@styles/navbar.css"; 
import Navbar from "@components/Navbar";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ padding: "20px" }}>{children}</main>
      </body>
    </html>
  );
}

 */
