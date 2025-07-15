import { ReactNode } from "react";
import Navbar from "./Navbar";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex flex-col overflow-x-hidden">
      <Navbar />
      <Header />
      <main
        className="flex-1 pt-14 px-4 pb-8 w-full"
        style={{ marginTop: "130px" }}
      >
        {children}
      </main>
    </div>
  );
}
