"use client"
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { CalendarProvider } from "../context/CalendarContext";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CalendarProvider>
      <div className="flex flex-col h-screen w-full">
        <main className="flex flex-col flex-1 overflow-y-auto">
          <Navbar title="Calendar Booking" />
          <div className="flex-grow p-6">{children}</div>
          <Footer />
        </main>
      </div>
    </CalendarProvider>
  );
}
