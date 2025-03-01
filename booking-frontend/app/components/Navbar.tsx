"use client";

import { useCalendar } from "../context/CalendarContext";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react"; // Import Logout Icon

const Navbar = ({ title }: { title: string }) => {
  const { user } = useCalendar();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  return (
    <nav className="top-0 left-0 w-full bg-white shadow-md py-3 px-6 flex items-center justify-between z-50">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

      <div className="flex items-center space-x-4">
        {user && (
          <>
            <span className="text-gray-700 font-medium hidden sm:block">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              <LogOut size={20} /> 
              <span>Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
