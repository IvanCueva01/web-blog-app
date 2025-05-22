import Footer from "./Footer";
import Navbar from "./Navbar";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Remove padding-top as Navbar is no longer fixed */}
      <main className="flex-grow">{children}</main>
      {/* You can add a Footer component here later */}
      <Footer />
    </div>
  );
}
