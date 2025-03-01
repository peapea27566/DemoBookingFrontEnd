"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import BookingService from "../../services/BookingService";
import { Event } from "../../models/Event";
import { toast } from "react-toastify";
import ModalDetailBooking, {
  DateCallback,
} from "../../components/ModalDetailBooking";
import { CustomToolbar } from "./CustomToolbar";
import { isToday } from "date-fns";
import { useCalendar } from "../../context/CalendarContext";
import EventList from "./EventList";
import { useLoading } from "@/app/context/LoadingContext";

const localizer = momentLocalizer(moment);

export function CalendarBooking() {
  var colorEvn = "green";
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, setMonthYear } = useCalendar();

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        var now = new Date();
        setMonthYear({ year: now.getFullYear(), month: now.getMonth() + 1 });
        await fetchBookingData(now.getFullYear(), now.getMonth() + 1);
        new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        toast.error(`Error in fetchData: ${error}`);
      }finally{
       
      }
    };
    
    fetchData();
  }, [user]);

  const fetchBookingData = async (year: number, month: number) => {
    try {
      if(!user) return
      const bookings = await BookingService.getBookings(year, month);
      const mappedEvents = bookings.map((booking) => ({
        title: `(${booking.user.name}) ${booking.note ?? ""}`,
        start: new Date(booking.checkInDate),
        end: new Date(booking.checkOutDate),
        allDay: false,
        colorEvn: booking.user.id === user?.id ? colorEvn : "orange",
        status: booking.status,
        booking: booking,
        isMe: booking.user.id === user?.id,
        isToday: isToday(new Date(booking.checkInDate)),
      }));

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const eventStyleGetter = (event: Event) => {
    let backgroundColor = event.isMe ? "green" : "grey";
    const status = event.booking.status;
    if (event.isMe) {
      if (status === 1) {
        backgroundColor = "blue";
      }
      if (status === 2) {
        backgroundColor = "orange";
      }
    }
    if (status === 3) {
      backgroundColor = "red";
    }

    return {
      style: {
        backgroundColor: backgroundColor,
        color: "white",
        borderRadius: "5px",
        padding: "5px",
        border: "none",
      },
    };
  };

  const handleNavigate = (date: any, view: any) => {
    console.log(date)
    setMonthYear({ year: date.getFullYear(), month: date.getMonth() + 1 });
    fetchBookingData(date.getFullYear(), date.getMonth() + 1);
  };

  const handleUpdateBooking = (selectedDate: DateCallback) => {
    setMonthYear({ year: selectedDate.year, month: selectedDate.month });
    fetchBookingData(selectedDate.year, selectedDate.month);
  };

  return (
    <div className="flex flex-col xl:flex-row items-start space-y-4 xl:space-y-0 xl:space-x-4">
      <div className="w-full xl:w-3/4 p-4 bg-gray-100 rounded-lg shadow-md order-1 xl:order-none">
      <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "70vh" }}
          views={{ month: true }}
          defaultView={Views.MONTH}
          selectable
          onSelectEvent={handleEventClick}
          eventPropGetter={eventStyleGetter}
          onNavigate={handleNavigate}
          components={{
            toolbar: (props) => (
              <CustomToolbar {...props} createSuccess={handleUpdateBooking} />
            ),
          }}
        />
      </div>

      <EventList events={events} onSelectEvent={handleEventClick} />

      <ModalDetailBooking
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedEvent={selectedEvent}
        updateSuccess={handleUpdateBooking}
      />
    </div>
  );
}
