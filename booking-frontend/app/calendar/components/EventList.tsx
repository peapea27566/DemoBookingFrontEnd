import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Event } from "@/app/models/Event";
import moment from "moment";
import { useCalendar } from "@/app/context/CalendarContext";

interface EventListProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
}

export default function EventList({ events, onSelectEvent }: EventListProps) {
  const statusColors: { [key: number]: string } = {
    0: "bg-green-500",
    1: "bg-blue-500",
    2: "bg-orange-500",
    3: "bg-red-500",
  };

  const statusLabels: { [key: number]: string } = {
    0: "Wait",
    1: "Check-in",
    2: "Check-out",
    3: "Reject",
  };

  const { monthYear } = useCalendar();
  const [formattedMonthYear, setFormattedMonthYear] = useState("");

  const updateFormattedMonthYear = useCallback(() => {
    if (monthYear) {
      setFormattedMonthYear(
        new Intl.DateTimeFormat("en-US", {
          month: "long",
          year: "numeric",
        }).format(new Date(monthYear.year, monthYear.month - 1))
      );
    }
  }, [monthYear]);

  const filterEventsByMonthYear = useCallback(
    (events: Event[], monthYear: { month: number; year: number } | null) => {
      if (!monthYear) return events;

      return events.filter((event) => {
        const checkInDate = new Date(event.booking.checkInDate);
        const checkOutDate = new Date(event.booking.checkOutDate);

        return (
          (checkInDate.getMonth() + 1 === monthYear.month &&
            checkInDate.getFullYear() === monthYear.year) ||
          (checkOutDate.getMonth() + 1 === monthYear.month &&
            checkOutDate.getFullYear() === monthYear.year)
        );
      });
    },
    []
  );

  const filteredEvents = useMemo(
    () => filterEventsByMonthYear(events, monthYear),
    [events, monthYear, filterEventsByMonthYear]
  );

  useEffect(() => {
    updateFormattedMonthYear();
  }, [updateFormattedMonthYear]);

  return (
    <div className="w-full xl:w-1/4 p-4 bg-white rounded-lg shadow-md order-2 xl:order-none">
      <h2 className="text-lg font-semibold mb-3">
        Events This {formattedMonthYear}
      </h2>
      {filteredEvents.length === 0 ? (
        <p className="text-gray-500">No events found for this month.</p>
      ) : (
        <ul className="space-y-2">
          {filteredEvents.map((event, index) => (
            <li
              key={index}
              className="p-2 bg-blue-100 hover:bg-blue-200 rounded-md cursor-pointer flex justify-between items-center"
              onClick={() => onSelectEvent(event)}
            >
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-gray-600">
                  {moment(event.start).format("MMM D, YYYY")} -{" "}
                  {moment(event.end).format("MMM D, YYYY")}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-white text-xs ${
                  event.isMe
                    ? statusColors[event.booking.status] || "bg-green-500"
                    : "bg-gray-500"
                }`}
              >
                {statusLabels[event.booking.status] || "Wait"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
