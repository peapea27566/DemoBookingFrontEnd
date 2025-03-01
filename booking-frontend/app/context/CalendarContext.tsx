"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "../models/Booking";
import BookingService from "../services/BookingService";

interface UserContextType {
  user: User | null;
  monthYear : {month : number , year : number} | null;
  setMonthYear : (value : {month : number , year : number}) => void;
}

const CalendarContext = createContext<UserContextType | undefined>(undefined);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider component
export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [monthYear, setMonthYear] = useState<{month : number , year : number} | null>(null);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await BookingService.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);
  return (
    <CalendarContext.Provider value={{ user ,monthYear ,setMonthYear }}>{children}</CalendarContext.Provider>
  );
};
