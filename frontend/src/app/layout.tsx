import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Your App Name",
  description: "Your app description",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}