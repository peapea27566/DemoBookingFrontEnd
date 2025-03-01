"use client";

import { useState } from "react";
import { BookingCreate } from "../../models/Booking";
import BookingService from "../../services/BookingService";
import { toast } from "react-toastify";
import { Navigate } from "react-big-calendar";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { getCheckInCheckOut, GetYearMonth } from "../../until/DateTimeHelper";
import { useLoading } from "@/app/context/LoadingContext";


export const CustomToolbar = ({
  label,
  onNavigate,
  date,
  onView,
  createSuccess,
}: any) => {
  const { setLoading, setMessage } = useLoading();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const statuses = [
    { color: "#28a745", text: "For me" },
    { color: "#6c757d", text: "Not for me" },
    { color: "#007bff", text: "Check-in" },
    { color: "#fd7e14", text: "Check-out" },
    { color: "#dc3545", text: "Rejected" },
  ];
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 5 + i
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [bookingData, setBookingData] = useState<BookingCreate>(() => {
    const { start, end } = getCheckInCheckOut(new Date(), new Date());
    return {
      checkInDate: start.toISOString(),
      checkOutDate: end.toISOString(),
      note: "",
    };
  });

  const handleCreateBooking = async () => {
    setLoading(true);
    setMessage("Creating a reservation. Please wait a moment...");
    try {
      console.log(bookingData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await BookingService.createBooking(bookingData);
      if (response.status === 201) {
        toast.success(response.message);
        createSuccess(GetYearMonth(bookingData.checkInDate));
        clearData()
        setIsModalOpen(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearData = () =>{
    const { start, end } = getCheckInCheckOut(new Date(), new Date());
    setBookingData({
      checkInDate: start.toISOString(),
      checkOutDate: end.toISOString(),  
      note: "",
    });
  }

  return (
    <>
      <div className="flex justify-end items-center space-x-2">
        {statuses.map((status, index) => (
          <div key={index} className="flex items-center space-x-ๅ">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: status.color }}
            ></div>

            <div className="px-1 py-1 font-bold text-sm ">{status.text}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-1">
          <button
            className="px-3 py-2 bg-blue-500 text-sm text-white rounded-md shadow hover:bg-blue-600 transition"
            onClick={() => onNavigate(Navigate.PREVIOUS)}
          >
            ◀ Prev
          </button>

          <select
            className="px-3 py-2 border rounded-md text-sm text-gray-800 shadow-sm focus:ring focus:ring-blue-300"
            value={date.getMonth()}
            onChange={(e) => {
              const newDate = new Date(date);
              newDate.setMonth(Number(e.target.value));
              onNavigate(Navigate.DATE, newDate);
            }}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-2 border rounded-md text-sm  text-gray-800 shadow-sm focus:ring focus:ring-blue-300"
            value={date.getFullYear()}
            onChange={(e) => {
              const newDate = new Date(date);
              newDate.setFullYear(Number(e.target.value));
              onNavigate(Navigate.DATE, newDate);
            }}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <button
            className="px-4 py-2 bg-blue-500 text-sm text-white rounded-md shadow hover:bg-blue-600 transition"
            onClick={() => onNavigate(Navigate.NEXT)}
          >
            Next ▶
          </button>
        </div>

        <button
          className="px-4 py-2 bg-blue-500 text-sm text-white rounded-md shadow hover:bg-blue-600 transition"
          onClick={() => setIsModalOpen(true)}
        >
          + Booking
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Create Booking
            </h2>

            <DateRange
              editableDateInputs={true}
              onChange={(item) => {
                var startDate =   item.selection.startDate ?? new Date()
                var endDate  =   item.selection.endDate ?? new Date()
                console.log(startDate)
                console.log(startDate)
                
                const { start, end } = getCheckInCheckOut(
                  startDate,endDate
                );
               
               
                console.log(start.toISOString() )
                console.log(end.toISOString())

                setBookingData({
                  ...bookingData,
                  checkInDate: 
                  start.toISOString() ?? bookingData.checkInDate,
                  checkOutDate:
                  end.toISOString() ?? bookingData.checkOutDate,
                });
              }}
              moveRangeOnFirstSelection={false}
              
              ranges={[
                {
                  startDate: new Date(bookingData.checkInDate),
                  endDate: new Date(bookingData.checkOutDate),
                  key: "selection",
                },
              ]}
              minDate={new Date()}
            />

            <textarea
              className="w-full mt-3 p-2 border rounded-md"
              placeholder="Enter note..."
              value={bookingData.note}
              onChange={(e) =>
                setBookingData({ ...bookingData, note: e.target.value })
              }
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-2 py-2 bg-gray-300 text-sm rounded-md shadow hover:bg-gray-400 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-2 py-2 bg-blue-500 text-sm text-white rounded-md shadow hover:bg-blue-600 transition"
                onClick={handleCreateBooking}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
