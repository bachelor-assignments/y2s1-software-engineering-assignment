import "./globals.css";
import { ReactNode } from "react";
import Navbar from "../components/Navbar"; 

export const metadata = {
  title: "Your App Name",
  description: "Your app description",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar /> 
        {children}
      </body>
    </html>
  );
}